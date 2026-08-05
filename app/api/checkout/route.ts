import Stripe from "stripe";
import { supabase } from "@/lib/supabase";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

// 🔐 Initialisation Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
} as any);

// 🔥 Route POST
export async function POST(req: Request) {
  try {
    console.log("CHECKOUT API APPELÉE");
    const {
  cart,
  userId,
  nom,
  email,
  telephone,
  codePostal,
  adresse,
  shippingCost,
} = await req.json();
console.log("USER ID REÇU :", userId);

   const {
  data: { user },
} = await supabase.auth.getUser();

console.log("USER COMPLET :", user);
console.log("USER ID :", user?.id);

   console.log("CART CHECKOUT :", cart);

    // 🛒 Transformer le panier pour Stripe
    const line_items = cart.map((item: any) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // 💳 Créer session Stripe
const session = await stripe.checkout.sessions.create({
  payment_method_types: ["card"],
  line_items,
  mode: "payment",
  success_url: `${req.headers.get("origin")}/success`,
  cancel_url: `${req.headers.get("origin")}/panier`,
});
// 💾 Sauvegarde commande (JSON)

const invoiceNumber =
  `MB-${new Date().getFullYear()}-${Date.now()}`;
const { data, error } = await supabase
  .from("commandes")
 .insert([
  
    {
  user_id: userId || null,

  client: nom,
  email: email,
  telephone: telephone,
  code_postal: codePostal,
  adresse: adresse,
  shipping_cost: shippingCost,

  invoice_number: invoiceNumber,
  invoice_status: "paid",

   total:
  cart.reduce(
    (acc: number, item: any) =>
      acc + item.price * item.quantity,
    0
  ) + shippingCost,

   produits: cart.map((item: any) => ({
  id: item.id,
  name: item.name,
  price: item.price,
  image: item.image,
  quantity: item.quantity,
})),
  },
])
  .select();

console.log("SUPABASE DATA :", data);
console.log("SUPABASE ERROR :", error);

// 💾 Création / mise à jour du client
if (userId) {
  const {
  data: clientData,
  error: clientError,
} = await supabase
    .from("clients")
    .upsert(
      {
       user_id: userId,
        nom: nom,
        email: email,
        telephone: telephone,
        adresse: adresse,
        code_postal: codePostal,
        pays: "France",
      },
      {
        onConflict: "user_id",
      }
    );

  console.log("CLIENT DATA :", clientData);
console.log("CLIENT ERROR :", clientError);
}

const emailResend = await resend.emails.send({
  from: "onboarding@resend.dev",
  to: "blackdjine@gmail.com",
  subject: "Nouvelle commande Mahorayh Beauté",

  html: `
    <h2>Nouvelle commande reçue</h2>

    <p><strong>Client :</strong> ${nom}</p>
    <p><strong>Email :</strong> ${email}</p>
    <p><strong>Téléphone :</strong> ${telephone}</p>
    <p><strong>Code postal :</strong> ${codePostal}</p>
    <p><strong>Adresse :</strong> ${adresse}</p>

    <hr />

    <p><strong>Total :</strong> ${cart.reduce(
      (acc: number, item: any) =>
        acc + item.price * item.quantity,
      0
    )} €</p>
  `,
});

console.log("EMAIL RESEND :", emailResend);

// 📩 EMAIL CLIENT
const clientEmail = await resend.emails.send({
  from: "onboarding@resend.dev",
  to: email,

  subject: "Confirmation de votre commande Mahorayh Beauté 💜",

  html: `
    <div style="font-family: Arial, sans-serif; padding: 20px;">

      <h1 style="color:#7e22ce;">
        Merci pour votre commande 💜
      </h1>

      <p>
        Bonjour <strong>${nom}</strong>,
      </p>

      <p>
        Votre commande a bien été reçue par Mahorayh Beauté.
      </p>

      <hr />

      <h2>📦 Résumé de votre commande</h2>

      ${cart
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
        <strong>Total :</strong>
        ${cart.reduce(
          (acc: number, item: any) =>
            acc + item.price * item.quantity,
          0
        )} €
      </p>

      <br />

      <p>
        🚚 Votre commande sera préparée rapidement.
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

console.log("CLIENT EMAIL :", clientEmail);
    return Response.json({ url: session.url });

  } catch (error) {
    console.error("Erreur checkout:", error);
    return new Response("Erreur serveur", { status: 500 });
  }
}

