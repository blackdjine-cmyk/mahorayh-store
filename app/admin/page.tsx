"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {

  const [products, setProducts] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [images, setImages] = useState<string[]>([]);

  // 🔐 LOGIN
  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState("");

  // 📦 PRODUIT PRINCIPAL
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("");
  const [badge, setBadge] = useState("");
  const [category, setCategory] = useState("");

  // 🎨 MODELES
  const [selectedProductId, setSelectedProductId] =
    useState("");

  const [modelName, setModelName] = useState("");
  const [modelPrice, setModelPrice] = useState("");
  const [modelImage, setModelImage] = useState("");
  const [modelDescription, setModelDescription] = useState("");
  const [modelStock, setModelStock] = useState("");

  const [editingModelId, setEditingModelId] =
    useState<number | null>(null);

  const [uploading, setUploading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // 🔐 LOGIN
  const handleLogin = () => {
  const trimmedPassword = password.trim();

  if (trimmedPassword === "admin123") {
    setIsAuth(true);
    setPassword("");
    return;
  }

  alert("Mot de passe incorrect");
};

  // 📦 FETCH DATA
  useEffect(() => {

    if (!isAuth) return;

    fetchProducts();
    fetchModels();
    fetchOrders();

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

  const fetchOrders = async () => {
  setOrdersLoading(true);

  const { data, error } = await supabase
    .from("commandes")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.log(error);
  } else {
    setOrders(data || []);
  }

  setOrdersLoading(false);
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

  // ➕ AJOUT PRODUIT
const addProduct = async () => {
  if (
    !name.trim() ||
    !description.trim() ||
    !price ||
    !image ||
    !category
  ) {
    alert("Remplis tous les champs obligatoires");
    return;
  }

  const { error } = await supabase
    .from("products")
    .insert([
  {
    name: name.trim(),
    description: description.trim(),
    price: Number(price),
    old_price: oldPrice
      ? Number(oldPrice)
      : null,
    image,
    images,
    badge: badge.trim(),
    category,
    stock: Number(stock || 0),
  },
]);

  if (error) {
    console.log(error);
    alert("Erreur ajout produit");
    return;
  }

  alert("Produit ajouté");

  setName("");
  setDescription("");
  setPrice("");
  setOldPrice("");
  setImage("");
  setBadge("");
  setCategory("");
  setStock("");

  fetchProducts();
};

  // ➕ / ✏️ AJOUT OU MODIFICATION MODELE
const addModel = async () => {
  if (
    !selectedProductId ||
    !modelName.trim() ||
    !modelPrice ||
    !modelImage
  ) {
    alert("Remplis tous les champs obligatoires");
    return;
  }

  if (editingModelId) {
    const { error } = await supabase
      .from("product_models")
      .update({
        model_name: modelName.trim(),
        model_price: Number(modelPrice),
        model_image: modelImage,
        model_description:
          modelDescription.trim(),
      })
      .eq("id", editingModelId);

    if (error) {
      console.log(error);
      alert(error.message);
      return;
    }

    alert("Modèle modifié");

    setEditingModelId(null);
    setSelectedProductId("");
    setModelName("");
    setModelPrice("");
    setModelImage("");
    setModelDescription("");
    setModelStock("");

    fetchModels();
    return;
  }

  const { error } = await supabase
    .from("product_models")
    .insert([
  {
    product_id: Number(
      selectedProductId
    ),
    model_name: modelName.trim(),
    model_price: Number(modelPrice),
    model_image: modelImage,
    model_description:
      modelDescription.trim(),
    stock: Number(modelStock || 0),
  },
]);

  if (error) {
    console.log(error);
    alert(error.message);
    return;
  }

  alert("Modèle ajouté");

  setSelectedProductId("");
  setModelName("");
  setModelPrice("");
  setModelImage("");
  setModelDescription("");

  fetchModels();
};

  // 🗑 DELETE PRODUIT
 const deleteProduct = async (
  id: number
) => {
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
    alert("Erreur suppression produit");
    return;
  }

  fetchProducts();
};

  // 🗑 DELETE MODELE
  const deleteModel = async (
  id: number
) => {
  const confirmDelete = confirm(
    "Supprimer ce modèle ?"
  );

  if (!confirmDelete) return;

  const { error } = await supabase
    .from("product_models")
    .delete()
    .eq("id", id);

  if (error) {
    console.log(error);
    alert("Erreur suppression modèle");
    return;
  }

  fetchModels();
};

  const deleteOrder = async (
  id: number
) => {
  const confirmDelete = confirm(
    "Supprimer cette commande ?"
  );

  if (!confirmDelete) return;

  const { error } = await supabase
    .from("commandes")
    .delete()
    .eq("id", id);

  if (error) {
    console.log(error);
    alert("Erreur suppression commande");
    return;
  }

  fetchOrders();
};

  // 🔄 UPDATE STATUT COMMANDE
 const updateCommandeStatut = async (
  id: number,
  statut: string
) => {
  const cleanStatut =
    statut.trim().toLowerCase();

  const { error } = await supabase
    .from("commandes")
    .update({
      statut: cleanStatut,
    })
    .eq("id", id);

  if (error) {
    console.log(error);
    alert("Erreur mise à jour statut");
    return;
  }

  setOrders((prev: any[]) =>
    prev.map((order) =>
      order.id === id
        ? {
            ...order,
            statut: cleanStatut,
          }
        : order
    )
  );
};

  // ✏️ MODIFIER PRODUIT
  function editProduct(product: any) {

    localStorage.setItem(
      "productToEdit",
      JSON.stringify(product)
    );

    window.location.href =
      "/admin/edit";
  }

  // ✏️ MODIFIER MODELE
  const editModel = (model: any) => {

    setEditingModelId(model.id);

    setSelectedProductId(
      String(model.product_id)
    );

    setModelName(model.model_name || "");

    setModelPrice(
      String(model.model_price || "")
    );

    setModelImage(
      model.model_image || ""
    );

    setModelDescription(
      model.model_description || ""
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // 🔒 LOGIN PAGE
 if (!isAuth) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center">
          🔐 Accès Admin
        </h1>

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleLogin();
            }
          }}
          className="w-full border p-4 rounded-xl outline-none focus:ring-2 focus:ring-purple-600"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-bold transition"
        >
          Connexion
        </button>
      </div>
    </div>
  );
}

 const totalSales = orders.reduce(
  (acc, order) =>
    acc + Number(order.total || 0),
  0
);

