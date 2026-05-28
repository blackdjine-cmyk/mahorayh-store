"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";

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
  console.log("STATUT =", commande.statut);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8">

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

      <div className="absolute left-10 right-10 top-5 h-1 bg-gray-300 rounded-full">
        <div
          className={`h-full bg-green-500 rounded-full transition-all duration-500
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

    <p className="font-bold text-xl">
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
                    className="w-24 h-24 object-cover rounded-2xl"
                  />

                  <div className="flex-1">

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
