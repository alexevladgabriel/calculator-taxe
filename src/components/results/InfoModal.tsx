"use client";

import { useEffect, useRef } from "react";
import type { StructureType } from "@/lib/tax-engine";
import { structureDescriptions } from "@/lib/tax-engine/descriptions";
import { X } from "lucide-react";

interface InfoModalProps {
  readonly structureType: StructureType | null;
  readonly onClose: () => void;
}

export function InfoModal({ structureType, onClose }: InfoModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (structureType) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [structureType]);

  if (!structureType) return null;

  const desc = structureDescriptions[structureType];

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
      className="backdrop:bg-black/40 backdrop:backdrop-blur-sm bg-transparent p-4 max-w-lg w-full mx-auto my-auto rounded-2xl outline-none open:animate-in open:fade-in open:zoom-in-95"
    >
      <div className="bg-white rounded-2xl shadow-xl border border-zinc-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-6 pt-5 pb-4 border-b border-zinc-100">
          <div>
            <h2 className="text-lg font-bold text-zinc-900">
              {structureType === "angajat" && "Angajat"}
              {structureType === "pfa-real" && "PFA (Sistem Real)"}
              {structureType === "pfa-norma" && "PFA (Norma de Venit)"}
              {structureType === "srl-micro" && "SRL Micro-intreprindere"}
              {structureType === "srl-standard" && "SRL (Impozit pe Profit)"}
            </h2>
            <p className="text-sm text-zinc-500 mt-0.5">{desc.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-1.5 text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 transition-colors -mt-0.5"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          <p className="text-sm leading-relaxed text-zinc-700">
            {desc.explanation}
          </p>

          <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3">
            <span className="text-xs font-semibold text-emerald-800">
              Ideal pentru:
            </span>
            <p className="text-sm text-emerald-700 mt-0.5">{desc.bestFor}</p>
          </div>

          <div>
            <span className="text-xs font-semibold text-zinc-700 uppercase tracking-wide">
              Taxe principale
            </span>
            <ul className="mt-2 space-y-2">
              {desc.keyTaxes.map((tax, i) => (
                <li
                  key={i}
                  className="flex gap-2.5 text-sm text-zinc-600"
                >
                  <span className="text-zinc-300 shrink-0 mt-0.5">&#x2022;</span>
                  <span>{tax}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </dialog>
  );
}
