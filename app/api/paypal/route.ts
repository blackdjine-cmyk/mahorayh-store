import {
  Client,
  Environment,
  CheckoutPaymentIntent,
  OrdersController,
  ItemCategory,
} from "@paypal/paypal-server-sdk";

import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const paypalClient = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID!,
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET!,
  },

  environment:
    process.env.PAYPAL_ENV === "live"
      ? Environment.Production
      : Environment.Sandbox,
});

const ordersController = new OrdersController(paypalClient);

const resend = new Resend(process.env.RESEND_API_KEY);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

type ProduitCommande = {
  id: string | number;
  name: string;
  price: number;
  image?: string;
  quantity: number;
};

type DonneesCommande = {
  cart: ProduitCommande[];
  userId?: string | null;
  nom: string;
  email: string;
  telephone: string;
  codePostal: string;
  ville: string;
  adresse: string;
  shippingCost: number;
};

function genererNumeroCommande() {
  return `MB-${new Date().getFullYear()}-${Date.now()}`;
}

function euros(montant: number) {
  return montant.toFixed(2);
}

function afficherProduits(produits: ProduitCommande[]) {
  return produits
    .map(
      (item) => `
        <div style="margin-bottom:15px;">
          <strong>${item.name}</strong><br />
          Quantité : ${item.quantity}<br />
          Prix unitaire : ${euros(item.price)} €
        </div>
      `
    )
    .join("");
}

