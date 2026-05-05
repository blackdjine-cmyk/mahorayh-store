export default function Footer() {
  return (
    <footer className="bg-gray-100 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-10 text-center">

        <h3 className="text-lg font-semibold mb-2 text-purple-700">
          Mahorayh Beauté
        </h3>

        <p className="text-gray-600 text-sm mb-6">
          Soins naturels inspirés des traditions pour révéler l’éclat de votre peau.
        </p>

        <div className="flex justify-center gap-6 text-sm text-gray-500 mb-6">
          <a href="#" className="hover:text-purple-600">Mentions légales</a>
          <a href="#" className="hover:text-purple-600">Politique de confidentialité</a>
          <a href="#" className="hover:text-purple-600">Contact</a>
        </div>

        <p className="text-xs text-gray-400">
          © 2026 Mahorayh Beauté — Tous droits réservés
        </p>

      </div>
    </footer>
  );
}