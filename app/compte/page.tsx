"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Mailbox,
  BadgeInfo,
} from "lucide-react";

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

  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [client, setClient] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [editClient, setEditClient] = useState<any>(null);

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

      
    const { data: clientData } = await supabase
  .from("clients")
  .select("*")
  .eq("user_id", user.id)
  .single();

setClient(clientData);

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

  // ==========================
// ENREGISTRER LES INFORMATIONS CLIENT
// ==========================
const handleSaveClient = async () => {
   console.log("🟣 BOUTON ENREGISTRER CLIQUÉ");
  if (!user || !editClient) return;
    console.log("🟢 DONNÉES À ENREGISTRER :", editClient);
  try {
    const { data, error } = await supabase
      .from("clients")
      .update({
        nom: editClient.nom,
        telephone: editClient.telephone,
        adresse: editClient.adresse,
        code_postal: editClient.code_postal,
        ville: editClient.ville,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .select()
      .single();
      console.log("🔵 RÉPONSE SUPABASE :", { data, error });

    if (error) {
      console.error("Erreur mise à jour client :", error);
      return;
    }

    setClient(data);
    setEditClient(data);
    setEditMode(false);

  } catch (error) {
    console.error("Erreur enregistrement :", error);
  }
};

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center px-4 py-10">

      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-lg text-center">

        {/* AVATAR */}
        <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-3xl font-bold">
          {user?.email?.charAt(0).toUpperCase()}
        </div>

        {/* =========================
              EN-TÊTE PREMIUM
           ========================= */}

        <div className="mb-8">

         <h1 className="text-4xl font-extrabold text-purple-700">
           Mon compte
        </h1>

       <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mt-3 mb-4"></div>

       <p className="text-gray-600 text-lg">
         ✨ Bienvenue dans votre espace client
      </p>

       <p className="text-purple-600 font-semibold mt-2">
          Mahorayh Beauté
        </p>

      </div>

    {/* ==========================
    INFORMATIONS PERSONNELLES
    ========================== */}

<div className="bg-white rounded-3xl border border-purple-100 shadow-md p-6">

  {editMode ? (

    /* ==========================
       MODE MODIFICATION
       ========================== */

    <div>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center">
          ✏️
        </div>

        <div>
          <p className="font-bold text-gray-900">
            Modifier mes informations
          </p>

          <p className="text-sm text-gray-500">
            Modifiez vos coordonnées
          </p>
        </div>
      </div>

      {/* Nom */}
      <div className="py-4 border-b border-gray-100">
        <div className="flex items-center gap-2 text-gray-500 mb-2">
          <User className="w-5 h-5 text-purple-600" />
          <span>Nom</span>
        </div>

        <input
          type="text"
          value={editClient?.nom || ""}
          onChange={(e) =>
            setEditClient({
              ...editClient,
              nom: e.target.value,
            })
          }
          className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Email */}
      <div className="py-4 border-b border-gray-100">
        <div className="flex items-center gap-2 text-gray-500 mb-2">
          <Mail className="w-5 h-5 text-purple-600" />
          <span>Email</span>
        </div>

        <input
          type="email"
          value={editClient?.email || ""}
          disabled
          className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-2 text-gray-500 cursor-not-allowed"
        />

        <p className="text-xs text-gray-400 mt-2">
          L'adresse email ne peut pas être modifiée ici.
        </p>
      </div>

      {/* Téléphone */}
      <div className="py-4 border-b border-gray-100">
        <div className="flex items-center gap-2 text-gray-500 mb-2">
          <Phone className="w-5 h-5 text-purple-600" />
          <span>Téléphone</span>
        </div>

        <input
          type="tel"
          value={editClient?.telephone || ""}
          onChange={(e) =>
            setEditClient({
              ...editClient,
              telephone: e.target.value,
            })
          }
          className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Adresse */}
      <div className="py-4 border-b border-gray-100">
        <div className="flex items-center gap-2 text-gray-500 mb-2">
          <MapPin className="w-5 h-5 text-purple-600" />
          <span>Adresse</span>
        </div>

        <input
          type="text"
          value={editClient?.adresse || ""}
          onChange={(e) =>
            setEditClient({
              ...editClient,
              adresse: e.target.value,
            })
          }
          className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Ville */}
      <div className="py-4 border-b border-gray-100">
        <div className="flex items-center gap-2 text-gray-500 mb-2">
          <Building2 className="w-5 h-5 text-purple-600" />
          <span>Ville</span>
        </div>

        <input
          type="text"
          value={editClient?.ville || ""}
          onChange={(e) =>
            setEditClient({
              ...editClient,
              ville: e.target.value,
            })
          }
          className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Code postal */}
      <div className="py-4">
        <div className="flex items-center gap-2 text-gray-500 mb-2">
          <Mailbox className="w-5 h-5 text-purple-600" />
          <span>Code postal</span>
        </div>

        <input
          type="text"
          value={editClient?.code_postal || ""}
          onChange={(e) =>
            setEditClient({
              ...editClient,
              code_postal: e.target.value,
            })
          }
          className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* BOUTONS */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6">

        <button
          type="button"
          onClick={() => {
          setEditClient({ ...client });
          setEditMode(false);
          }}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-xl font-semibold transition"
        >
          Annuler
        </button>

        <button
          type="button"
          onClick={handleSaveClient}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl font-semibold transition"
        >
          💾 Enregistrer
        </button>

      </div>

    </div>

  ) : (

    /* ==========================
       MODE AFFICHAGE
       ========================== */

    <div>

      <p className="text-sm text-gray-500 mt-1">
        Vos coordonnées enregistrées
      </p>

      {/* Nom */}
      <div className="py-4 border-b border-gray-100">
        <div className="flex items-center gap-2 text-gray-500">
          <User className="w-5 h-5 text-purple-600" />
          <span>Nom</span>
        </div>

        <p className="mt-2 text-left font-bold text-gray-900">
          {client?.nom}
        </p>
      </div>

      {/* Email */}
      <div className="py-4 border-b border-gray-100">
        <div className="flex items-center gap-2 text-gray-500">
          <Mail className="w-5 h-5 text-purple-600" />
          <span>Email</span>
        </div>

        <p className="mt-2 text-left text-gray-900 break-words">
          {client?.email}
        </p>
      </div>

      {/* Téléphone */}
      <div className="py-4 border-b border-gray-100">
        <div className="flex items-center gap-2 text-gray-500">
          <Phone className="w-5 h-5 text-purple-600" />
          <span>Téléphone</span>
        </div>

        <p className="mt-2 text-left text-gray-900">
          {client?.telephone}
        </p>
      </div>

      {/* Adresse */}
      <div className="py-4 border-b border-gray-100">
        <div className="flex items-center gap-2 text-gray-500">
          <MapPin className="w-5 h-5 text-purple-600" />
          <span>Adresse</span>
        </div>

        <p className="mt-2 text-left text-gray-900 text-[15px] leading-6">
          {client?.adresse}
        </p>
      </div>

      {/* Ville */}
      <div className="py-4 border-b border-gray-100">
        <div className="flex items-center gap-2 text-gray-500">
          <Building2 className="w-5 h-5 text-purple-600" />
          <span>Ville</span>
        </div>

        <p className="mt-2 text-left text-gray-900">
          {client?.ville}
        </p>
      </div>

      {/* Code postal */}
      <div className="py-4 border-b border-gray-100">
        <div className="flex items-center gap-2 text-gray-500">
          <Mailbox className="w-5 h-5 text-purple-600" />
          <span>Code postal</span>
        </div>

        <p className="mt-2 text-left text-gray-900">
          {client?.code_postal}
        </p>
      </div>

      {/* ID Client */}
      <div className="py-4">
        <div className="flex items-center gap-2 text-gray-500">
          <BadgeInfo className="w-5 h-5 text-purple-600" />
          <span>ID Client</span>
        </div>

        <p className="mt-2 text-left text-xs font-mono text-gray-400 break-all">
          {user?.id}
        </p>
      </div>

    </div>

  )}

