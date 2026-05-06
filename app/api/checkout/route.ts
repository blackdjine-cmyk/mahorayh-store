import Stripe from "stripe";
import fs from "fs";
import path from "path";

// 🔐 Initialisation Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
} as any);

// 🔥 Route POST
export async function POST(req: Request) {
  try {
    const { cart } = await req.json();

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
    // 📁 Sauvegarde commande (JSON)
    const filePath = path.join(process.cwd(), "app/data/commandes.json");

    let commandes = [];

    try {
      const existing = fs.readFileSync(filePath, "utf-8");
      commandes = JSON.parse(existing);
    } catch (error) {
      console.log("Fichier vide ou inexistant, création...");
    }

    commandes.push({
      cart,
      date: new Date().toISOString(),
      total: cart.reduce(
        (acc: number, item: any) =>
          acc + item.price * item.quantity,
        0
      ),
    });

    fs.writeFileSync(filePath, JSON.stringify(commandes, null, 2));

    // 🔁 Retour vers Stripe
    return Response.json({ url: session.url });

  } catch (error) {
    console.error("Erreur checkout:", error);
    return new Response("Erreur serveur", { status: 500 });
  }
}