async function envoyerEmails(
  commande: Record<string, any>,
  produits: ProduitCommande[]
) {
  const resume = afficherProduits(produits);
  const total = Number(commande.total).toFixed(2);

  const emailVendeur = await resend.emails.send({
    from: "commande@mahorayh-beaute.fr",
    to: "blackdjine@gmail.com",
    subject: "Nouvelle commande PayPal - Mahorayh Beauté",

    html: `
      <div style="font-family:Arial,sans-serif;padding:20px;">
        <h2>Nouvelle commande reçue</h2>

        <p>
          <strong>Numéro de commande :</strong>
          ${commande.invoice_number}
        </p>

        <p><strong>Client :</strong> ${commande.client}</p>
        <p><strong>Email :</strong> ${commande.email}</p>
        <p><strong>Téléphone :</strong> ${commande.telephone}</p>
        <p><strong>Adresse :</strong> ${commande.adresse}</p>
        <p>
          <strong>Code postal :</strong>
          ${commande.code_postal}
        </p>
        <p><strong>Ville :</strong> ${commande.ville}</p>

        <hr />

        <h3>Produits commandés</h3>
        ${resume}

        <p>
          <strong>Livraison :</strong>
          ${Number(commande.shipping_cost || 0).toFixed(2)} €
        </p>

        <p><strong>Total payé :</strong> ${total} €</p>
        <p><strong>Paiement :</strong> PayPal confirmé</p>
      </div>
    `,
  });

  if (emailVendeur.error) {
    console.error(
      "Erreur e-mail vendeur :",
      emailVendeur.error
    );
  }

  const emailClient = await resend.emails.send({
    from: "commande@mahorayh-beaute.fr",
    to: commande.email,

    subject: "Confirmation de votre commande Mahorayh Beauté 💜",

    html: `
      <div style="font-family:Arial,sans-serif;padding:20px;">
        <h1 style="color:#7e22ce;">
          Merci pour votre commande 💜
        </h1>

        <p>Bonjour <strong>${commande.client}</strong>,</p>

        <p>
          Votre paiement PayPal a été confirmé.
          Votre commande est enregistrée.
        </p>

        <p>
          <strong>Numéro de commande :</strong>
          ${commande.invoice_number}
        </p>

        <hr />

        <h2>Résumé de votre commande</h2>
        ${resume}

        <p>
          <strong>Livraison :</strong>
          ${Number(commande.shipping_cost || 0).toFixed(2)} €
        </p>

        <p><strong>Total payé :</strong> ${total} €</p>

        <p>
          Votre commande va maintenant être préparée.
        </p>

        <h3 style="color:#7e22ce;">Mahorayh Beauté</h3>
      </div>
    `,
  });

  if (emailClient.error) {
    console.error(
      "Erreur e-mail client :",
      emailClient.error
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ==========================================
    // 1. CREATION D'UNE COMMANDE PAYPAL
    // ==========================================

    if (body.action === "create") {
      const {
        cart,
        userId,
        nom,
        email,
        telephone,
        codePostal,
        ville,
        adresse,
        shippingCost,
      } = body as DonneesCommande;

      if (
        !Array.isArray(cart) ||
        cart.length === 0 ||
        !nom ||
        !email ||
        !telephone ||
        !codePostal ||
        !ville ||
        !adresse
      ) {
        return Response.json(
          { error: "Informations de commande incomplètes." },
          { status: 400 }
        );
      }

      const livraison = Number(shippingCost);

      if (
        !Number.isFinite(livraison) ||
        livraison < 0 ||
        !cart.every(
          (item) =>
            Number.isFinite(Number(item.price)) &&
            Number(item.price) > 0 &&
            Number.isInteger(Number(item.quantity)) &&
            Number(item.quantity) > 0
        )
      ) {
        return Response.json(
          { error: "Montant ou quantité invalide." },
          { status: 400 }
        );
      }

      const sousTotal = cart.reduce(
        (total, item) =>
          total + Number(item.price) * Number(item.quantity),
        0
      );

      const total = Math.round(
        (sousTotal + livraison) * 100
      ) / 100;

      const invoiceNumber = genererNumeroCommande();

      // Création de la commande chez PayPal.
 
      const paypalResponse =
        await ordersController.createOrder({
          body: {
            intent: CheckoutPaymentIntent.Capture,
             applicationContext: {
             returnUrl: "https://www.mahorayh-beaute.fr/paypal/return",
             cancelUrl: "https://www.mahorayh-beaute.fr/panier?paypal=annule",
            },
            purchaseUnits: [
              {
                invoiceId: invoiceNumber,

                amount: {
                currencyCode: "EUR",
                value: euros(total),
                breakdown: {
                itemTotal: {
                currencyCode: "EUR",
                value: euros(sousTotal),
              },
             ...(livraison > 0
              ? {
             shipping: {
             currencyCode: "EUR",
             value: euros(livraison),
            },
           }
       : {}),
      },
      },

                items: cart.map((item) => ({
                  name: item.name.substring(0, 127),
                  quantity: String(item.quantity),

                  unitAmount: {
                    currencyCode: "EUR",
                    value: euros(Number(item.price)),
                  },
                  category: ItemCategory.PhysicalGoods,
                
                })),
    
              },
            ],
          },
        });

      const paypalOrder = paypalResponse.result;

      if (!paypalOrder.id) {
        throw new Error(
          "PayPal n'a pas retourné de numéro de commande."
        );
      }

      // Enregistrement de la commande en attente dans Supabase.
      const { error: insertError } = await supabaseAdmin
        .from("commandes")
        .insert({
          user_id: userId || null,

          client: nom,
          email,
          telephone,
          code_postal: codePostal,
          ville,
          adresse,

          shipping_cost: livraison,
          invoice_number: invoiceNumber,
          invoice_status: "pending",

          total,

          produits: [
            ...cart.map((item) => ({
              id: item.id,
              name: item.name,
              price: Number(item.price),
              image: item.image,
              quantity: Number(item.quantity),
            })),

            ...(livraison > 0
              ? [
                  {
                    id: "livraison",
                    name: "Livraison",
                    price: livraison,
                    quantity: 1,
                  },
                ]
              : []),
          ],

          // Nécessite une colonne paypal_order_id
          // dans la table commandes.
          paypal_order_id: paypalOrder.id,
        });

      if (insertError) {
        console.error(
          "Erreur enregistrement commande PayPal :",
          insertError
        );

        return Response.json(
          {
            error:
              "La commande PayPal n'a pas pu être enregistrée.",
          },
          { status: 500 }
        );
      }

      const approveLink = paypalOrder.links?.find(
      (link) => link.rel === "approve"
      )?.href;

     if (!approveLink) {
     throw new Error("Lien d'approbation PayPal introuvable.");
      }

        return Response.json({
        id: paypalOrder.id,
        invoiceNumber,
        url: approveLink,
     });
    }

    // ==========================================
    // 2. CAPTURE ET CONFIRMATION DU PAIEMENT
    // ==========================================

    if (body.action === "capture") {
      const orderId = body.orderId;

      if (
        typeof orderId !== "string" ||
        !orderId.trim()
      ) {
        return Response.json(
          { error: "Numéro de commande PayPal manquant." },
          { status: 400 }
        );
      }

      // Vérifier que cette commande existe dans notre base.
      const { data: commande, error: commandeError } =
        await supabaseAdmin
          .from("commandes")
          .select("*")
          .eq("paypal_order_id", orderId)
          .single();

      if (commandeError || !commande) {
        return Response.json(
          { error: "Commande PayPal introuvable." },
          { status: 404 }
        );
      }

      // Éviter de renvoyer les e-mails si le paiement
      // a déjà été confirmé.
      if (commande.invoice_status === "paid") {
        return Response.json({
          success: true,
          alreadyPaid: true,
          invoiceNumber: commande.invoice_number,
        });
      }

      // Capture du paiement chez PayPal.
      const captureResponse =
        await ordersController.captureOrder({
          id: orderId,
        });

     const paiement = captureResponse.result;

const capture = paiement.purchaseUnits?.[0]?.payments?.captures?.[0];

const montantCapture = Number(capture?.amount?.value);
const deviseCapture = capture?.amount?.currencyCode;

const montantCommande = Number(commande.total);

if (
  paiement.status !== "COMPLETED" ||
  capture?.status !== "COMPLETED" ||
  deviseCapture !== "EUR" ||
  !Number.isFinite(montantCapture) ||
  !Number.isFinite(montantCommande) ||
  Math.round(montantCapture * 100) !==
    Math.round(montantCommande * 100)
) {
  console.error("Vérification du paiement PayPal échouée :", {
    orderId,
    status: paiement.status,
    captureStatus: capture?.status,
    montantCapture,
    montantCommande,
    deviseCapture,
  });

  return Response.json(
    {
      error: "Le paiement PayPal n'est pas confirmé ou son montant est incorrect.",
    },
    { status: 402 }
  );
}

      // Mettre à jour uniquement une commande en attente.
      const { data: commandePayee, error: updateError } =
        await supabaseAdmin
          .from("commandes")
          .update({
            invoice_status: "paid",
          })
          .eq("invoice_number", commande.invoice_number)
          .eq("invoice_status", "pending")
          .select("*")
          .maybeSingle();

      if (updateError) {
        console.error(
          "Erreur mise à jour commande PayPal :",
          updateError
        );

        return Response.json(
          {
            error:
              "Paiement reçu, mais mise à jour de la commande impossible.",
          },
          { status: 500 }
        );
      }

      if (!commandePayee) {
        return Response.json(
          {
            error:
              "La commande a déjà été traitée ou son statut a changé.",
          },
          { status: 409 }
        );
      }

      console.log(
        "PAIEMENT PAYPAL CONFIRMÉ :",
        commande.invoice_number
      );

      // Envoi des confirmations.
      try {
        await envoyerEmails(
          commandePayee,
          commandePayee.produits || []
        );
      } catch (emailError) {
        console.error(
          "Erreur envoi des e-mails PayPal :",
          emailError
        );
      }

      return Response.json({
        success: true,
        invoiceNumber: commande.invoice_number,
        status: "paid",
      });
    }

    return Response.json(
      { error: "Action inconnue." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Erreur API PayPal :", error);

    return Response.json(
      { error: "Erreur serveur PayPal." },
      { status: 500 }
    );
  }
}