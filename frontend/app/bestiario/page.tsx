"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, imagemUrl } from "@/lib/api";
import type { Monstro } from "@/lib/types";

const CATEGORIA_COR: Record<string, string> = {
  Apex: "text-bloodmoon border-bloodmoon/50",
  Adulto: "text-ember border-ember/50",
  Jovem: "text-sage border-sage/50",
};

export default function BestiarioPage() {
  const [monstros, setMonstros] = useState<Monstro[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    api.get<Monstro[]>("/bestiario/").then(setMonstros).finally(() => setCarregando(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col gap-8">
      <div>
        <span className="eyebrow">Registro da Guilda</span>
        <h1 className="font-display text-4xl text-bone mt-2">Bestiário</h1>
        <p className="text-bonedim mt-2 max-w-lg">
          Todas as informações sobre as bestas do mundo Wilderfeast.
        </p>
      </div>

      {carregando ? (
        <p className="text-bonedim">Folheando o bestiário...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {monstros.map((m) => (
            <div key={m.id} className="panel overflow-hidden flex flex-col">
              <div className="relative">
                <img src={imagemUrl(m.imagem_url)} alt={m.nome} className="w-full h-56 object-cover" />
                <span
                  className={`absolute top-3 right-3 chip !cursor-default bg-void/80 ${
                    CATEGORIA_COR[m.categoria] ?? "text-bone border-bonedim/40"
                  }`}
                >
                  {m.categoria}
                </span>
              </div>
              <div className="p-4 flex flex-col gap-2 flex-1">
                <p className="font-display text-lg text-bone">{m.nome}</p>
                <p className="text-sm text-bonedim line-clamp-3 flex-1">{m.descricao}</p>
                <div className="text-xs text-bonedim/70 uppercase tracking-widest">
                  Resistência {m.resistencia_atual}/{m.resistencia_base}
                </div>
                <Link href={`/bestiario/${m.id}`} className="btn-ghost !py-2 !text-xs mt-1 w-fit">
                  Acessar ficha completa
                </Link>
              </div>
            </div>
          ))}
          <Link
            href="/bestiario/create"
            className="panel flex items-center justify-center min-h-[280px] text-gold font-display uppercase tracking-widest hover:bg-gold/10 transition-colors"
          >
            + Adicionar nova besta
          </Link>
        </div>
      )}
    </div>
  );
}
