import type { Metadata } from "next";
import { CalculatorSection } from "@/components/calculator/CalculatorSection";
import { StructureGuide } from "@/components/results/StructureGuide";
import { EmployeeGuide } from "@/components/results/EmployeeGuide";
import { MealTicketsGuide } from "@/components/results/MealTicketsGuide";
import { DeductiblesGuide } from "@/components/results/DeductiblesGuide";
import { PfaGuide } from "@/components/results/PfaGuide";
import { TaxTypesGuide } from "@/components/results/TaxTypesGuide";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://taxelemele.ro",
  },
  other: {
    "google-site-verification": "",
  },
};

/** JSON-LD structured data for search engines */
function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Calculator Taxe Romania",
    description:
      "Compara taxele pentru Angajat, PFA (Sistem Real, Norma de Venit) si SRL (Micro, Impozit Profit). Calculator gratuit cu date verificate din Codul Fiscal.",
    url: "https://taxelemele.ro",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "RON",
    },
    inLanguage: "ro",
    countryOfOrigin: {
      "@type": "Country",
      name: "Romania",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** FAQ structured data - boosts rich snippets */
function FaqJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Ce taxe plateste un angajat in Romania?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Un angajat plateste CAS 25% (pensie), CASS 10% (sanatate) si impozit pe venit 10%. Din salariul minim brut de 4.050 lei, angajatul primeste net aproximativ 2.469 lei.",
        },
      },
      {
        "@type": "Question",
        name: "Care este diferenta intre PFA sistem real si PFA norma de venit?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "La PFA sistem real, taxele se calculeaza pe venitul net (incasari minus cheltuieli). La PFA norma de venit, taxele se calculeaza pe o suma fixa (norma) stabilita de ANAF per activitate, indiferent cat castigi real.",
        },
      },
      {
        "@type": "Question",
        name: "Cat platesti impozit la SRL micro-intreprindere?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "SRL micro-intreprindere plateste 1% din cifra de afaceri (daca are cel putin un angajat) sau 3% (fara angajat). Limita de venituri este 300.000 EUR/an. Dividendele sunt taxate separat (8-10% in functie de an).",
        },
      },
      {
        "@type": "Question",
        name: "Ce sunt tichetele de masa si cum afecteaza salariul net?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Tichetele de masa sunt un beneficiu extra de la angajator (max ~40 lei/tichet). Valoarea lor se adauga la baza de calcul CASS si impozit, dar NU la CAS. Per total sunt avantajoase - primesti ~420 lei extra pentru doar ~42 lei taxe suplimentare.",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <JsonLd />
      <FaqJsonLd />

      {/* Calculator - client component island */}
      <CalculatorSection />

      {/* Educational guides - server-rendered, crawlable by search engines */}
      <section className="mt-16 space-y-3">
        <h2 className="text-xl font-bold text-zinc-900 mb-4">
          Ghid fiscal pentru incepatori
        </h2>
        <StructureGuide />
        <TaxTypesGuide />
        <PfaGuide />
        <DeductiblesGuide />
        <EmployeeGuide />
        <MealTicketsGuide />
      </section>
    </div>
  );
}
