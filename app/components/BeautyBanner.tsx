import Link from "next/link";

export default function BeautyBanner() {
  return (
    <section className="bg-gradient-to-b from-[#f3ede6] to-[#faf7f2] pt-8 pb-2 md:pt-14 md:pb-4 px-4 md:px-6">

      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-8">

       <p className="inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
        ✨ Découvrez l'univers Mahorayh Beauté
      </p>

     <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
       L'élégance inspirée de la nature
     </h2>

     <p className="max-w-2xl mx-auto text-gray-600 text-lg leading-relaxed">
      Des soins premium élaborés pour révéler durablement
      l'éclat naturel des peaux noires et métissées.
     </p>

    </div>

        <Link href="/produit">

          <img
            src="/hero-resultats-curcuma.png"
            alt="Mahorayh Beauté"
            className="
              w-full
              rounded-[35px]
              shadow-2xl
              hover:scale-[1.01]
              transition
              duration-300
              cursor-pointer
            "
          />

        </Link>

      </div>

    </section>
  );
}