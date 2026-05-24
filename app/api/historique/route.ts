import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("commandes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Erreur historique :", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les commandes" },
      { status: 500 }
    );
  }
}