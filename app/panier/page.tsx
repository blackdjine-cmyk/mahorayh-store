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

  // 🔢 Calcul total
  const total = cart.reduce(
    (acc: number, item: any) => acc + item.price * item.quantity,
    0
  );

  // 💳 STRIPE CHECKOUT
  const handleCheckout = async () => {
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
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🛒 Votre panier</h1>

      {cart.length === 0 ? (
        <p className="text-gray-500">Votre panier est vide.</p>
      ) : (
        <>
          {/* 🧾 LISTE PRODUITS */}
          <div className="space-y-4">
            {cart.map((item: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white p-4 rounded-xl shadow"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    className="w-20 h-20 object-cover rounded"
                  />

                  <div>
                    <h2 className="font-semibold">{item.name}</h2>
                    <p className="text-purple-600 font-bold">
                      {item.price}€
                    </p>

                    {/* 🔢 QUANTITÉ */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => decreaseQuantity(index)}
                        className="px-2 py-1 bg-gray-200 rounded"
                      >
                        -
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() => increaseQuantity(index)}
                        className="px-2 py-1 bg-gray-200 rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* ❌ SUPPRIMER */}
                <button
                  onClick={() => removeFromCart(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>

          {/* 💰 TOTAL + ACTIONS */}
          <div className="mt-10 flex flex-col items-end gap-4">
            <h2 className="text-2xl font-bold">
              Total : {total.toFixed(2)}€
            </h2>

            <div className="flex gap-4">
              {/* 🗑 VIDER PANIER */}
              <button
                onClick={clearCart}
                className="bg-gray-200 px-5 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Vider le panier
              </button>

              {/* 💳 PAIEMENT */}
              <div className="space-y-4 mb-6">

             <input
             type="text"
             placeholder="Nom complet"
             value={nom}
             onChange={(e) => setNom(e.target.value)}
             className="w-full border p-3 rounded-lg"
             />

             <input
             type="email"
             placeholder="Adresse e-mail"
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             className="w-full border p-3 rounded-lg"
             />
             
             <input
             type="tel"
             placeholder="Téléphone"
             value={telephone}
             onChange={(e) => setTelephone(e.target.value)}
             className="w-full border p-3 rounded-lg"
             />

             <input
             type="text"
             placeholder="Code postal"
             value={codePostal}
             onChange={(e) => setCodePostal(e.target.value)}
             className="w-full border p-3 rounded-lg"
             />

             <textarea
             placeholder="Adresse de livraison"
             value={adresse}
             onChange={(e) => setAdresse(e.target.value)}
             className="w-full border p-3 rounded-lg"
             />

            </div>

              <button
                onClick={handleCheckout}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
              >
                Passer au paiement
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}