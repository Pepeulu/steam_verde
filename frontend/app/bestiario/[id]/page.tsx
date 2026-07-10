"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api, imagemUrl } from "@/lib/api";
import type { Monstro } from "@/lib/types";

const CONDICOES = [
  "Amedrontado", "Atordoado", "Confuso", "Convalescente", "Descansado",
  "Dissonante", "Envenenado", "Escondido", "Expandido", "Exposto",
  "Fadigado", "Ferido", "Preso", "Queimado", "Revigorado",
];

export default function BestiarioDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [monstro, setMonstro] = useState<Monstro | null>(null);
  const [ativas, setAtivas] = useState<Set<string>>(new Set());

  useEffect(() => {
    api.get<Monstro>(`/bestiario/${params.id}`).then(setMonstro);
  }, [params.id]);

  function toggle(nome: string) {
    setAtivas((prev) => {
      const novo = new Set(prev);
      novo.has(nome) ? novo.delete(nome) : novo.add(nome);
      return novo;
    });
  }

  async function apagar() {
    if (!monstro) return;
    if (!confirm("Apagar esta besta do bestiário permanentemente?")) return;
    await api.del(`/bestiario/${monstro.id}`);
    router.push("/bestiario");
  }

  if (!monstro) return <p className="text-center text-bonedim py-24">Rastreando a besta...</p>;

  const durPct = Math.round((monstro.resistencia_atual / monstro.resistencia_base) * 100);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 flex flex-col gap-10">
      <section className="panel p-6 flex flex-col md:flex-row gap-6">
        <img
          src={imagemUrl(monstro.imagem_url)}
          alt={monstro.nome}
          className="w-full md:w-64 h-64 object-cover rounded-sm border border-gold/30"
        />
        <div className="flex-1 flex flex-col gap-3">
          <span className="eyebrow">{monstro.categoria}</span>
          <h1 className="font-display text-4xl text-bone">{monstro.nome}</h1>
          <p className="text-sm text-bonedim leading-relaxed">{monstro.descricao}</p>

          <div className="max-w-sm mt-2">
            <div className="flex justify-between text-xs uppercase tracking-widest text-bloodmoon mb-1">
              <span>Resistência</span>
              <span>{monstro.resistencia_atual}/{monstro.resistencia_base}</span>
            </div>
            <div className="stat-bar-track h-6">
              <div className="stat-bar-fill bg-bloodmoon" style={{ width: `${durPct}%` }} />
            </div>
          </div>

          <div className="flex gap-3 mt-2">
            <Link href={`/bestiario/${monstro.id}/edit`} className="btn-ghost !py-2 !text-xs">
              Editar
            </Link>
            <button onClick={apagar} className="btn-danger">
              Apagar
            </button>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl text-gold mb-4 uppercase tracking-widest">Condições</h2>
        <div className="flex flex-wrap gap-2">
          {CONDICOES.map((c) => (
            <button
              key={c}
              onClick={() => toggle(c)}
              className={`chip ${ativas.has(c) ? "chip-active" : ""}`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="panel p-5">
          <p className="font-display text-sm uppercase tracking-widest text-gold mb-2">Alvos</p>
          <p className="text-sm text-bonedim leading-relaxed whitespace-pre-line">{monstro.alvos}</p>
        </div>
        <div className="panel p-5">
          <p className="font-display text-sm uppercase tracking-widest text-gold mb-2">Ações</p>
          <p className="text-sm text-bonedim leading-relaxed whitespace-pre-line">{monstro.acoes}</p>
        </div>
      </section>
    </div>
  );
}
