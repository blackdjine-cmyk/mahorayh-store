"use client";

import { useCart } from "../context/CartContext";
import { useState } from "react";

export default function PanierPage() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [codePostal, setCodePostal] = useState("");
  const [adresse, setAdresse] = useState("");

  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  } = useCart();

  // 🔢 TOTAL
  const total = cart.reduce(
    (acc: number, item: any) => acc + item.price * item.quantity,
    0
  );

  // 💳 CHECKOUT
  const handleCheckout = async () => {

    // ✅ VALIDATION
    if (
      !nom ||
      !email ||
      !telephone ||
      !codePostal ||
      !adresse
    ) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cart,
        nom,
        email,
        telephone,
        codePostal,
        adresse,
      }),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Erreur lors du paiement");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">
        🛒 Votre panier
      </h1>

      {cart.length === 0 ? (
        <p className="text-gray-500">
          Votre panier est vide.
        </p>
      ) : (
        <>
          {/* PRODUITS */}
          <div className="space-y-5">
            {cart.map((item: any, index: number) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm border p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                {/* GAUCHE */}
                <div className="flex gap-4">
                  <img
                    src={item.image}
                    className="w-24 h-24 object-cover rounded-xl"
                  />

                  <div>
                    <h2 className="font-semibold text-xl">
                      {item.name}
                    </h2>

                    <p className="text-purple-600 font-bold text-2xl mt-1">
                      {item.price}€
                    </p>

                    {/* QUANTITÉ */}
                    <div className="flex items-center gap-3 mt-4">
                      <button
                        onClick={() => decreaseQuantity(index)}
                        className="w-10 h-10 bg-gray-200 rounded-lg text-lg"
                      >
                        -
                      </button>

                      <span className="text-lg font-medium">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increaseQuantity(index)}
                        className="w-10 h-10 bg-gray-200 rounded-lg text-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* SUPPRIMER */}
                <button
                  onClick={() => removeFromCart(index)}
                  className="text-red-500 hover:text-red-700 font-medium"
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>

          {/* TOTAL */}
          <div className="mt-10 text-right">
            <h2 className="text-4xl font-bold">
              Total : {total.toFixed(2)}€
            </h2>
          </div>

          {/* FORMULAIRE */}
          <div className="mt-8 bg-white rounded-3xl shadow-sm border p-5 md:p-8 space-y-5">

            <input
              type="text"
              placeholder="Nom complet"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="w-full border p-4 rounded-xl text-black placeholder-gray-400"
            />

            <input
              type="email"
              placeholder="Adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-4 rounded-xl text-black placeholder-gray-400"
            />

            <input
              type="tel"
              placeholder="Téléphone"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              className="w-full border p-4 rounded-xl text-black placeholder-gray-400"
            />

            <input
              type="text"
              placeholder="Code postal"
              value={codePostal}
              onChange={(e) => setCodePostal(e.target.value)}
              className="w-full border p-4 rounded-xl text-black placeholder-gray-400"
            />

            <textarea
              placeholder="Adresse de livraison"
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
              className="w-full border p-4 rounded-xl min-h-[120px] text-black placeholder-gray-400"
            />

            {/* BOUTONS */}
            <div className="flex flex-col md:flex-row gap-4 pt-2">

              <button
                onClick={clearCart}
                className="w-full md:w-auto bg-gray-200 px-6 py-4 rounded-xl hover:bg-gray-300 transition font-medium"
              >
                Vider le panier
              </button>

              <div className="w-full">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-purple-600 text-white px-6 py-4 rounded-xl hover:bg-purple-700 transition font-semibold"
                >
                  💳 Passer au paiement
                </button>

                <p className="text-sm text-gray-500 text-center mt-2">
                  🔒 Paiement sécurisé • Livraison rapide
                </p>
              </div>

            </div>

          </div>
        </>
      )}
    </div>
  );
}