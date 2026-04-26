import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <p className="text-5xl font-bold text-stone-200">404</p>
      <h1 className="text-xl font-semibold text-stone-800">Page introuvable</h1>
      <Link
        href="/"
        className="py-2 -my-2 text-sm text-stone-500 transition hover:text-stone-900"
      >
        ← Retour à l'accueil
      </Link>
    </div>
  );
}
