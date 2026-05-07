"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [commandes, setCommandes] = useState<any[]>([]);
  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState("");

  // 🔐 Vérification mot de passe
  const handleLogin = () => {
    if (password === "admin123") {
      setIsAuth(true);
    } else {
      alert("Mot de passe incorrect");
    }
  };

  // 📦 Charger commandes
  useEffect(() => {
    if (!isAuth) return;

    const fetchCommandes = async () => {
      const { data, error } = await supabase
        .from("commandes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.log(error);
      } else {
        setCommandes(data || []);
      }
    };

    fetchCommandes();
  }, [isAuth]);

  // 🔒 Écran connexion
  if (!isAuth) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <h1 className="text-3xl font-bold">
          🔐 Accès Admin
        </h1>

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="border p-3 rounded-lg w-72"
        />

        <button
          onClick={handleLogin}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg"
        >
          Connexion
        </button>
      </div>
    );
  }

  // 📦 Admin commandes
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        📦 Commandes
      </h1>

      {commandes.length === 0 ? (
        <p>Aucune commande</p>
      ) : (
        <div className="space-y-6">
          {commandes.map((cmd) => (
            <div
              key={cmd.id}
              className="bg-white p-5 rounded-xl shadow"
            >
              <div className="flex justify-between mb-4">
                <p className="font-bold">
                  {cmd.client}
                </p>

                <p className="text-sm text-gray-500">
                  {new Date(
                    cmd.created_at
                  ).toLocaleString()}
                </p>
              </div>

              <div className="space-y-2">
                {cmd.produits.map(
                  (item: any, index: number) => (
                    <div
                      key={index}
                      className="flex justify-between border-b pb-2"
                    >
                      <span>
                        {item.name} x{" "}
                        {item.quantity}
                      </span>

                      <span>
                        {(
                          item.price *
                          item.quantity
                        ).toFixed(2)}
                        €
                      </span>
                    </div>
                  )
                )}
              </div>

              <div className="mt-4 text-right font-bold text-purple-600">
                Total : {cmd.total} €
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}