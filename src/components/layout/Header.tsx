import { Calculator } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900">
              <Calculator className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-base font-semibold tracking-tight text-zinc-900">
                Calculator Taxe România
              </span>
              <p className="text-xs text-zinc-500 hidden sm:block">
                Angajat vs PFA vs SRL - compara si alege
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
