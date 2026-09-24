import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    if (password === process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: "Mot de passe incorrect" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Requête invalide" },
      { status: 400 }
    );
  }
}