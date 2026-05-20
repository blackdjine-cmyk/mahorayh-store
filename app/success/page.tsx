"use client";

import { useEffect } from "react";
import { useCart } from "../context/CartContext";

export default function SuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    localStorage.removeItem("cart");
    clearCart();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 flex items-center justify-center px-6">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl border p-10 text-center">

        {/* ICON */}
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center text-5xl">
          ✅
        </div>

        {/* TITRE */}
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
          Commande confirmée
        </h1>

        {/* TEXTE */}
        <p className="text-lg text-gray-600 leading-relaxed mb-6">
          Merci pour votre achat chez{" "}
          <span className="font-semibold text-purple-700">
            Mahorayh Beauté
          </span>{" "}
          💜
        </p>

        <p className="text-gray-500 mb-8 max-w-xl mx-auto">
          Votre paiement a bien été reçu. Votre commande est en cours de
          préparation. Vous recevrez bientôt une confirmation par e-mail
          avec le suivi de livraison.
        </p>

        {/* BADGES */}
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          <div className="bg-purple-50 rounded-2xl p-4 border">
            <p className="text-2xl mb-2">📦</p>
            <p className="font-medium text-sm">
              Préparation rapide
            </p>
          </div>

          <div className="bg-purple-50 rounded-2xl p-4 border">
            <p className="text-2xl mb-2">💳</p>
            <p className="font-medium text-sm">
              Paiement validé
            </p>
          </div>

          <div className="bg-purple-50 rounded-2xl p-4 border">
            <p className="text-2xl mb-2">🚚</p>
            <p className="font-medium text-sm">
              Livraison à venir
            </p>
          </div>
        </div>

        {/* BOUTON */}
        <a
          href="/"
          className="inline-block bg-gradient-to-r from-fuchsia-600 to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:scale-105 transition"
        >
          Continuer mes achats
        </a>

        {/* TEXTE BAS */}
        <p className="text-sm text-gray-400 mt-8">
          Merci pour votre confiance 💜
        </p>
      </div>
    </div>
  );
}