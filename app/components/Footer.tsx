import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 md:mt-24 border-t border-gray-200 bg-white">

      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* LOGO / MARQUE */}
        <div className="text-center mb-8">

          <h3 className="text-3xl font-bold text-purple-700 mb-3">
            Mahorayh Beauté
          </h3>

          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            ✨ Soins naturels inspirés des traditions pour révéler
            l'éclat de votre peau et sublimer votre beauté au quotidien.
          </p>

        </div>

        {/* SÉPARATEUR */}
        <div className="w-24 h-1 bg-purple-700 rounded-full mx-auto mb-10"></div>

        {/* LIENS */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-10 mb-10">

          <Link
            href="/mentions-legales"
            className="text-gray-600 hover:text-purple-700 transition font-medium"
          >
            📜 Mentions légales
          </Link>

          <Link
            href="/conditions-generales-de-vente"
            className="text-gray-600 hover:text-purple-700 transition font-medium"
          >
            📋 CGV
          </Link>

          <Link
            href="/politique-de-confidentialite"
            className="text-gray-600 hover:text-purple-700 transition font-medium"
          >
            🔒 Confidentialité
          </Link>

          <a
            href="mailto:mahorayhbeaute@gmail.com"
            className="text-gray-600 hover:text-purple-700 transition font-medium"
          >
            📧 Contact
          </a>

        </div>

        {/* CONTACT */}
        <div className="text-center mb-8">

          <p className="text-gray-500 text-sm">
            📍 Lyon, France
          </p>

          <p className="text-gray-500 text-sm mt-2">
            📧 mahorayhbeaute@gmail.com
          </p>

          <p className="text-gray-500 text-sm mt-2">
            🌐 mahorayh-beaute.net
          </p>

        </div>

        {/* COPYRIGHT */}
        <div className="border-t border-gray-200 pt-6 text-center">

          <p className="text-xs text-gray-400">
            © 2026 Mahorayh Beauté — Tous droits réservés
          </p>

          <p className="text-xs text-gray-400 mt-2">
            Élégance • Héritage • Beauté naturelle
          </p>

        </div>

      </div>

    </footer>
  );
}