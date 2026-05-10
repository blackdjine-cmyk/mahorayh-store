export default function Footer() {
  return (
    <footer className="bg-gray-100 py-10 mt-8 md:mt-20">
      
      <div className="max-w-6xl mx-auto px-6 py-6 text-center">
        
        {/* TITRE */}
        <h3 className="text-lg font-semibold mb-2 text-purple-700">
          Mahorayh Beauté
        </h3>

        {/* TEXTE */}
        <p className="text-gray-600 text-sm mb-6 max-w-md mx-auto">
          Soins naturels inspirés des traditions pour révéler l’éclat de votre peau.
        </p>

        {/* LIENS */}
        <div className="flex justify-center gap-6 text-sm text-gray-500 mb-6 flex-wrap">
          <a href="#" className="hover:text-purple-600 transition">
            Mentions légales
          </a>

          <a href="#" className="hover:text-purple-600 transition">
            Politique de confidentialité
          </a>

          <a href="#" className="hover:text-purple-600 transition">
            Contact
          </a>
        </div>

        {/* COPYRIGHT */}
        <p className="text-xs text-gray-400">
          © 2026 Mahorayh Beauté — Tous droits réservés
        </p>

      </div>
    </footer>
  );
}