import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      product_id,
      client,
      note,
      commentaire,
    } = body;

    // 🔒 Vérifie si le client a acheté le produit
const { data: commandes } = await supabase
  .from("commandes")
  .select("*")
  .eq("email", client);

const achatValide = commandes?.some(
  (commande: any) =>
    commande.produits?.some(
      (produit: any) =>
        produit.id === product_id
    )
);

if (!achatValide) {
  return new Response(
    "Vous devez acheter ce produit avant de laisser un avis",
    { status: 403 }
  );
}

    const { data, error } = await supabase
      .from("reviews")
      .insert([
        {
          product_id,
          client,
          note,
          commentaire,
        },
      ])
      .select();

    if (error) {
      console.error(error);

      return new Response("Erreur ajout avis", {
        status: 500,
      });
    }

    return Response.json(data);

  } catch (error) {
    console.error(error);

    return new Response("Erreur serveur", {
      status: 500,
    });
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("*");

    if (error) {
      console.error(error);

      return new Response("Erreur récupération avis", {
        status: 500,
      });
    }

    return Response.json(data);

  } catch (error) {
    console.error(error);

    return new Response("Erreur serveur", {
      status: 500,
    });
  }
}