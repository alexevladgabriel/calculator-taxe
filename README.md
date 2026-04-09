# Taxele Mele - Calculator Taxe Romania

**[taxelemele.ro](https://taxelemele.ro)**

Calculator fiscal care compara cele 5 structuri de lucru din Romania: **Angajat**, **PFA Sistem Real**, **PFA Norma de Venit**, **SRL Micro-intreprindere** si **SRL Impozit pe Profit**.

Introdu venitul brut lunar si vezi instant cat ramai "bani in mana" pentru fiecare varianta.

## Features

- **5 structuri fiscale** comparate side-by-side cu breakdown detaliat
- **5 ani fiscali** (2022-2026) cu rate si praguri verificate
- **Tichete de masa** - calcul validat contra fluturase reale (CASS + impozit pe baza extinsa)
- **Status personal** - student, handicap (scutire impozit), pensionar (scutire CAS), angajat in alta parte
- **Ghiduri educationale** - PFA real vs norma, cheltuieli deductibile, tichete de masa, obligatii angajator
- **SEO optimizat** - ghiduri server-rendered, JSON-LD structured data, FAQ rich snippets
- **Cloudflare Edge** - deploy via OpenNext.js pe Cloudflare Workers

## Tech Stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript** strict
- **Tailwind CSS 4**
- **OpenNext.js** + **Cloudflare Workers**
- Zero backend - toate calculele sunt client-side

## Getting Started

```bash
# Clone
git clone git@github.com:alexevladgabriel/calculator-taxe.git
cd calculator-taxe

# Install
bun install

# Dev
bun dev          # http://localhost:3000

# Preview pe Cloudflare local
bun preview      # http://localhost:8789

# Deploy pe Cloudflare Workers
bun deploy
```

## Structura proiectului

```
src/
├── app/
│   ├── page.tsx              # Pagina principala (server component)
│   ├── layout.tsx            # Layout, metadata, SEO
│   └── sitemap.ts            # Sitemap auto-generat
├── components/
│   ├── calculator/
│   │   ├── CalculatorSection.tsx  # Client island - form + results
│   │   ├── CalculatorForm.tsx     # Inputuri: venit, cheltuieli, tichete, status
│   │   ├── YearSelector.tsx       # Selector an fiscal (2022-2026)
│   │   └── ActivitySelect.tsx     # Dropdown CAEN cu search
│   ├── results/
│   │   ├── ComparisonView.tsx     # Carduri / tabel + toggle lunar/anual
│   │   ├── ResultCard.tsx         # Card per structura cu breakdown
│   │   ├── ResultTable.tsx        # Tabel comparativ
│   │   ├── InfoModal.tsx          # Modal explicatie per structura
│   │   ├── StructureGuide.tsx     # Ghid: ce inseamna PFA, SRL, Angajat
│   │   ├── TaxTypesGuide.tsx      # Ghid: micro vs profit
│   │   ├── PfaGuide.tsx           # Ghid: PFA real vs norma
│   │   ├── DeductiblesGuide.tsx   # Ghid: cheltuieli deductibile
│   │   ├── EmployeeGuide.tsx      # Ghid: obligatii angajator
│   │   └── MealTicketsGuide.tsx   # Ghid: tichete de masa
│   └── layout/
│       ├── Header.tsx
│       └── Footer.tsx
├── lib/
│   ├── tax-engine/
│   │   ├── types.ts              # Tipuri: CalculatorInputs, TaxResult, YearConfig
│   │   ├── registry.ts           # Registru ani fiscali
│   │   ├── compare.ts            # Orchestrator - ruleaza 5 calculatoare, alege winner
│   │   ├── shared.ts             # Helpers: CAS, CASS, deducere personala
│   │   ├── descriptions.ts       # Descrieri per structura (beginner-friendly)
│   │   ├── colors.ts             # Culori per structura
│   │   ├── configs/
│   │   │   ├── 2022.ts           # Dividende 5%, micro 1%, min wage 2,550
│   │   │   ├── 2023.ts           # Dividende 8%, micro 3%/1%, min wage 3,000
│   │   │   ├── 2024.ts           # Prag micro 300k EUR, min wage 3,300
│   │   │   ├── 2025.ts           # Min wage 3,700
│   │   │   └── 2026.ts           # Dividende 10%, norma IT 40k, min wage 4,050
│   │   └── calculators/
│   │       ├── angajat.ts        # CAS + CASS + impozit + tichete masa
│   │       ├── pfa-real.ts       # 10% din venit net
│   │       ├── pfa-norma.ts      # 10% din norma fixa
│   │       ├── srl-micro.ts      # 1%/3% cifra afaceri + dividende
│   │       └── srl-standard.ts   # 16% profit + dividende
│   ├── format.ts                 # Formatare RON, procente
│   └── utils.ts                  # cn() helper
└── hooks/
    └── useCalculator.ts          # State management form -> engine -> results
```

## Ghid pentru contabili / verificare rate

Fiecare an fiscal are un fisier dedicat in `src/lib/tax-engine/configs/`. Structura este identica pentru toti anii, ceea ce face verificarea simpla.

### Unde gasesti ratele

| Parametru | Camp in config | Exemplu 2026 |
|-----------|---------------|--------------|
| Salariu minim brut | `minimumGrossWage` | 4,050 |
| CAS angajat | `casRate` | 0.25 (25%) |
| CASS angajat | `cassRate` | 0.10 (10%) |
| Impozit venit | `incomeTaxRate` | 0.10 (10%) |
| Deducere personala | `personalDeductionTable` | array de praguri |
| PFA CAS prag | `pfaCasThresholdMonths` | 12 (12 x salariu minim) |
| PFA CASS praguri | `pfaCassThresholds` | 6x, 12x, 24x salariu minim |
| SRL Micro cu angajat | `microTaxRateWithEmployee` | 0.01 (1%) |
| SRL Micro fara angajat | `microTaxRateWithoutEmployee` | 0.03 (3%) |
| Prag micro EUR | `microRevenueLimitEUR` | 300,000 |
| Impozit profit | `corporateTaxRate` | 0.16 (16%) |
| Impozit dividende | `dividendTaxRate` | 0.10 (10%) |
| CASS dividende prag | `dividendCassThresholdMonths` | 6 (6 x salariu minim) |
| CAM angajator | `employerContributionRate` | 84 / 4050 |
| Norma de venit | `normaActivities` | per cod CAEN |

### Cum adaugi un an nou (ex: 2027)

1. Copiaza `src/lib/tax-engine/configs/2026.ts` in `2027.ts`
2. Actualizeaza valorile conform Codului Fiscal / ANAF
3. Inregistreaza in `src/lib/tax-engine/registry.ts`:
   ```ts
   import { config2027 } from "./configs/2027";
   // adauga in Map:
   [2027, config2027],
   ```
4. Gata - anul apare automat in selector

### Cum verifici un calcul

Exemplu validat contra fluturas real (Martie 2025, brut 10.392 lei, 21 tichete x 20 lei):

| Linie | Calculator | Fluturas real | Match |
|-------|-----------|---------------|-------|
| CAS 25% | 2.598 | 2.598 | Da |
| CASS 10% (brut + tichete) | 1.081 | 1.081 | Da |
| Baza impozabila | 7.133 | 7.133 | Da |
| Impozit 10% | 713 | 713 | Da |
| Net | 6.000 | 6.000 | Da |

### Surse oficiale

- **Codul Fiscal** (Legea 227/2015) - `legislatie.just.ro`
- **ANAF** - `anaf.ro` (calculator salarii, norme de venit)
- **Monitorul Oficial** - HG salariu minim brut per an
- Art. 77 - Deducere personala
- Art. 137, 170 - CAS, CASS angajat
- Art. 148, 174 - PFA CAS/CASS praguri
- Art. 47-55 (Title III) - Regim micro-intreprindere
- Art. 43 - Impozit dividende
- Art. 220^5 - CAM angajator
- Art. 60 - Scutiri impozit (handicap grav/accentuat)

### Evolutia ratelor pe ani

| An | Salariu minim | Dividende | Micro prag | Norma IT |
|----|--------------|-----------|------------|----------|
| 2022 | 2.550 lei | 5% | 500k EUR | 37.000 |
| 2023 | 3.000 lei | 8% | 500k EUR | 38.000 |
| 2024 | 3.300 lei | 8% | 300k EUR | 40.000 |
| 2025 | 3.700 lei | 8% | 300k EUR | 40.000 |
| 2026 | 4.050 lei | 10% | 300k EUR | 40.000 |

## Deploy

Aplicatia ruleaza pe **Cloudflare Workers** via **OpenNext.js**.

```bash
# Build + deploy
bun deploy

# Preview local (Cloudflare runtime)
bun preview
```

Configureaza DNS-ul `taxelemele.ro` sa pointeze la Cloudflare.

## Disclaimer

Acest calculator are scop informativ si nu constituie consiliere fiscala sau juridica. Ratele de impozitare si pragurile se pot modifica. Consultati un contabil autorizat pentru decizii financiare importante.

## License

MIT
