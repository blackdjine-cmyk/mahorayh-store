"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [commandes, setCommandes] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [image, setImage] = useState("");
  const [badge, setBadge] = useState("");

  // ➕ Ajouter produit
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
      alert("Erreur lors de l'ajout");
    } else {
      alert("Produit ajouté !");

      setName("");
      setDescription("");
      setPrice("");
      setOldPrice("");
      setImage("");
      setBadge("");

      location.reload();
    }
  };

  // 🗑️ Supprimer produit
const deleteProduct = async (id: number) => {

  const confirmDelete = confirm(
    "Supprimer ce produit ?"
  );

  if (!confirmDelete) return;

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    console.log(error);
    alert("Erreur suppression");
  } else {

    alert("Produit supprimé !");

    setProducts(
      products.filter(
        (product) => product.id !== id
      )
    );
  }
};

  // ✏️ Modifier produit
  const updateProduct = async () => {
    if (!editingId) return;

    const { error } = await supabase
      .from("products")
      .update({
        name,
        description,
        price: Number(price),
        old_price: Number(oldPrice),
        image,
        badge,
      })
      .eq("id", editingId);

    if (error) {
      console.log(error);
      alert("Erreur modification");
    } else {
      alert("Produit modifié !");

      setEditingId(null);

      setName("");
      setDescription("");
      setPrice("");
      setOldPrice("");
      setImage("");
      setBadge("");

      location.reload();
    }
  };

  // 🔐 Vérification mot de passe
  const handleLogin = () => {
    if (password === "admin123") {
      setIsAuth(true);
    } else {
      alert("Mot de passe incorrect");
    }
  };

  // 📦 Charger données
  useEffect(() => {
    if (!isAuth) return;

    const fetchData = async () => {

      // 📦 Commandes
      const { data: commandesData, error: commandesError } =
        await supabase
          .from("commandes")
          .select("*")
          .order("created_at", {
            ascending: false,
          });

      if (commandesError) {
        console.log(commandesError);
      } else {
        setCommandes(commandesData || []);
      }

      // 🛍️ Produits
      const { data: productsData, error: productsError } =
        await supabase
          .from("products")
          .select("*")
          .order("created_at", {
            ascending: false,
          });

      if (productsError) {
        console.log(productsError);
      } else {
        setProducts(productsData || []);
      }
    };

    fetchData();
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

  return (
    <div className="max-w-5xl mx-auto p-6">

      {/* FORMULAIRE */}
      <div className="bg-white p-6 rounded-2xl shadow mb-10">

        <h2 className="text-2xl font-bold mb-6">
          {editingId
            ? "✏️ Modifier le produit"
            : "➕ Ajouter un produit"}
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
            onClick={
              editingId
                ? updateProduct
                : addProduct
            }
            className="w-full bg-purple-700 text-white py-4 rounded-xl font-bold"
          >
            {editingId
              ? "Modifier le produit"
              : "Ajouter le produit"}
          </button>

        </div>
      </div>

      {/* PRODUITS */}
      <h1 className="text-3xl font-bold mb-6">
        🛍️ Produits
      </h1>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white p-5 rounded-xl shadow"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />

            <h2 className="text-xl font-bold">
              {product.name}
            </h2>

            <p className="text-gray-600 mb-2">
              {product.description}
            </p>

            <p className="font-bold text-purple-700">
              {product.price} €
            </p>

            <div className="flex gap-3 mt-4">

              <button
                onClick={() => {
                  setEditingId(product.id);

                  setName(product.name);
                  setDescription(product.description);
                  setPrice(String(product.price));
                  setOldPrice(String(product.old_price));
                  setImage(product.image);
                  setBadge(product.badge);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Modifier
              </button>

              <button
                 onClick={() =>
                  deleteProduct(product.id)
               }
               className="bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Supprimer
               </button>

            </div>
          </div>
        ))}
      </div>

      {/* COMMANDES */}
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

                <div>
                  <p className="font-bold">
                    {cmd.client}
                  </p>

                  <p>Email : {cmd.email}</p>
                  <p>Téléphone : {cmd.telephone}</p>
                  <p>Code postal : {cmd.code_postal}</p>
                  <p>Adresse : {cmd.adresse}</p>
                </div>

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