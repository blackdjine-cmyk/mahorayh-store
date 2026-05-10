export default function TrustSection() {
  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-5xl mx-auto text-center">

        {/* TITRE */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          Une routine pensée pour transformer votre peau
        </h2>

        {/* DESCRIPTION */}
        <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
          Une routine naturelle conçue pour corriger les taches, unifier le teint et révéler l’éclat réel des peaux noires et métissées, sans compromis.
        </p>

        {/* BLOCS */}
        <div className="grid md:grid-cols-3 gap-8">

          {/* BLOC 1 */}
          <div className="p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 bg-[#f9f6f1]">
            <div className="text-3xl mb-3">🌿</div>

            <h3 className="font-semibold text-lg mb-2">
              Ingrédients naturels
            </h3>

            <p className="text-gray-600 text-sm">
              Des actifs naturels puissants comme le curcuma,
              reconnus pour éclaircir et purifier la peau.
            </p>
          </div>

          {/* BLOC 2 */}
          <div className="p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 bg-[#f9f6f1]">
            <div className="text-3xl mb-3">💧</div>

            <h3 className="font-semibold text-lg mb-2">
              Respectueux de la peau
            </h3>

            <p className="text-gray-600 text-sm">
              Une routine douce qui respecte votre peau
              sans l’agresser ni la fragiliser.
            </p>
          </div>

          {/* BLOC 3 */}
          <div className="p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 bg-[#f9f6f1]">
            <div className="text-3xl mb-3">✨</div>

            <h3 className="font-semibold text-lg mb-2">
              Résultats visibles
            </h3>

            <p className="text-gray-600 text-sm">
              Une peau plus lumineuse et uniforme
              dès les premières semaines.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}