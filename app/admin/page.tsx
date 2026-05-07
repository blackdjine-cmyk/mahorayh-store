"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [commandes, setCommandes] = useState<any[]>([]);

  // 📦 Charger commandes
  useEffect(() => {
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
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
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