import type { StructureType } from "./types";

export interface StructureDescription {
  /** Short label for card subtitle (1 line) */
  readonly subtitle: string;
  /** Beginner-friendly explanation (2-3 sentences) */
  readonly explanation: string;
  /** Who is it for? */
  readonly bestFor: string;
  /** Key taxes involved */
  readonly keyTaxes: readonly string[];
}

export const structureDescriptions: Record<StructureType, StructureDescription> =
  {
    angajat: {
      subtitle: "Contract individual de muncă",
      explanation:
        "Ești angajat cu contract de muncă la o firmă. Angajatorul îți reține automat taxele din salariu (CAS, CASS, impozit pe venit) și îți virează doar salariul net. Nu trebuie să depui declarații fiscale  - totul e gestionat de angajator.",
      bestFor: "Persoane care preferă stabilitate, fără bătăi de cap cu contabilitatea",
      keyTaxes: [
        "CAS 25%  - contribuție la pensie",
        "CASS 10%  - asigurare de sănătate",
        "Impozit pe venit 10%  - din baza impozabilă (după deduceri)",
      ],
    },
    "pfa-real": {
      subtitle: "Persoană Fizică Autorizată  - venit real",
      explanation:
        "PFA (Persoană Fizică Autorizată) e o formă simplă prin care lucrezi pe cont propriu, fără a înființa o firmă. La «Sistem Real» plătești taxe pe venitul efectiv obținut, minus cheltuielile deductibile. Ții evidență contabilă și depui declarații la ANAF.",
      bestFor: "Freelanceri cu cheltuieli semnificative pe care le pot deduce",
      keyTaxes: [
        "Impozit pe venit 10%  - din venitul net (venit – cheltuieli)",
        "CAS 25%  - dacă venitul net anual depășește pragul minim",
        "CASS 10%  - în funcție de pragurile de venit (6/12/24 × salariu minim)",
      ],
    },
    "pfa-norma": {
      subtitle: "Persoană Fizică Autorizată  - normă de venit",
      explanation:
        "Tot PFA, dar cu «Normă de Venit»  - taxele se calculează pe un venit fix (norma), stabilit de autorități pentru fiecare tip de activitate, NU pe cât câștigi tu real. Dacă facturezi mai mult decât norma, plătești aceleași taxe. Ideal dacă venitul real e mult peste normă.",
      bestFor:
        "Freelanceri IT, medici, avocați  - oricine câștigă semnificativ peste norma stabilită",
      keyTaxes: [
        "Impozit pe venit 10%  - din norma de venit (sumă fixă pe activitate)",
        "CAS 25%  - calculat pe baza normei, nu a venitului real",
        "CASS 10%  - calculat pe baza normei",
      ],
    },
    "srl-micro": {
      subtitle: "Societate cu Răspundere Limitată  - micro-întreprindere",
      explanation:
        "SRL (Societate cu Răspundere Limitată) e o firmă propriu-zisă, cu personalitate juridică separată de tine. Ca «micro-întreprindere» plătești un impozit mic pe cifra de afaceri (1% cu angajat, 3% fără). Banii din firmă ajung la tine prin dividende (taxate separat). Necesită contabilitate și un angajat pentru rata de 1%.",
      bestFor:
        "Venituri medii-mari, persoane care vor protecție juridică și taxare redusă",
      keyTaxes: [
        "Impozit pe cifra de afaceri 1% (cu angajat) sau 3% (fără)",
        "Impozit pe dividende 5-10% (variaza pe an)  - cand extragi banii din firma",
        "CASS 10% pe dividende  - daca depasesti pragul anual",
        "Cost angajat  - salariu minim + contributii angajator",
      ],
    },
    "srl-standard": {
      subtitle: "Societate cu Răspundere Limitată  - impozit pe profit",
      explanation:
        "SRL cu regim standard  - platesti 16% impozit pe profit (venituri minus cheltuieli), nu pe cifra de afaceri. Banii ramasi devin dividende, taxate separat. E mai avantajos daca ai cheltuieli mari deductibile. Obligatoriu daca depasesti plafonul de micro-intreprindere (500.000 EUR).",
      bestFor:
        "Firme cu cheltuieli mari deductibile sau venituri peste plafonul micro",
      keyTaxes: [
        "Impozit pe profit 16%  - din profit (venit - cheltuieli)",
        "Impozit pe dividende 5-10% (variaza pe an)  - cand extragi banii",
        "CASS 10% pe dividende  - daca depasesti pragul anual",
      ],
    },
  };
