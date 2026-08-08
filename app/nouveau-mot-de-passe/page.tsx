"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function NouveauMotDePassePage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage("");

    if (password !== confirmPassword) {
      setMessage("❌ Les deux mots de passe ne correspondent pas.");
      return;
    }

    if (password.length < 6) {
      setMessage(
        "❌ Le mot de passe doit contenir au moins 6 caractères."
      );
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMessage("✅ Votre mot de passe a été modifié avec succès.");

    setLoading(false);

    setTimeout(() => {
      router.push("/login");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">

        <h1 className="text-3xl font-bold text-purple-700 text-center mb-3">
          Nouveau mot de passe
        </h1>

        <p className="text-gray-600 text-center mb-8">
          Choisissez votre nouveau mot de passe.
        </p>

        <form onSubmit={handleUpdatePassword}>

          {/* NOUVEAU MOT DE PASSE */}
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nouveau mot de passe
          </label>

          <input
            type="password"
            placeholder="Votre nouveau mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          {/* CONFIRMATION */}
          <label className="block text-sm font-medium text-gray-700 mt-5 mb-2">
            Confirmer le mot de passe
          </label>

          <input
            type="password"
            placeholder="Confirmez votre mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          {/* BOUTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white p-3 rounded-xl font-semibold transition"
          >
            {loading
              ? "Modification en cours..."
              : "🔐 Modifier mon mot de passe"}
          </button>

        </form>

        {/* MESSAGE */}
        {message && (
          <p className="mt-5 text-center text-sm text-gray-600">
            {message}
          </p>
        )}

      </div>

    </div>
  );
}