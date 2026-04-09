export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-sm text-zinc-500 space-y-2">
          <p>
            <strong className="text-zinc-700">Disclaimer:</strong> Acest
            calculator are scop informativ și nu constituie consiliere fiscală
            sau juridică. Ratele de impozitare și pragurile se pot modifica.
            Consultați un contabil autorizat pentru decizii financiare
            importante.
          </p>
          <p>
            Surse:{" "}
            <a
              href="https://www.anaf.ro"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-zinc-700 transition-colors"
            >
              ANAF
            </a>
            {" · "}
            Codul Fiscal al României
          </p>
          <p className="text-xs text-zinc-500">
            © {new Date().getFullYear()} Calculator Taxe Romania.{" "}
            <a
              href="https://github.com/alexevladgabriel/calculator-taxe"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-zinc-700 transition-colors"
            >
              Open source on GitHub
            </a>
            {process.env.NEXT_PUBLIC_COMMIT_HASH && (
              <>
                {" · "}
                <a
                  href={`https://github.com/alexevladgabriel/calculator-taxe/commit/${process.env.NEXT_PUBLIC_COMMIT_HASH}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono hover:text-zinc-700 transition-colors"
                >
                  v{process.env.NEXT_PUBLIC_COMMIT_HASH}
                </a>
              </>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
