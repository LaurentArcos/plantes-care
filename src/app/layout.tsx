import "../styles/globals.css";
import type { Metadata, Route } from "next";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Plantes Care",
  description: "Planning d’entretien des plantes (offline-first PWA)",
  manifest: "/manifest.json",
  themeColor: "#16a34a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-gray-50 text-gray-900">
        <header className="border-b bg-white">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <h1 className="text-lg font-semibold">🌿 Plantes Care</h1>
            <nav className="flex gap-2">
              <Link
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium border border-gray-300 hover:bg-gray-100"
                href={"/" as Route}
              >
                Dashboard
              </Link>
              <Link
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium border border-gray-300 hover:bg-gray-100"
                href={"/plants" as Route}
              >
                Plantes
              </Link>
              <Link
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium border border-gray-300 hover:bg-gray-100"
                href={"/rules" as Route}
              >
                Règles
              </Link>
            </nav>
          </div>
        </header>

        <ServiceWorkerRegister />

        <main className="max-w-5xl mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
