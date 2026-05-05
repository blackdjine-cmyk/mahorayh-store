"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [commandes, setCommandes] = useState<any[]>([]);
  const [auth, setAuth] = useState(false);
  const [password, setPassword] = useState("");

  // 🔐 Vérif mot de passe
  const checkPassword = () => {
    if (password === "admin123") {
      setAuth(true);
    } else {
      alert("Mot de passe incorrect");
    }
  };

  // 🔄 Charger commandes
  useEffect(() => {
    if (auth) {
      fetch("/api/commandes")
        .then((res) => res.json())
        .then((data) => setCommandes(data));
    }
  }, [auth]);

  // ❌ Supprimer commande
  const deleteCommande = async (index: number) => {
    await fetch("/api/commandes", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ index }),
    });

    // reload
    const res = await fetch("/api/commandes");
    const data = await res.json();
    setCommandes(data);
  };

  // 🔐 Écran login
  if (!auth) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <h1 className="text-2xl font-bold">🔐 Accès admin</h1>

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
        />

        <button
          onClick={checkPassword}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Se connecter
        </button>
      </div>
    );
  }

  // 📦 Interface admin
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">📦 Commandes</h1>

      {commandes.length === 0 ? (
        <p className="text-gray-500">Aucune commande</p>
      ) : (
        <div className="space-y-6">
          {commandes.map((cmd, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-xl shadow"
            >
              {/* Date */}
              <p className="text-sm text-gray-500">
                📅 {new Date(cmd.date).toLocaleString()}
              </p>

              {/* Produits */}
              <div className="mt-3 space-y-2">
                {cmd.cart.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>
                      {(item.price * item.quantity).toFixed(2)}€
                    </span>
                  </div>
                ))}
              </div>

              {/* Total + bouton */}
              <div className="flex justify-between items-center mt-4">
                <div className="font-bold text-purple-600">
                  Total : {cmd.total.toFixed(2)}€
                </div>

                <button
                  onClick={() => deleteCommande(index)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  ❌ Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}