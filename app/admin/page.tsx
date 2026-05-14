"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {

  const [products, setProducts] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);

  // 🔐 LOGIN
  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState("");

  // 📦 PRODUIT PRINCIPAL
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [image, setImage] = useState("");
  const [badge, setBadge] = useState("");
  const [category, setCategory] = useState("");

  // 🎨 MODELES
  const [selectedProductId, setSelectedProductId] =
    useState("");

  const [modelName, setModelName] = useState("");
  const [modelPrice, setModelPrice] = useState("");
  const [modelImage, setModelImage] = useState("");
  const [modelDescription, setModelDescription] =
    useState("");

  const [uploading, setUploading] = useState(false);

  // 🔐 LOGIN
  const handleLogin = () => {
    if (password === "admin123") {
      setIsAuth(true);
    } else {
      alert("Mot de passe incorrect");
    }
  };

  // 📦 FETCH DATA
  useEffect(() => {

    if (!isAuth) return;

    fetchProducts();
    fetchModels();

  }, [isAuth]);

  const fetchProducts = async () => {

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.log(error);
    } else {
      setProducts(data || []);
    }
  };

  const fetchModels = async () => {

    const { data, error } = await supabase
      .from("product_models")
      .select("*");

    if (error) {
      console.log(error);
    } else {
      setModels(data || []);
    }
  };

  // 📸 UPLOAD IMAGE
  const uploadImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "product" | "model"
  ) => {

    const file = e.target.files?.[0];

    if (!file) return;

    setUploading(true);

    const fileName =
      `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("products")
      .upload(fileName, file);

    if (error) {
      console.log(error);
      alert("Erreur upload");
      setUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("products")
      .getPublicUrl(fileName);

    if (type === "product") {
      setImage(publicUrl);
    } else {
      setModelImage(publicUrl);
    }

    setUploading(false);
  };

  // ➕ AJOUT PRODUIT
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
          category,
        },
      ]);

    if (error) {
      console.log(error);
      alert("Erreur ajout produit");
    } else {

      alert("Produit ajouté");

      setName("");
      setDescription("");
      setPrice("");
      setOldPrice("");
      setImage("");
      setBadge("");
      setCategory("");

      fetchProducts();
    }
  };

  // ➕ AJOUT MODELE
  const addModel = async () => {

    const { error } = await supabase
      .from("product_models")
      .insert([
        {
          product_id: Number(selectedProductId),
          model_name: modelName,
          model_price: Number(modelPrice),
          model_image: modelImage,
          model_description:
            modelDescription,
        },
      ]);

    if (error) {
  console.log(error);
  alert(error.message);
}
     else {

      alert("Modèle ajouté");

      setModelName("");
      setModelPrice("");
      setModelImage("");
      setModelDescription("");

      location.reload();
    }
  };

  // 🗑️ DELETE PRODUIT
  const deleteProduct = async (id: number) => {

    const confirmDelete = confirm(
      "Supprimer ce produit ?"
    );

    if (!confirmDelete) return;

    await supabase
      .from("products")
      .delete()
      .eq("id", id);

    fetchProducts();
  };

  // 🔒 LOGIN PAGE
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

    <div className="max-w-6xl mx-auto p-6">

      {/* PRODUIT PRINCIPAL */}

      <div className="bg-white p-6 rounded-2xl shadow mb-10">

        <h2 className="text-3xl font-bold mb-6">
          ➕ Ajouter un produit
        </h2>

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Nom"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="w-full border p-4 rounded-xl"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            className="w-full border p-4 rounded-xl"
          />

          <input
            type="number"
            placeholder="Prix"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value)
            }
            className="w-full border p-4 rounded-xl"
          />

          <input
            type="number"
            placeholder="Ancien prix"
            value={oldPrice}
            onChange={(e) =>
              setOldPrice(e.target.value)
            }
            className="w-full border p-4 rounded-xl"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              uploadImage(e, "product")
            }
            className="w-full border p-4 rounded-xl"
          />

          {image && (
            <img
              src={image}
              className="w-40 rounded-xl"
            />
          )}

          <input
            type="text"
            placeholder="Badge"
            value={badge}
            onChange={(e) =>
              setBadge(e.target.value)
            }
            className="w-full border p-4 rounded-xl"
          />

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            className="w-full border p-4 rounded-xl"
          >
            <option value="">
              Choisir une catégorie
            </option>

            <option value="Soins visage">
              Soins visage
            </option>

            <option value="Savons">
              Savons
            </option>

            <option value="Huiles">
              Huiles
            </option>

            <option value="Packs">
              Packs
            </option>

          </select>

          <button
            onClick={addProduct}
            className="w-full bg-purple-700 text-white py-4 rounded-xl font-bold"
          >
            Ajouter le produit
          </button>

        </div>

      </div>

      {/* AJOUT MODELES */}

      <div className="bg-white p-6 rounded-2xl shadow mb-10">

        <h2 className="text-3xl font-bold mb-6">
          🎨 Ajouter un modèle
        </h2>

        <div className="space-y-4">

          <select
            value={selectedProductId}
            onChange={(e) =>
              setSelectedProductId(
                e.target.value
              )
            }
            className="w-full border p-4 rounded-xl"
          >

            <option value="">
              Choisir un produit
            </option>

            {products.map((product) => (

              <option
                key={product.id}
                value={product.id}
              >
                {product.name}
              </option>

            ))}

          </select>

          <input
            type="text"
            placeholder="Nom du modèle"
            value={modelName}
            onChange={(e) =>
              setModelName(e.target.value)
            }
            className="w-full border p-4 rounded-xl"
          />

          <input
            type="number"
            placeholder="Prix du modèle"
            value={modelPrice}
            onChange={(e) =>
              setModelPrice(e.target.value)
            }
            className="w-full border p-4 rounded-xl"
          />

          <textarea
            placeholder="Description modèle"
            value={modelDescription}
            onChange={(e) =>
              setModelDescription(
                e.target.value
              )
            }
            className="w-full border p-4 rounded-xl"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              uploadImage(e, "model")
            }
            className="w-full border p-4 rounded-xl"
          />

          {modelImage && (
            <img
              src={modelImage}
              className="w-40 rounded-xl"
            />
          )}

          <button
            onClick={addModel}
            className="w-full bg-fuchsia-600 text-white py-4 rounded-xl font-bold"
          >
            Ajouter le modèle
          </button>

        </div>

      </div>

      {/* PRODUITS */}

      <h1 className="text-3xl font-bold mb-6">
        🛍️ Produits
      </h1>

      <div className="grid md:grid-cols-2 gap-6">

        {products.map((product) => {

          const relatedModels =
            models.filter(
              (model) =>
                model.product_id === product.id
            );

          return (

            <div
              key={product.id}
              className="bg-white p-5 rounded-2xl shadow"
            >

              <img
                src={product.image}
                className="w-full h-60 object-cover rounded-xl mb-4"
              />

              <h2 className="text-2xl font-bold">
                {product.name}
              </h2>

              <p className="text-gray-500 mb-2">
                {product.category}
              </p>

              <p className="font-bold text-purple-700 text-2xl">
                {product.price} €
              </p>

              <div className="mt-6">

                <h3 className="font-bold mb-3">
                  🎨 Modèles :
                </h3>

                <div className="space-y-3">

                  {relatedModels.map((model) => (

                    <div
                      key={model.id}
                      className="border rounded-xl p-3"
                    >

                      <div className="flex gap-3">

                        <img
                          src={model.model_image}
                          className="w-20 h-20 rounded-xl object-cover"
                        />

                        <div>

                          <p className="font-bold">
                            {model.model_name}
                          </p>

                          <p>
                            {model.model_price} €
                          </p>

                        </div>

                      </div>

                    </div>

                  ))}

                </div>

              </div>

              <button
                onClick={() =>
                  deleteProduct(product.id)
                }
                className="mt-5 bg-red-600 text-white px-4 py-2 rounded-xl"
              >
                Supprimer
              </button>

            </div>

          );
        })}

      </div>

    </div>
  );
}