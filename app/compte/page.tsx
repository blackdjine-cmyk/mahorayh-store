"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function ComptePage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
      }
    };

    getUser();
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
            <p className="text-sm text-gray-500">Nom</p>
            <p className="font-semibold text-gray-900">
              {user?.email?.split("@")[0] || "Client"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-semibold text-gray-900">
              {user?.email || "Chargement..."}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">ID Client</p>
            <p className="font-semibold text-gray-900 break-all">
              {user?.id || "Chargement..."}
            </p>
          </div>

        </div>

        {/* FUTUR COMMANDES */}
        <div className="bg-purple-50 rounded-2xl p-5 mb-8">
          <p className="font-semibold text-purple-800">
            📦 Historique des commandes
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Aucune commande pour le moment.
          </p>
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