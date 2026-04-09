"use client";

import { useState } from "react";
import { structureDescriptions } from "@/lib/tax-engine/descriptions";
import type { StructureType } from "@/lib/tax-engine";
import {
  BookOpen,
  ChevronDown,
  Briefcase,
  User,
  FileText,
  Building2,
  Building,
} from "lucide-react";
import { cn } from "@/lib/utils";

const structureOrder: StructureType[] = [
  "angajat",
  "pfa-real",
  "pfa-norma",
  "srl-micro",
  "srl-standard",
];

const structureIcons: Record<StructureType, React.ReactNode> = {
  angajat: <Briefcase className="h-4 w-4" />,
  "pfa-real": <User className="h-4 w-4" />,
  "pfa-norma": <FileText className="h-4 w-4" />,
  "srl-micro": <Building2 className="h-4 w-4" />,
  "srl-standard": <Building className="h-4 w-4" />,
};

const structureLabels: Record<StructureType, string> = {
  angajat: "Angajat",
  "pfa-real": "PFA (Sistem Real)",
  "pfa-norma": "PFA (Normă de Venit)",
  "srl-micro": "SRL Micro-întreprindere",
  "srl-standard": "SRL (Impozit pe Profit)",
};

export function StructureGuide() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-blue-200 bg-blue-50/50 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-blue-50 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
            <BookOpen className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <span className="text-sm font-semibold text-blue-900">
              Nou în fiscalitate? Ce înseamnă PFA, SRL, Angajat?
            </span>
            <p className="text-xs text-blue-600 mt-0.5">
              Ghid rapid pentru începători  - apasă pentru a afla
            </p>
          </div>
        </div>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-blue-400 transition-transform shrink-0",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="px-5 pb-5 space-y-4 border-t border-blue-200">
          {/* Quick overview */}
          <div className="pt-4">
            <p className="text-sm text-blue-800 leading-relaxed">
              În România ai mai multe opțiuni prin care poți lucra și câștiga
              bani. Fiecare are taxe diferite, și în funcție de cât câștigi, una
              poate fi mult mai avantajoasă decât alta. Iată cele 5 variante
              principale:
            </p>
          </div>

          {/* Structure cards */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {structureOrder.map((type) => {
              const desc = structureDescriptions[type];
              return (
                <div
                  key={type}
                  className="rounded-xl bg-white border border-blue-100 p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
                      {structureIcons[type]}
                    </div>
                    <h3 className="text-sm font-bold text-zinc-900">
                      {structureLabels[type]}
                    </h3>
                  </div>
                  <p className="text-xs leading-relaxed text-zinc-600 mb-2.5">
                    {desc.explanation}
                  </p>
                  <div className="rounded-lg bg-emerald-50 px-3 py-2">
                    <span className="text-xs font-medium text-emerald-700">
                      ✦ Ideal pentru:
                    </span>
                    <p className="text-xs text-emerald-600 mt-0.5">
                      {desc.bestFor}
                    </p>
                  </div>
                  <div className="mt-2.5">
                    <span className="text-xs font-medium text-zinc-500">
                      Taxe principale:
                    </span>
                    <ul className="mt-1 space-y-0.5">
                      {desc.keyTaxes.map((tax, i) => (
                        <li
                          key={i}
                          className="text-xs text-zinc-500 flex gap-1.5"
                        >
                          <span className="text-zinc-300 shrink-0">•</span>
                          <span>{tax}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tax comparison table */}
          <div className="rounded-xl bg-white border border-blue-100 overflow-hidden">
            <div className="px-4 pt-4 pb-2">
              <h3 className="text-sm font-bold text-zinc-900">
                Comparatie taxe per structura
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Ce taxe platesti in fiecare varianta
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50/80">
                    <th className="px-4 py-2.5 text-left font-semibold text-zinc-700 whitespace-nowrap">
                      Taxa
                    </th>
                    <th className="px-3 py-2.5 text-center font-semibold text-zinc-500 whitespace-nowrap">
                      Angajat
                    </th>
                    <th className="px-3 py-2.5 text-center font-semibold text-amber-600 whitespace-nowrap">
                      PFA Real
                    </th>
                    <th className="px-3 py-2.5 text-center font-semibold text-amber-600 whitespace-nowrap">
                      PFA Norma
                    </th>
                    <th className="px-3 py-2.5 text-center font-semibold text-emerald-700 whitespace-nowrap">
                      SRL Micro
                    </th>
                    <th className="px-3 py-2.5 text-center font-semibold text-emerald-700 whitespace-nowrap">
                      SRL Profit
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  <TaxRow
                    label="CAS (pensie 25%)"
                    values={[
                      "25% din brut",
                      "25% daca net > prag",
                      "25% din norma",
                      "-",
                      "-",
                    ]}
                  />
                  <TaxRow
                    label="CASS (sanatate 10%)"
                    values={[
                      "10% din brut",
                      "10% pe praguri",
                      "10% din norma",
                      "10% pe dividende",
                      "10% pe dividende",
                    ]}
                  />
                  <TaxRow
                    label="Impozit pe venit"
                    values={[
                      "10% din baza",
                      "10% din net",
                      "10% din norma",
                      "1% sau 3% din CA",
                      "16% din profit",
                    ]}
                  />
                  <TaxRow
                    label="Impozit dividende"
                    values={["-", "-", "-", "8%", "8%"]}
                  />
                  <TaxRow
                    label="Cost angajat"
                    values={["-", "-", "-", "Salariu minim + CAM", "-"]}
                  />
                  <TaxRow
                    label="Cheltuieli deductibile"
                    values={["-", "Da", "-", "-", "Da"]}
                    highlight
                  />
                  <TaxRow
                    label="Contabilitate"
                    values={[
                      "Nu",
                      "Simpla",
                      "Simpla",
                      "Dubla",
                      "Dubla",
                    ]}
                  />
                  <TaxRow
                    label="Declaratii ANAF"
                    values={[
                      "Angajatorul",
                      "Anual (D212)",
                      "Anual (D212)",
                      "Trimestrial",
                      "Trimestrial",
                    ]}
                  />
                </tbody>
              </table>
            </div>
          </div>

          {/* Glossary */}
          <div className="rounded-xl bg-white border border-blue-100 p-4">
            <h3 className="text-sm font-bold text-zinc-900 mb-2">
              Glosar de termeni
            </h3>
            <dl className="grid gap-2 sm:grid-cols-2 text-xs">
              <div>
                <dt className="font-semibold text-zinc-700">CAS</dt>
                <dd className="text-zinc-500">
                  Contribuția de Asigurări Sociale  - plătești la pensie (25%)
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-zinc-700">CASS</dt>
                <dd className="text-zinc-500">
                  Contribuția de Asigurări Sociale de Sănătate  - plătești la
                  sănătate (10%)
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-zinc-700">Impozit pe venit</dt>
                <dd className="text-zinc-500">
                  Taxă pe banii pe care îi câștigi (10% în cele mai multe cazuri)
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-zinc-700">Dividende</dt>
                <dd className="text-zinc-500">
                  Banii pe care ți-i iei din firma ta (SRL)  - taxați cu 8%
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-zinc-700">Normă de venit</dt>
                <dd className="text-zinc-500">
                  Sumă fixă stabilită de stat pentru fiecare activitate  - plătești
                  taxe pe ea, indiferent cât câștigi real
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-zinc-700">Micro-întreprindere</dt>
                <dd className="text-zinc-500">
                  SRL cu venituri sub 500.000 EUR/an  - plătești 1% sau 3% pe
                  cifra de afaceri, nu pe profit
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-zinc-700">
                  Cheltuieli deductibile
                </dt>
                <dd className="text-zinc-500">
                  Costuri ale afacerii (chirie, echipamente, transport) care
                  reduc baza de impozitare
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-zinc-700">ANAF</dt>
                <dd className="text-zinc-500">
                  Agenția Națională de Administrare Fiscală  - instituția unde
                  depui declarații și plătești taxe
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}

function TaxRow({
  label,
  values,
  highlight,
}: {
  readonly label: string;
  readonly values: readonly string[];
  readonly highlight?: boolean;
}) {
  return (
    <tr className={highlight ? "bg-emerald-50/40" : "hover:bg-zinc-50/50"}>
      <td className="px-4 py-2.5 font-medium text-zinc-700 whitespace-nowrap">
        {label}
      </td>
      {values.map((v, i) => (
        <td
          key={i}
          className={cn(
            "px-3 py-2.5 text-center whitespace-nowrap",
            v === "-" ? "text-zinc-300" : "text-zinc-600",
            v === "Da" && "text-emerald-600 font-medium",
            v === "Nu" && "text-zinc-500"
          )}
        >
          {v}
        </td>
      ))}
    </tr>
  );
}
