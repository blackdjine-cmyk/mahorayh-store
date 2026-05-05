import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "app/data/commandes.json");

// 📥 GET
export async function GET() {
  try {
    const fileData = fs.readFileSync(filePath, "utf-8");
    const commandes = JSON.parse(fileData);

    return NextResponse.json(commandes);
  } catch {
    return NextResponse.json([]);
  }
}

// ❌ DELETE
export async function DELETE(req: Request) {
  try {
    const { index } = await req.json();

    const fileData = fs.readFileSync(filePath, "utf-8");
    let commandes = JSON.parse(fileData);

    commandes.splice(index, 1);

    fs.writeFileSync(filePath, JSON.stringify(commandes, null, 2));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false });
  }
}