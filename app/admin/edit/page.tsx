"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function EditPage() {

  const [product, setProduct] = useState<any>(null);

  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");

  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] =
    useState("");

  const [badge, setBadge] = useState("");
  const [category, setCategory] =
    useState("");

  const [image, setImage] = useState("");

  const [uploading, setUploading] =
  useState(false);

const uploadImage = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {

  const file = e.target.files?.[0];

  if (!file) return;

  setUploading(true);

  const fileName = `${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("products")
    .upload(fileName, file);

  if (error) {

    console.log(error);

    alert("Erreur upload image");

    setUploading(false);

    return;
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("products")
    .getPublicUrl(fileName);

  setImage(publicUrl);

  setUploading(false);
};

  useEffect(() => {

    const storedProduct =
      localStorage.getItem("productToEdit");

    if (storedProduct) {

      const parsed =
        JSON.parse(storedProduct);

      setProduct(parsed);

      setName(parsed.name || "");
      setDescription(
        parsed.description || ""
      );

      setPrice(parsed.price || "");
      setOldPrice(
        parsed.old_price || ""
      );

      setBadge(parsed.badge || "");
      setCategory(
        parsed.category || ""
      );

      setImage(parsed.image || "");
    }

  }, []);

  const updateProduct = async () => {

    if (!product) return;

    const { error } = await supabase
      .from("products")
      .update({
        name,
        description,
        price: Number(price),
        old_price: Number(oldPrice),
        badge,
        category,
        image,
      })
      .eq("id", product.id);

    if (error) {

      console.log(error);
      alert("Erreur modification");

    } else {

      alert("Produit modifié");

      window.location.href = "/admin";
    }
  };

  if (!product) {

    return (
      <div className="p-10">
        Chargement...
      </div>
    );
  }

  return (

    <div className="max-w-3xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        ✏️ Modifier produit
      </h1>

      <div className="space-y-4">

        <input
          type="text"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          className="w-full border p-4 rounded-xl"
        />

        <textarea
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          className="w-full border p-4 rounded-xl"
        />

        <input
          type="number"
          value={price}
          onChange={(e) =>
            setPrice(e.target.value)
          }
          className="w-full border p-4 rounded-xl"
        />

        <input
          type="number"
          value={oldPrice}
          onChange={(e) =>
            setOldPrice(e.target.value)
          }
          className="w-full border p-4 rounded-xl"
        />

        <input
          type="text"
          value={badge}
          onChange={(e) =>
            setBadge(e.target.value)
          }
          className="w-full border p-4 rounded-xl"
        />

        <input
          type="text"
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
          className="w-full border p-4 rounded-xl"
        />

        <div className="space-y-3">

  <input
    type="file"
    accept="image/*"
    onChange={uploadImage}
    className="w-full border p-4 rounded-xl"
  />

  {uploading && (
    <p className="text-purple-600">
      Upload image...
    </p>
  )}

  {image && (
    <img
      src={image}
      alt="Preview"
      className="w-40 rounded-2xl border"
    />
  )}

</div>

        <button
          onClick={updateProduct}
          className="w-full bg-purple-700 text-white py-4 rounded-xl font-bold"
        >
          Sauvegarder les modifications
        </button>

      </div>

    </div>
  );
}