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