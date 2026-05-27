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
        <div className="grid md:grid-cols-2 gap-6 mb-10">

          <div className="bg-gray-50 p-5 rounded-2xl">
            <p className="text-sm text-gray-500">
              Date
            </p>

            <p className="font-bold">
              {new Date(
                commande.created_at
              ).toLocaleDateString("fr-FR")}
            </p>
          </div>

          <div className="bg-gray-50 p-5 rounded-2xl">
            <p className="text-sm text-gray-500">
              Statut
            </p>

           <div className="mt-6">

 <div className="mt-8">

  <div className="flex items-center justify-between">

    {/* ETAPE 1 */}
    <div className="flex flex-col items-center flex-1">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-white z-10
          ${
            ["en_attente", "payee", "expediee", "livree"].includes(
              commande.statut
            )
              ? "bg-yellow-500"
              : "bg-gray-300"
          }
        `}
      >
        📦
      </div>

      <p className="text-xs mt-2 font-semibold">
        Reçue
      </p>
    </div>

    {/* TRAIT 1 */}
    <div
      className={`h-2 flex-1 rounded-full mx-2
        ${
          ["payee", "expediee", "livree"].includes(
            commande.statut
          )
            ? "bg-green-500"
            : "bg-gray-300"
        }
      `}
    ></div>

    {/* ETAPE 2 */}
    <div className="flex flex-col items-center flex-1">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-white z-10
          ${
            ["payee", "expediee", "livree"].includes(
              commande.statut
            )
              ? "bg-green-500"
              : "bg-gray-300"
          }
        `}
      >
        💳
      </div>

      <p className="text-xs mt-2 font-semibold">
        Payée
      </p>
    </div>

    {/* TRAIT 2 */}
    <div
      className={`h-2 flex-1 rounded-full mx-2
        ${
          ["expediee", "livree"].includes(
            commande.statut
          )
            ? "bg-blue-500"
            : "bg-gray-300"
        }
      `}
    ></div>

    {/* ETAPE 3 */}
    <div className="flex flex-col items-center flex-1">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-white z-10
          ${
            ["expediee", "livree"].includes(
              commande.statut
            )
              ? "bg-blue-500"
              : "bg-gray-300"
          }
        `}
      >
        🚚
      </div>

      <p className="text-xs mt-2 font-semibold">
        Expédiée
      </p>
    </div>

    {/* TRAIT 3 */}
    <div
      className={`h-2 flex-1 rounded-full mx-2
        ${
          commande.statut === "livree"
            ? "bg-emerald-500"
            : "bg-gray-300"
        }
      `}
    ></div>

    {/* ETAPE 4 */}
    <div className="flex flex-col items-center flex-1">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-white z-10
          ${
            commande.statut === "livree"
              ? "bg-emerald-500"
              : "bg-gray-300"
          }
        `}
      >
        ✅
      </div>

      <p className="text-xs mt-2 font-semibold">
        Livrée
      </p>
    </div>

  </div>

</div>
</div>
</div>

          <div className="bg-gray-50 p-5 rounded-2xl">
            <p className="text-sm text-gray-500">
              Adresse
            </p>

            <p className="font-bold">
              {commande.adresse}
            </p>
          </div>

          <div className="bg-gray-50 p-5 rounded-2xl">
            <p className="text-sm text-gray-500">
              Total
            </p>

            <p className="font-bold text-purple-700 text-2xl">
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