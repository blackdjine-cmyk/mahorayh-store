"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function EditPage() {

  const [product, setProduct] = useState<any>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] =
    useState("");

  const [weight, setWeight] =
    useState("");

  const [badge, setBadge] = useState("");
  const [category, setCategory] = useState("");

  const [image, setImage] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const [uploading, setUploading] = useState(false);

  // 📸 IMAGE PRINCIPALE
  const uploadImage = async (
    e: React.ChangeEvent<HTMLInputElement>
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

  // 🖼️ GALERIE MULTI IMAGES
  const uploadGalleryImages = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const files = e.target.files;

    if (!files) return;

    setUploading(true);

    const uploadedImages: string[] = [];

    for (const file of Array.from(files)) {

      const fileName =
        `${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from("products")
        .upload(fileName, file);

      if (error) {
        console.log(error);
        continue;
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("products")
        .getPublicUrl(fileName);

      uploadedImages.push(publicUrl);
    }

    setImages((prev) => [
      ...prev,
      ...uploadedImages,
    ]);

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

      setWeight(
        parsed.weight || ""
      );

      setBadge(parsed.badge || "");

      setCategory(
        parsed.category || ""
      );

      setImage(parsed.image || "");

      setImages(parsed.images || []);
    }

  }, []);

  // 💾 SAVE
  const updateProduct = async () => {

    if (!product) return;

    const { error } = await supabase
      .from("products")
      .update({
        name,
        description,
        price: Number(price),
        old_price: Number(oldPrice),
        weight: Number(weight),
        badge,
        category,
        image,
        images,
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
          type="number"
          placeholder="Poids produit emballé (g)"
          value={weight}
          onChange={(e) =>
            setWeight(e.target.value)
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

        {/* IMAGE PRINCIPALE */}

        <div className="space-y-3">

          <input
            type="file"
            accept="image/*"
            onChange={uploadImage}
            className="w-full border p-4 rounded-xl"
          />

          {image && (

            <img
              src={image}
              alt="Preview"
              className="w-40 rounded-2xl border"
            />

          )}

        </div>

        {/* GALERIE */}

        <div className="space-y-4">

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={uploadGalleryImages}
            className="w-full border p-4 rounded-xl"
          />

          <div className="flex gap-3 flex-wrap">

            {images.map((img, index) => (

              <img
                key={index}
                src={img}
                className="w-24 h-24 object-cover rounded-xl border"
              />

            ))}

          </div>

        </div>

        {/* LOADING */}

        {uploading && (

          <p className="text-purple-600">
            Upload image...
          </p>

        )}

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