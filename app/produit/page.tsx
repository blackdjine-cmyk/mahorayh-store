import type { Metadata } from "next";
import ProduitClient from "./ProduitClient";

export const metadata: Metadata = {
  title: "Routine Éclat au Curcuma | Mahorayh Beauté",
  description:
    "Découvrez la Routine Éclat au Curcuma de Mahorayh Beauté, pensée pour réduire les taches, unifier le teint et révéler l’éclat naturel des peaux noires et métissées.",
};

export default function ProduitPage() {
  return <ProduitClient />;
}