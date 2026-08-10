import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import ProduitClient from "../ProduitClient";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { id } = await params;

  const { data: product } = await supabase
    .from("products")
    .select("name, description, image, price, stock")
    .eq("id", Number(id.split("-")[0]))
    .single();

  if (!product) {
    return {
      title: "Produit | Mahorayh Beauté",
      description:
        "Découvrez les produits de beauté Mahorayh Beauté.",
    };
  }

  return {
  title: `${product.name} | Mahorayh Beauté`,
  description:
    product.description?.slice(0, 160) ||
    `Découvrez ${product.name} chez Mahorayh Beauté.`,

  openGraph: {
    title: `${product.name} | Mahorayh Beauté`,
    description:
      product.description?.slice(0, 160) ||
      `Découvrez ${product.name} chez Mahorayh Beauté.`,
    images: product.image
      ? [
          {
            url: product.image,
            alt: product.name,
          },
        ]
      : [],
  },
};
}

async function getProduct(id: string) {
  const { data: product } = await supabase
    .from("products")
    .select("id, name, description, image, price, stock")
    .eq("id", Number(id.split("-")[0]))
    .single();

  return product;
}

export default async function ProduitPage({
  params,
}: Props) {
  const { id } = await params;
  const product = await getProduct(id);

  const { data: reviews } = await supabase
  .from("reviews")
  .select("note")
  .eq("product_id", product?.id);

const reviewCount = reviews?.length ?? 0;
const ratingValue =
  reviewCount > 0
    ? reviews!.reduce((sum, review) => sum + review.note, 0) / reviewCount
    : 0;

  return (
  <>
    {product && (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description:
              product.description ||
              `Découvrez ${product.name} chez Mahorayh Beauté.`,
            image: product.image ? [product.image] : [],
            sku: String(product.id),
            brand: {
            "@type": "Brand",
             name: "Mahorayh Beauté",
            },
             ...(reviewCount > 0
            ? {
             aggregateRating: {
             "@type": "AggregateRating",
             ratingValue: ratingValue,
             reviewCount: reviewCount,
            },
             }
             : {}),
             offers: {
              "@type": "Offer",
              price: product.price,
              priceCurrency: "EUR",
              availability:
                product.stock > 0
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
              url: `https://www.mahorayh-beaute.fr/produit/${product.id}-${product.name
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "")}`,
            },
          }),
        }}
      />
    )}

    <ProduitClient />
  </>
);
}