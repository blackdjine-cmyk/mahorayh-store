import Stripe from "stripe";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
} as any);

const resend = new Resend(process.env.RESEND_API_KEY);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return new Response("Signature Stripe manquante", {
        status: 400,
      });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log("🔔 WEBHOOK STRIPE :", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log("💳 PAIEMENT CONFIRMÉ :", session.id);
      console.log(
        "📄 NUMÉRO COMMANDE :",
        session.metadata?.invoice_number
      );

      const invoiceNumber = session.metadata?.invoice_number;

      if (!invoiceNumber) {
        console.log("❌ Numéro de commande absent");
        return Response.json({ received: true });
      }

      // 🔎 Récupérer la commande
      const { data: commande, error: commandeError } =
        await supabaseAdmin
          .from("commandes")
          .select("*")
          .eq("invoice_number", invoiceNumber)
          .single();

      if (commandeError || !commande) {
        console.error(
          "❌ COMMANDE INTROUVABLE :",
          commandeError
        );

        return new Response("Commande introuvable", {
          status: 500,
        });
      }

      // 🔐 Vérifier que Stripe indique bien que le paiement est payé
      if (session.payment_status !== "paid") {
        console.log(
          "⚠️ Paiement non confirmé :",
          session.payment_status
        );

        return Response.json({ received: true });
      }

      // 💾 Mettre la commande à jour
      const { error: updateError } = await supabaseAdmin
        .from("commandes")
        .update({
          invoice_status: "paid",
        })
        .eq("invoice_number", invoiceNumber);

      if (updateError) {
        console.error(
          "❌ ERREUR MISE À JOUR COMMANDE :",
          updateError
        );

        return new Response("Erreur Supabase", {
          status: 500,
        });
      }

      console.log(
        "✅ COMMANDE PASSÉE EN PAID :",
        invoiceNumber
      );

      // 🛍️ Produits de la commande
      const produits = commande.produits || [];

      // 📧 EMAIL VENDEUR
      const emailResend = await resend.emails.send({
        from: "commande@mahorayh-beaute.fr",
        to: "blackdjine@gmail.com",
        subject: "Nouvelle commande Mahorayh Beauté",

        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">

            <h2>🛍️ Nouvelle commande reçue</h2>

            <p>
              <strong>Numéro de commande :</strong>
              ${commande.invoice_number}
            </p>

            <p>
              <strong>Client :</strong>
              ${commande.client}
            </p>

            <p>
              <strong>Email :</strong>
              ${commande.email}
            </p>

            <p>
              <strong>Téléphone :</strong>
              ${commande.telephone}
            </p>

            <p>
              <strong>Adresse :</strong>
              ${commande.adresse}
            </p>

            <p>
              <strong>Code postal :</strong>
              ${commande.code_postal}
            </p>

            <p>
              <strong>Ville :</strong>
              ${commande.ville}
            </p>

            <hr />

            <h3>📦 Produits</h3>

            ${produits
              .map(
                (item: any) => `
                  <p>
                    <strong>${item.name}</strong><br />
                    Quantité : ${item.quantity}<br />
                    Prix : ${item.price} €
                  </p>
                `
              )
              .join("")}

            <hr />

            <p>
              <strong>Total payé :</strong>
              ${Number(commande.total).toFixed(2)} €
            </p>

          </div>
        `,
      });

      console.log("📧 EMAIL VENDEUR :", emailResend);

      // 📧 EMAIL CLIENT
      const clientEmail = await resend.emails.send({
        from: "commande@mahorayh-beaute.fr",
        to: commande.email,

        subject:
          "Confirmation de votre commande Mahorayh Beauté 💜",

        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">

            <h1 style="color:#7e22ce;">
              Merci pour votre commande 💜
            </h1>

            <p>
              Bonjour <strong>${commande.client}</strong>,
            </p>

            <p>
              Votre paiement a bien été reçu
              et votre commande est confirmée.
            </p>

            <p>
              <strong>Numéro de commande :</strong>
              ${commande.invoice_number}
            </p>

            <hr />

            <h2>📦 Résumé de votre commande</h2>

            ${produits
              .map(
                (item: any) => `
                  <div style="margin-bottom:15px;">

                    <p>
                      <strong>${item.name}</strong>
                    </p>

                    <p>
                      Quantité : ${item.quantity}
                    </p>

                    <p>
                      Prix : ${item.price} €
                    </p>

                  </div>
                `
              )
              .join("")}

            <hr />

            <p>
              <strong>Total payé :</strong>
              ${Number(commande.total).toFixed(2)} €
            </p>

            <br />

            <p>
              🚚 Votre commande va maintenant être préparée.
            </p>

            <p>
              Merci pour votre confiance 💜
            </p>

            <h3 style="color:#7e22ce;">
              Mahorayh Beauté
            </h3>

          </div>
        `,
      });

      console.log("📧 EMAIL CLIENT :", clientEmail);
    }

    return Response.json({ received: true });

  } catch (error) {
    console.error("❌ ERREUR WEBHOOK :", error);

    return new Response("Webhook Error", {
      status: 400,
    });
  }
}