</div>

{/* MODIFIER LES INFORMATIONS */}
<div className="mt-4 w-full flex justify-center">
  <button
    type="button"
    onClick={() => {
      setEditClient({ ...client });
      setEditMode(true);
    }}
    className="w-full max-w-[330px] bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl transition"
  >
    ✏️ Modifier mes informations
  </button>
</div>

 {/* =========================
      STATISTIQUES CLIENT
     ========================= */}

<div className="grid grid-cols-2 gap-5 mt-8">

  {/* Nombre de commandes */}
  <div className="bg-gradient-to-br from-white to-purple-50 border border-purple-100 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-center">

    <div className="text-2xl mb-2">
      📦
    </div>

    <p className="text-sm text-gray-500 font-medium">
      Nombre de commandes
    </p>

    <p className="mt-1 text-2xl font-bold text-purple-700">
      {commandes.length}
   </p>

  </div>

  {/* Total dépensé */}
  <div className="bg-gradient-to-br from-white to-purple-50 border border-purple-100 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-center">

    <div className="text-2xl mb-2">
      💳
    </div>

    <p className="text-sm text-gray-500 font-medium">
      Total dépensé
    </p>

    <p className="mt-1 text-2xl font-bold text-purple-700 whitespace-nowrap">

  {commandes
    .reduce(
      (total, commande) =>
        total + Number(commande.total),
      0
    )
    .toFixed(2)} €

</p>

  </div>

</div>

        {/* HISTORIQUE COMMANDES */}
        <div className="bg-purple-50 rounded-2xl p-5 mt-8 text-left">

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
               className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-all duration-300"
               >

                 <p className="font-bold text-xl text-gray-900 mb-1">
                   📦 Commande #{commande.id}
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
          className="mt-8 w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-2xl font-semibold transition"
        >
          Déconnexion
        </button>

      </div>

    </div>
  );
}