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
   nom,
   email,
   telephone,
   codePostal,
   adresse,
   } = await req.json();

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
const { data, error } = await supabase
  .from("commandes")
  .insert([
   {
  client: nom,
  email: email,
  telephone: telephone,
  code_postal: codePostal,
  adresse: adresse,

  total: cart.reduce(
    (acc: number, item: any) =>
      acc + item.price * item.quantity,
    0
  ),

  produits: JSON.parse(JSON.stringify(cart)),
},
  ])
  .select();

console.log("SUPABASE DATA :", data);
console.log("SUPABASE ERROR :", error);
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
    return Response.json({ url: session.url });

  } catch (error) {
    console.error("Erreur checkout:", error);
    return new Response("Erreur serveur", { status: 500 });
  }
}