const totalClients = new Set(
  orders
    .map((order) => order.email)
    .filter(Boolean)
).size;

  return (

    <div className="max-w-6xl mx-auto p-6">

      {/* PRODUIT */}

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
           type="number"
           placeholder="Stock du produit"
           value={stock}
           onChange={(e) =>
           setStock(e.target.value)
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

      {/* MODELES */}

      <div className="bg-white p-6 rounded-2xl shadow mb-10">

        <h2 className="text-3xl font-bold mb-6">

          {editingModelId
            ? "✏️ Modifier un modèle"
            : "🎨 Ajouter un modèle"}

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
    type="number"
    placeholder="Stock du modèle"
    value={modelStock}
    onChange={(e) =>
    setModelStock(e.target.value)
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

            {editingModelId
              ? "Sauvegarder modèle"
              : "Ajouter le modèle"}

          </button>

        </div>

      </div>

      {/* LISTE PRODUITS */}

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

                          <div className="flex gap-2 mt-3">

                            <button
                              onClick={() =>
                                editModel(model)
                              }
                              className="bg-blue-600 text-white px-3 py-1 rounded-lg"
                            >
                              Modifier modèle
                            </button>

                            <button
                              onClick={() =>
                                deleteModel(model.id)
                              }
                              className="bg-red-600 text-white px-3 py-1 rounded-lg"
                            >
                              Supprimer modèle
                            </button>

                          </div>

                        </div>

                      </div>

                    </div>

                  ))}

                </div>

              </div>

              <div className="flex gap-3 mt-5">

                <button
                  onClick={() =>
                    editProduct(product)
                  }
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl"
                >
                  Modifier
                </button>

                <button
                  onClick={() =>
                    deleteProduct(product.id)
                  }
                  className="bg-red-600 text-white px-4 py-2 rounded-xl"
                >
                  Supprimer
                </button>

              </div>

            </div>
          );
        })}

      </div>

