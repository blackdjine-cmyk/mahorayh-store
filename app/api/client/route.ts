import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const {
      user_id,
      nom,
      email,
      telephone,
      adresse,
      code_postal,
      ville,
      pays,
    } = await req.json();

    const { data, error } = await supabase
      .from("clients")
      .upsert(
        {
          user_id,
          nom,
          email,
          telephone,
          adresse,
          code_postal,
          ville,
          pays,
        },
        {
          onConflict: "user_id",
        }
      )
      .select();

    return NextResponse.json({
      success: !error,
      data,
      error,
    });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e },
      { status: 500 }
    );
  }
}