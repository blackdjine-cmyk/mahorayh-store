"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/nouveau-mot-de-passe`,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage(
        "📧 Un lien de récupération vient d'être envoyé à votre adresse email."
      );
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">

        <h1 className="text-3xl font-bold text-purple-700 text-center mb-3">
          Mot de passe oublié ?
        </h1>

        <p className="text-gray-600 text-center mb-8">
          Entrez votre adresse email pour recevoir un lien permettant de
          réinitialiser votre mot de passe.
        </p>

        <form onSubmit={handleResetPassword}>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adresse email
          </label>

          <input
            type="email"
            placeholder="Votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white p-3 rounded-xl font-semibold transition"
          >
            {loading
              ? "Envoi en cours..."
              : "📧 Envoyer le lien"}
          </button>

        </form>

        {message && (
          <p className="mt-5 text-center text-sm text-gray-600">
            {message}
          </p>
        )}

        <button
          type="button"
          onClick={() => router.push("/connexion")}
          className="w-full mt-4 text-sm text-purple-600 hover:text-purple-700 hover:underline"
        >
          ← Retour à la connexion
        </button>

      </div>

    </div>
  );
}