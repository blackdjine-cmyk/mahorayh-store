"use client";

import { useEffect, useState, useRef } from "react";
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
  const [reviews, setReviews] = useState<any[]>([]);

  const [uploading, setUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [editingReview, setEditingReview] = useState<string | null>(null);

  const [editedComment, setEditedComment] = useState("");

  const [editedNote, setEditedNote] = useState(5);

  const [models, setModels] = useState<any[]>([]);
  const [showAddModel, setShowAddModel] = useState(false);

  const [modelName, setModelName] = useState("");
  const [modelPrice, setModelPrice] = useState("");
  const [modelDescription, setModelDescription] = useState("");
  const [modelWeight, setModelWeight] = useState("");
  const [modelStock, setModelStock] = useState("");
  const [modelImage, setModelImage] = useState("");

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

  const uploadModelImage = async (
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
    alert("Erreur upload");
    setUploading(false);
    return;
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("products")
    .getPublicUrl(fileName);

  setModelImage(publicUrl);

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

  const fetchReviews = async (productId: string) => {

  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (!error && data) {
    setReviews(data);
  }

};
const deleteReview = async (id: string) => {

  const ok = confirm(
    "Supprimer définitivement cet avis ?"
  );

  if (!ok) return;

  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", id);

  if (!error) {

    setReviews((prev) =>
      prev.filter((review) => review.id !== id)
    );

  } else {

    alert("Erreur lors de la suppression.");

  }

};
const updateReview = async (id: string) => {

  const { error } = await supabase
    .from("reviews")
    .update({
      note: editedNote,
      commentaire: editedComment,
    })
    .eq("id", id);

  if (error) {

    alert("Erreur lors de la modification.");

    return;

  }

  setReviews((prev) =>
    prev.map((review: any) =>
      review.id === id
        ? {
            ...review,
            note: editedNote,
            commentaire: editedComment,
          }
        : review
    )
  );

  setEditingReview(null);

};
const fetchModels = async (productId: string) => {

  const { data, error } = await supabase
    .from("product_models")
    .select("*")
    .eq("product_id", productId);

  if (!error) {
    setModels(data || []);
  }
};

const addModel = async () => {

  if (
    !product ||
    !modelName.trim() ||
    !modelPrice ||
    !modelImage
  ) {
    alert("Remplis tous les champs obligatoires");
    return;
  }

  const { error } = await supabase
    .from("product_models")
    .insert([
      {
        product_id: product.id,
        model_name: modelName.trim(),
        model_price: Number(modelPrice),
        model_image: modelImage,
        model_description: modelDescription.trim(),
        stock: Number(modelStock || 0),
        model_weight: Number(modelWeight || 0),
      },
    ]);

  if (error) {
    console.log(error);
    alert(error.message);
    return;
  }

  alert("Variante ajoutée");

  setModelName("");
  setModelPrice("");
  setModelImage("");
  setModelDescription("");
  setModelStock("");
  setModelWeight("");

  fetchModels(String(product.id));
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

      fetchReviews(parsed.id);

      fetchModels(parsed.id);

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
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={uploadImage}
            className="w-full border p-4 rounded-xl"
          />
         {image && (
         <div
         className="relative w-fit cursor-pointer"
         onClick={() => imageInputRef.current?.click()}
         >
         <img
         src={image}
         alt="Preview"
         className="w-40 rounded-2xl border"
         />

         <button
         type="button"
         onClick={(e) => {
         e.stopPropagation();
         setImage("");
         }}
         className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-600 text-white font-bold hover:bg-red-700"
         >
         ×
        </button>
       </div>
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

          <div key={index} className="relative">

          <img
         src={img}
         className="w-24 h-24 object-cover rounded-xl border"
        />

         <button
         type="button"
         onClick={() =>
         setImages(images.filter((_, i) => i !== index))
       }
         className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-600 text-white text-xs hover:bg-red-700"
      >
         ✕
       </button>

       <button
       type="button"
       onClick={() => setImage(img)}
       className={`absolute bottom-1 left-1 px-2 py-1 rounded text-[10px] font-semibold transition ${
       image === img
       ? "bg-green-600 text-white"
       : "bg-yellow-500 text-white hover:bg-yellow-600"
       }`}
       >
       {image === img ? "⭐ Principale" : "⭐ Définir"}
       </button>

        </div>

        ))}

          </div>

        </div>

        {/* LOADING */}

        {uploading && (

          <p className="text-purple-600">
            Upload image...
          </p>

        )}

        {/* ⭐ AVIS CLIENTS */}

<div className="mt-10 border rounded-2xl p-6 bg-white">

  <h2 className="text-xl font-bold mb-4">
    Avis clients ({reviews.length})
  </h2>

  {reviews.length === 0 ? (

    <p className="text-gray-500">
      Aucun avis.
    </p>

  ) : (

    reviews.map((review: any) => (

      <div
        key={review.id}
        className="border-b py-4"
      >

        <p className="font-semibold">
          {review.client}
        </p>

        <p className="text-yellow-500">
          {"⭐".repeat(review.note)}
        </p>

       {editingReview === review.id ? (

  <div className="mt-3 space-y-3">

    <select
      value={editedNote}
      onChange={(e) => setEditedNote(Number(e.target.value))}
      className="w-full border rounded-lg p-2"
    >
      <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
      <option value={4}>⭐⭐⭐⭐ (4)</option>
      <option value={3}>⭐⭐⭐ (3)</option>
      <option value={2}>⭐⭐ (2)</option>
      <option value={1}>⭐ (1)</option>
    </select>

    <textarea
      value={editedComment}
      onChange={(e) => setEditedComment(e.target.value)}
      className="w-full border rounded-lg p-3"
      rows={4}
    />
    <button
      type="button"
      onClick={() => updateReview(review.id)}
      className="rounded-xl bg-green-600 px-4 py-2 text-white font-semibold hover:bg-green-700"
    >
      💾 Enregistrer les modifications
    </button>

  </div>

) : (

  <p className="text-gray-700">
    {review.commentaire}
  </p>

)}
       <button
       type="button"
       onClick={() => {
       setEditingReview(review.id);
       setEditedComment(review.commentaire);
       setEditedNote(review.note);
     }}
     className="mt-4 mr-2 inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-600 shadow-sm transition-all duration-200 hover:bg-blue-50 hover:border-blue-400 hover:shadow-md"
    >
     ✏️ Modifier
    </button>

       <button
       type="button"
       onClick={() => deleteReview(review.id)}
       className="mt-4 inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 shadow-sm transition-all duration-200 hover:bg-red-50 hover:border-red-400 hover:shadow-md"
      >
       <span className="text-base">🗑️</span>
       <span>Supprimer l'avis</span>
     </button>

      </div>

    ))

  )}

    </div>

        {/* 📦 VARIANTES */}

<div className="mt-10 border rounded-2xl p-6 bg-white">

  <h2 className="text-2xl font-bold mb-6">
    Variantes du produit ({models.length})
  </h2>

<button
  type="button"
  onClick={() => setShowAddModel(!showAddModel)}
  className="mb-6 rounded-xl bg-purple-600 px-5 py-3 text-white font-semibold hover:bg-purple-700"
>
  {showAddModel ? "✖ Fermer" : "➕ Ajouter une variante"}
</button>

{showAddModel && (

  <div className="mb-6 rounded-2xl border bg-gray-50 p-6">
  <div className="space-y-4">

    <h3 className="mb-6 text-lg font-bold">
      Nouvelle variante
    </h3>

    <input
  type="file"
  accept="image/*"
  onChange={uploadModelImage}
  className="w-full border p-4 rounded-xl"
/>

{modelImage && (

  <img
    src={modelImage}
    className="w-40 rounded-xl "
  />

)}

<input
  type="text"
  placeholder="Nom de la variante"
  value={modelName}
  onChange={(e) => setModelName(e.target.value)}
  className="w-full border p-4 rounded-xl "
/>

<input
  type="number"
  placeholder="Prix (€)"
  value={modelPrice}
  onChange={(e) => setModelPrice(e.target.value)}
  className="w-full border p-4 rounded-xl"
/>

<textarea
  placeholder="Description"
  value={modelDescription}
  onChange={(e) => setModelDescription(e.target.value)}
  className="w-full border p-4 rounded-xl"
/>

<input
  type="number"
  placeholder="Stock"
  value={modelStock}
  onChange={(e) => setModelStock(e.target.value)}
  className="w-full border p-4 rounded-xl"
/>

<input
  type="number"
  placeholder="Poids emballé (g)"
  value={modelWeight}
  onChange={(e) => setModelWeight(e.target.value)}
  className="w-full border p-4 rounded-xl"
/>

<button
  type="button"
  onClick={addModel}
  className="mt-4 w-full rounded-xl bg-fuchsia-600 py-3 font-semibold text-white hover:bg-fuchsia-700"
>
  ➕ Enregistrer la variante
</button>

  </div>
  </div>

)}

<div className="mt-10 mb-8 border-t border-gray-200"></div>

  {models.length === 0 ? (

  <p className="text-gray-500">
    Aucune variante pour ce produit.
  </p>

) : (

  <div className="space-y-6">

    {models.map((model: any) => (

      <div
  key={model.id}
  className=" mt-4 border rounded-xl p-4 flex items-center justify-between"
>

  <div>

    <p className="font-bold">
      {model.model_name}
    </p>

    <p className="text-purple-700 font-semibold">
      {Number(model.model_price).toFixed(2)} €
    </p>

  </div>

  <div className="flex gap-2">

    <button
      type="button"
      className="rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-600 shadow-sm hover:bg-blue-50"
    >
      ✏️ Modifier
    </button>

    <button
      type="button"
      className="rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 shadow-sm hover:bg-red-50"
    >
      🗑 Supprimer
    </button>

  </div>

</div>

    ))}

  </div>

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