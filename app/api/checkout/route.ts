import Stripe from "stripe";

import { Resend } from "resend";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const resend = new Resend(process.env.RESEND_API_KEY);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

// 🔐 Initialisation Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
} as any);

// 🔥 Route POST
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const supabaseServer = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {}
      },
    },
  }
);
    console.log("CHECKOUT API APPELÉE");
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
} = await req.json();
console.log("USER ID REÇU :", userId);

const {
  data: { user },
} = await supabaseServer.auth.getUser();

console.log("USER COMPLET :", user);
console.log("USER ID :", user?.id);

   console.log("CART CHECKOUT :", cart);

   const total = cart.reduce(
  (acc: number, item: any) =>
    acc + item.price * item.quantity,
  0
) + shippingCost;

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

// 🚚 Ajouter les frais de livraison à Stripe
if (shippingCost > 0) {
  line_items.push({
    price_data: {
      currency: "eur",
      product_data: {
        name: "Livraison",
      },
      unit_amount: Math.round(shippingCost * 100),
    },
    quantity: 1,
  });
}

// 🧾 Numéro unique de commande
const invoiceNumber =
  `MB-${new Date().getFullYear()}-${Date.now()}`;
    // 💳 Créer session Stripe
const session = await stripe.checkout.sessions.create({
  payment_method_types: ["card"],
  line_items,
  mode: "payment",

  metadata: {
  invoice_number: invoiceNumber,
},

  success_url: `${req.headers.get("origin")}/success`,
  cancel_url: `${req.headers.get("origin")}/panier`,
});
// 💾 Sauvegarde commande (JSON)
console.log("VILLE REÇUE :", ville);

const { data, error } = await supabaseAdmin
  .from("commandes")
 .insert([
  
    {
  user_id: userId || null,

  client: nom,
  email: email,
  telephone: telephone,
  code_postal: codePostal,
  ville: ville,
  adresse: adresse,
  shipping_cost: shippingCost,

  invoice_number: invoiceNumber,
   invoice_status: "pending",

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

if (error) {
  return Response.json(
    { error: error.message },
    { status: 500 }
  );
}

// 💾 Création / mise à jour du client
if (userId) {
  const {
  data: clientData,
  error: clientError,
} = await supabaseAdmin
    .from("clients")
    .upsert(
      {
       user_id: userId,
        nom: nom,
        email: email,
        telephone: telephone,
        adresse: adresse,
        code_postal: codePostal,
        ville: ville,
        pays: "France",
      },
      {
        onConflict: "user_id",
      }
    );

  console.log("CLIENT DATA :", clientData);
console.log("CLIENT ERROR :", clientError);
}

    return Response.json({ url: session.url });

  } catch (error) {
    console.error("Erreur checkout:", error);
    return new Response("Erreur serveur", { status: 500 });
  }
}

