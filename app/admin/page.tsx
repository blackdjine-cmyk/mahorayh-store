"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [commandes, setCommandes] = useState<any[]>([]);
  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [image, setImage] = useState("");
  const [badge, setBadge] = useState("");

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

  const addProduct = async () => {
  const { error } = await supabase
    .from("products")
    .insert([
      {
        name,
        description,
        price: Number(price),
        old_price: Number(oldPrice),
        image,
        badge,
      },
    ]);

  if (error) {
    console.log(error);
    alert("Erreur");
  } else {
    alert("Produit ajouté !");
  }
};

  // 📦 Admin commandes
  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white p-6 rounded-2xl shadow mb-10">

  <h2 className="text-2xl font-bold mb-6">
    ➕ Ajouter un produit
  </h2>

  <div className="space-y-4">

    <input
      type="text"
      placeholder="Nom"
      value={name}
      onChange={(e) => setName(e.target.value)}
      className="w-full border p-4 rounded-xl"
    />

    <textarea
      placeholder="Description"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      className="w-full border p-4 rounded-xl"
    />

    <input
      type="number"
      placeholder="Prix"
      value={price}
      onChange={(e) => setPrice(e.target.value)}
      className="w-full border p-4 rounded-xl"
    />

    <input
      type="number"
      placeholder="Ancien prix"
      value={oldPrice}
      onChange={(e) => setOldPrice(e.target.value)}
      className="w-full border p-4 rounded-xl"
    />

    <input
      type="text"
      placeholder="Image URL"
      value={image}
      onChange={(e) => setImage(e.target.value)}
      className="w-full border p-4 rounded-xl"
    />

    <input
      type="text"
      placeholder="Badge"
      value={badge}
      onChange={(e) => setBadge(e.target.value)}
      className="w-full border p-4 rounded-xl"
    />

    <button
      onClick={addProduct}
      className="w-full bg-purple-700 text-white py-4 rounded-xl font-bold"
    >
      Ajouter le produit
    </button>

  </div>

</div>
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
                  <p>Email : {cmd.email}</p>
                  <p>Téléphone : {cmd.telephone}</p>
                  <p>Code postal : {cmd.code_postal}</p>
                  <p>Adresse : {cmd.adresse}</p>
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