{/* COMMANDES */}
<div className="mt-16">

  <h1 className="text-3xl font-bold mb-8">
    📦 Commandes
  </h1>

  {/* STATS */}
  <div className="grid md:grid-cols-3 gap-6 mb-8">

    <div className="bg-white p-6 rounded-2xl shadow">
      <p className="text-gray-500">
        Nombre commandes
      </p>
      <h2 className="text-4xl font-bold mt-2">
        {orders.length}
      </h2>
    </div>

    <div className="bg-white p-6 rounded-2xl shadow">
      <p className="text-gray-500">
        Total ventes
      </p>
      <h2 className="text-4xl font-bold text-purple-700 mt-2">
        {totalSales.toFixed(2)} €
      </h2>
    </div>

    <div className="bg-white p-6 rounded-2xl shadow">
      <p className="text-gray-500">
        Clients
      </p>
      <h2 className="text-4xl font-bold mt-2">
        {totalClients}
      </h2>
    </div>

  </div>

  {/* LISTE COMMANDES */}
  <div className="space-y-5">

    {ordersLoading ? (
      <p>Chargement...</p>
    ) : orders.length === 0 ? (
      <p>Aucune commande</p>
    ) : (
     orders.map((order) => {
  const statut = order.statut
  ?.trim()
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "");

  return (
        <div
          key={order.id}
          className="bg-white p-6 rounded-2xl shadow border"
        >
          <div className="flex justify-between gap-8">

            <div className="space-y-2 flex-1">
              <h2 className="text-xl font-bold">
                {order.client}
              </h2>

              <p>
                📧 {order.email}
              </p>

              <p>
                📞 {order.telephone}
              </p>

              <p>
                📍 {order.code_postal}
              </p>

              <p>
                🏠 {order.adresse}
              </p>

              <p className="font-bold text-purple-700 text-xl">
                {Number(order.total).toFixed(2)} €
              </p>

<div className="mt-4 border-t pt-4">
  <p className="font-semibold mb-2 text-gray-700">
    📦 Produits commandés
  </p>

  {Array.isArray(order.produits) &&
  order.produits.map(
    (
      item: any,
      index: number
    ) => (
      <div
        key={index}
        className="flex justify-between py-1 text-sm"
      >
        <span>
          {item.name} × {item.quantity}
        </span>

        <span className="font-medium text-purple-700">
          {item.price} €
        </span>
      </div>
    )
  )}
</div>

              <p className="text-sm text-gray-500">
                {new Date(
                  order.created_at
                ).toLocaleDateString("fr-FR")}
              </p>
            </div>

           {/* ACTIONS COMMANDE */}
<div className="flex flex-col gap-3 min-w-[140px]">

{["en_attente", "payee", "expediee"].includes(
  statut || ""
) && (
  <button
    onClick={() => {
      if (statut === "en_attente") {
        updateCommandeStatut(
          order.id,
          "payee"
        );
      } else if (
        statut === "payee"
      ) {
        updateCommandeStatut(
          order.id,
          "expediee"
        );
      } else if (
        statut === "expediee"
      ) {
        updateCommandeStatut(
          order.id,
          "livree"
        );
      }
    }}
    className="w-full bg-green-600 text-white px-4 py-2 rounded-xl"
  >
    {statut === "en_attente"
      ? "Payée"
      : statut === "payee"
      ? "Expédiée"
      : "Livrée"}
  </button>
)}

  <button
    onClick={() => deleteOrder(order.id)}
    className="w-full bg-red-600 text-white px-4 py-2 rounded-xl"
  >
    Supprimer
  </button>

</div>
   
          </div>
               </div>
      );
    })
    )}

  </div>
</div>

    </div>
  );
}