
"use client";

import { useEffect, useRef, useState } from "react";

export default function PayPalReturnPage() {
  const [message, setMessage] = useState("Vérification de votre paiement PayPal...");
  const [erreur, setErreur] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const confirmerPaiement = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const orderId = params.get("token");

        if (!orderId) {
          throw new Error("Référence de paiement PayPal introuvable.");
        }

        const response = await fetch("/api/paypal", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "capture",
            orderId,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.error || "La confirmation du paiement a échoué."
          );
        }

        window.location.replace("/success");
      } catch (error) {
        setErreur(true);
        setMessage(
          error instanceof Error
            ? error.message
            : "Une erreur est survenue lors de la confirmation."
        );
      }
    };

    confirmerPaiement();
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-purple-50 px-6">
      <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-lg w-full">
        {!erreur && (
          <div className="text-5xl mb-6 animate-pulse">⏳</div>
        )}

        {erreur && <div className="text-5xl mb-6">⚠️</div>}

        <h1 className="text-2xl font-bold mb-4 text-gray-900">
          {erreur ? "Paiement à vérifier" : "Confirmation du paiement"}
        </h1>

        <p className="text-gray-600 mb-6">{message}</p>

        {erreur && (
          <a
            href="/panier"
            className="inline-block bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Retourner au panier
          </a>
        )}
      </div>
    </main>
  );
}
