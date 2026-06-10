"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

type Commande = {
  id: string;
  created_at: string;
  total: number;
  statut: string;
};

export default function ComptePage() {
  const [user, setUser] = useState<{
    email?: string;
    id?: string;
  } | null>(null);

  const [commandes, setCommandes] =
    useState<Commande[]>([]);

  const router = useRouter();

  useEffect(() => {
  const loadData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    setUser(user);

    try {
      const res = await fetch(
        `/api/historique?email=${user.email}`
      );

      const data = await res.json();

      setCommandes(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Erreur chargement commandes :",
        error
      );
    }
  };

  loadData();
}, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-lg text-center">

        {/* AVATAR */}
        <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-3xl font-bold">
          {user?.email?.charAt(0).toUpperCase()}
        </div>

        {/* TITRE */}
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Mon compte
        </h1>

        <p className="text-gray-500 mb-8">
          Bienvenue dans votre espace client Mahorayh Beauté
        </p>

        {/* INFOS CLIENT */}
        <div className="bg-gray-50 rounded-2xl p-6 text-left shadow-sm space-y-4 mb-8">

          <div>
            <p className="text-sm text-gray-500">
              Nom
            </p>

            <p className="font-semibold text-gray-900">
              {user?.email?.split("@")[0] || "Client"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Email
            </p>

            <p className="font-semibold text-gray-900">
              {user?.email || "Chargement..."}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              ID Client
            </p>

            <p className="font-semibold text-gray-900 break-all">
              {user?.id || "Chargement..."}
            </p>
          </div>

        </div>

        {/* HISTORIQUE COMMANDES */}
        <div className="bg-purple-50 rounded-2xl p-5 mb-8 text-left">

          <p className="font-semibold text-purple-800 mb-4">
            📦 Historique des commandes
          </p>

          {commandes.length === 0 ? (

            <p className="text-sm text-gray-600">
              Aucune commande pour le moment.
            </p>

          ) : (

            <div className="space-y-3">

              {commandes.map((commande) => (

                <div
                  key={commande.id}
                  className="bg-white rounded-xl p-4 shadow-sm"
                >

                  <p className="font-semibold text-gray-900">
                    Commande #{commande.id}
                  </p>

                  <p className="text-sm text-gray-500">
                    {new Date(
                      commande.created_at
                    ).toLocaleDateString("fr-FR")}
                  </p>

                  <p className="text-purple-700 font-semibold">
                    {Number(
                      commande.total
                    ).toFixed(2)} €
                  </p>

                  <button
                    onClick={() =>
                      router.push(
                        `/compte/commandes/${commande.id}`
                      )
                    }
                    className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl transition"
                  >
                    Voir les détails
                  </button>

                  {/* STATUT */}
                  <div
                    className={`mt-4 rounded-full px-4 py-2 text-sm font-bold w-fit
                      ${
                        commande.statut === "en_attente"
                          ? "bg-yellow-100 text-yellow-700"

                        : commande.statut === "payée"
                          ? "bg-green-100 text-green-700"

                        : commande.statut === "expediee"
                          ? "bg-blue-100 text-blue-700"

                        : commande.statut === "livree"
                          ? "bg-emerald-100 text-emerald-700"

                        : "bg-gray-100 text-gray-600"
                      }
                    `}
                  >

                    {
                      commande.statut === "en_attente"
                        ? "🟡 En attente"

                      : commande.statut === "payée"
                        ? "💳 Payée"

                      : commande.statut === "expediee"
                        ? "🚚 Expédiée"

                      : commande.statut === "livree"
                        ? "✅ Livrée"

                      : commande.statut
                    }

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-2xl font-semibold transition"
        >
          Déconnexion
        </button>

      </div>

    </div>
  );
}