"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import jsPDF from "jspdf";

export default function CommandeDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [commande, setCommande] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchCommande = async () => {
      const { data, error } =
        await supabase
          .from("commandes")
          .select("*")
          .eq("id", params.id)
          .single();

      if (error) {
        console.log(error);
      } else {
        setCommande(data);
      }

      setLoading(false);
    };

    if (params.id) {
      fetchCommande();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Chargement...
      </div>
    );
  }

  if (!commande) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Commande introuvable
      </div>
    );
  }
const downloadPDF = async () => {
  const doc = new jsPDF();

  // =========================
  // LOGO
  // =========================

  const logo = new Image();
  logo.src = "/logo-facture.png";

  await new Promise((resolve) => {
    logo.onload = resolve;
  });

doc.addImage(
  logo,
  "PNG",
  20,
  10,
  55,
  40
);

  let y = 65;

  // =========================
  // HEADER
  // =========================

  doc.setFontSize(24);
  doc.setTextColor(111, 66, 193);
  doc.text("Mahorayh Beauté", 85, 22);

  doc.setFontSize(16);
  doc.setTextColor(80, 80, 80);
  doc.text("FACTURE", 85, 32);

  doc.setFontSize(10);
  doc.text("mahorayhbeaute@gmail.com", 85, 40);

  doc.text("www.mahorayhbeaute.com", 85, 46);

  doc.setDrawColor(111, 66, 193);
  doc.setLineWidth(0.8);
  doc.line(20, 55, 190, 55);

  // =========================
  // FACTURE
  // =========================

  doc.setTextColor(0, 0, 0);

  doc.setFontSize(12);

  doc.text(
    `Facture : ${commande.invoice_number}`,
    20,
    y
  );

  y += 8;

  doc.text(
    `Date : ${new Date(
      commande.created_at
    ).toLocaleDateString("fr-FR")}`,
    20,
    y
  );

  y += 8;

  doc.text(
    `Statut : ${
      commande.invoice_status === "paid"
        ? "Payée"
        : commande.invoice_status
    }`,
    20,
    y
  );

  y += 15;

  // =========================
  // CLIENT
  // =========================

  doc.setFontSize(15);
  doc.setTextColor(111, 66, 193);
  doc.text("Informations client", 20, y);

  y += 10;

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);

  doc.text(
    `Client : ${commande.client}`,
    20,
    y
  );

  y += 8;

  doc.text(
    `Email : ${commande.email}`,
    20,
    y
  );

  y += 8;

  doc.text(
    `Téléphone : ${commande.telephone}`,
    20,
    y
  );

  y += 8;

  doc.text(
    `Adresse : ${commande.adresse}`,
    20,
    y
  );

  y += 8;

  doc.text(
    `Code postal : ${commande.code_postal}`,
    20,
    y
  );

  y += 18;

  // =========================
  // PRODUITS
  // =========================

  doc.setFontSize(15);
  doc.setTextColor(111, 66, 193);
  doc.text("Produits commandés", 20, y);

  y += 12;

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);

  commande.produits?.forEach((item: any) => {
    const nomProduit = item.name
  .replace(/✨/g, "")
  .replace(/⭐/g, "")
  .replace(/🌟/g, "")
  .replace(/💎/g, "")
  .trim();

doc.text(
  nomProduit,
  20,
  y
);

    doc.text(
      `x${item.quantity}`,
      130,
      y
    );

    doc.text(
      `${Number(item.price).toFixed(2)} €`,
      170,
      y
    );

    y += 10;
  });

  y += 5;

  doc.line(20, y, 190, y);

  y += 12;

  const sousTotal =
    Number(commande.total) -
    Number(commande.shipping_cost || 0);

  doc.text(
    `Sous-total : ${sousTotal.toFixed(2)} €`,
    20,
    y
  );

  y += 8;

  doc.text(
    `Livraison : ${Number(
      commande.shipping_cost || 0
    ).toFixed(2)} €`,
    20,
    y
  );

  y += 8;

  doc.text(
    "TVA : Incluse",
    20,
    y
  );

  y += 15;

  doc.setFontSize(18);
  doc.setTextColor(111, 66, 193);

  doc.text(
    `TOTAL : ${Number(
      commande.total
    ).toFixed(2)} €`,
    20,
    y
  );

  y += 20;

  // =========================
  // FOOTER
  // =========================

  doc.setDrawColor(111, 66, 193);
  doc.line(20, y, 190, y);

  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);

  doc.text(
    "Merci pour votre confiance.",
    20,
    y
  );

  y += 6;

  doc.text(
    "Mahorayh Beauté",
    20,
    y
  );

  doc.save(
    `Facture-${commande.invoice_number}.pdf`
  );
};

  return (
  <div className="min-h-screen bg-gray-100 px-3 py-6 overflow-x-hidden">
  <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-6 sm:p-8">

        <button
          onClick={() =>
            router.push("/compte")
          }
          className="mb-6 text-purple-700 font-semibold"
        >
          ← Retour
        </button>

        <h1 className="text-4xl font-bold mb-2">
          📦 Détail commande
        </h1>

        <p className="text-gray-500 mb-8">
          Commande #{commande.id}
        </p>

<div className="bg-purple-50 border border-purple-200 rounded-2xl p-5 mb-8">

 <div className="flex items-center justify-between mb-4">

  <h2 className="text-xl font-bold text-purple-700">
    📄 Facture
  </h2>

  <button
  onClick={downloadPDF}
  className="bg-purple-700 text-white px-4 py-2 rounded-xl hover:bg-purple-800 transition"
>
  Télécharger PDF
</button>

</div>

  <div className="space-y-2">

    <p>
      <strong>N° facture :</strong>{" "}
      {commande.invoice_number}
    </p>

    <p>
      <strong>Statut :</strong>{" "}
      {commande.invoice_status}
    </p>

    <p>
      <strong>Client :</strong>{" "}
      {commande.client}
    </p>

    <p>
      <strong>Email :</strong>{" "}
      {commande.email}
    </p>

    <p>
      <strong>Téléphone :</strong>{" "}
      {commande.telephone}
    </p>
    <p>
     <strong>Adresse :</strong>{" "}
      {commande.adresse}
    </p>

   <p>
   <strong>Code postal :</strong>{" "}
   {commande.code_postal}
   </p>

   <p>
   <strong>Total :</strong>{" "}
   {commande.total}€
   </p>

  </div>

</div>

       {/* INFOS */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

  {/* DATE */}
  <div className="bg-gray-100 p-6 rounded-2xl min-h-[120px]">
    <p className="text-sm text-gray-500">
      Date
    </p>

    <p className="font-bold text-xl">
      {new Date(
        commande.created_at
      ).toLocaleDateString("fr-FR")}
    </p>
  </div>

  {/* STATUT */}
  <div className="bg-gray-100 p-6 rounded-2xl min-h-[120px]">
    <p className="text-sm text-gray-500 mb-6">
      Statut
    </p>

    <div className="relative flex items-center justify-between w-full">

       <div className="absolute left-[12%] right-[12%] top-5 h-1 bg-gray-300 rounded-full">
        <div className={`h-full bg-green-500 rounded-full transition-all duration-500
            ${
              commande.statut === "en_attente"
                ? "w-0"
                : commande.statut === "payée"
                ? "w-1/3"
                : commande.statut === "expediee"
                ? "w-2/3"
                : commande.statut === "livree"
                ? "w-full"
                : "w-0"
            }
          `}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center flex-1">
        <span className="text-3xl">📦</span>
        <span className={["en_attente","payée","expediee","livree"].includes(commande.statut)
          ? "text-green-600 font-bold"
          : "text-gray-400"}>
          Reçue
        </span>
      </div>

      <div className="relative z-10 flex flex-col items-center flex-1">
        <span className="text-3xl">💳</span>
        <span className={["payée","expediee","livree"].includes(commande.statut)
          ? "text-green-600 font-bold"
          : "text-gray-400"}>
          Payée
        </span>
      </div>

      <div className="relative z-10 flex flex-col items-center flex-1">
        <span className="text-3xl">🚚</span>
        <span className={["expediee","livree"].includes(commande.statut)
          ? "text-green-600 font-bold"
          : "text-gray-400"}>
          Expédiée
        </span>
      </div>

      <div className="relative z-10 flex flex-col items-center flex-1">
        <span className="text-3xl">✅</span>
        <span className={
          commande.statut === "livree"
            ? "text-green-600 font-bold"
            : "text-gray-400"
        }>
          Livrée
        </span>
      </div>

    </div>
  </div>

  {/* ADRESSE */}
  <div className="bg-gray-100 p-6 rounded-2xl min-h-[120px]">
    <p className="text-sm text-gray-500">
      Adresse
    </p>

   <p className="font-bold text-xl break-words">
  {commande.adresse}
</p>
  </div>

  {/* TOTAL */}
  <div className="bg-gray-100 p-6 rounded-2xl min-h-[120px]">
    <p className="text-sm text-gray-500">
      Total
    </p>

    <p className="font-bold text-purple-700 text-4xl">
      {Number(
        commande.total
      ).toFixed(2)} €
    </p>
  </div>

</div>

        {/* PRODUITS */}
        <div>
          <h2 className="text-2xl font-bold mb-6">
            🛍️ Produits commandés
          </h2>

          <div className="space-y-5">

            {commande.produits?.map(
              (
                item: any,
                index: number
              ) => (
                <div
                  key={index}
                  className="flex items-center gap-5 bg-gray-50 p-4 rounded-2xl"
                >

                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 shrink-0 object-cover rounded-2xl"
                  />

                  <div className="flex-1 min-w-0">

                    <h3 className="font-bold text-lg">
                      {item.name}
                    </h3>

                    <p className="text-gray-500">
                      Quantité :
                      {" "}
                      {item.quantity}
                    </p>

                    <p className="text-purple-700 font-bold mt-2">
                      {item.price} €
                    </p>

                  </div>

                </div>
              )
            )}

                   </div>

        </div>

      </div>

    </div>
  );
}
