"use client";

import { useCalculator } from "@/hooks/useCalculator";
import { CalculatorForm } from "./CalculatorForm";
import { ComparisonView } from "../results/ComparisonView";

export function CalculatorSection() {
  const { state, comparison, updateField, updateStatus } = useCalculator();

  return (
    <>
      {/* Hero */}
      <section className="mb-10 sm:mb-14">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-500 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Actualizat pentru {state.year}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900">
            Calculator Taxe:{" "}
            <span className="text-zinc-500">Angajat</span>
            {" vs "}
            <span className="text-amber-500">PFA</span>
            {" vs "}
            <span className="text-emerald-600">SRL</span>
            <br />
            in {state.year}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-zinc-500 max-w-xl leading-relaxed">
            Afla exact ce taxe datorezi si compara venitul net pentru toate
            formele de organizare, conform Codului Fiscal.
          </p>
        </div>
      </section>

      {/* Calculator Layout */}
      <div className="grid gap-10 lg:grid-cols-[380px_1fr] xl:grid-cols-[420px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <CalculatorForm
              state={state}
              updateField={updateField}
              updateStatus={updateStatus}
            />
          </div>
        </aside>

        <section aria-live="polite">
          <ComparisonView
            comparison={comparison}
            displayMode={state.displayMode}
            onDisplayModeChange={(mode) => updateField("displayMode", mode)}
          />
        </section>
      </div>
    </>
  );
}
