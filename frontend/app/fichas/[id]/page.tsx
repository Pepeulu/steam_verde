"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api, imagemUrl } from "@/lib/api";
import type { Feral } from "@/lib/types";

const ESTILOS: (keyof Feral["estilo"])[] = ["ligeiro", "poderoso", "preciso", "sagaz"];
const HABILIDADES: (keyof Feral["habilidade"])[] = [
  "agarrar", "atravessar", "estudar", "armazenar", "chamar", "exibir",
  "assegurar", "golpear", "atirar", "curar", "manufaturar", "procurar",
];

export default function FichaDetailPage() {
  const params = useParams();
  const [feral, setFeral] = useState<Feral | null>(null);

  useEffect(() => {
    api.get<Feral>(`/feral/detail/${params.id}`).then(setFeral);
  }, [params.id]);

  if (!feral) {
    return <p className="text-center text-bonedim py-24">Abrindo o diário de caça...</p>;
  }

  const vigorPct = Math.round((feral.vigor_atual / feral.vigor_maximo) * 100);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col gap-10">
      <section className="panel p-6 flex flex-col md:flex-row gap-6">
        <img
          src={imagemUrl(feral.imagem_url)}
          alt={feral.nome}
          className="w-full md:w-56 h-56 object-cover rounded-sm border border-gold/30"
        />
        <div className="flex-1 flex flex-col gap-3">
          <span className="eyebrow">{feral.titulo}</span>
          <h1 className="font-display text-4xl text-bone">{feral.nome}</h1>
          <p className="text-sm text-bonedim uppercase tracking-widest">
            Caçador: {feral.player} · Especialidade: {feral.especialidade}
          </p>
          <div className="max-w-sm mt-2">
            <div className="flex justify-between text-xs uppercase tracking-widest text-sage mb-1">
              <span>Vigor</span>
              <span>{feral.vigor_atual}/{feral.vigor_maximo}</span>
            </div>
            <div className="stat-bar-track h-6">
              <div className="stat-bar-fill bg-sage" style={{ width: `${vigorPct}%` }} />
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl text-gold mb-4 uppercase tracking-widest">Estilo</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {ESTILOS.map((k) => (
            <div key={k} className="panel p-4 text-center">
              <p className="text-xs uppercase tracking-widest text-gold/80">{k}</p>
              <p className="font-mono text-3xl text-bone mt-1">{feral.estilo[k]}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl text-gold mb-4 uppercase tracking-widest">Habilidades</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {HABILIDADES.map((k) => (
            <div key={k} className="panel px-4 py-3 flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-bone/90">{k}</span>
              <span className="font-mono text-ember">{feral.habilidade[k]}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl text-gold mb-4 uppercase tracking-widest">
          Utensílios & Técnicas
        </h2>
        <div className="flex flex-col gap-4">
          {feral.utensilios.map((u) => {
            const durPct = Math.round((u.durabilidade_atual / u.durabilidade_maxima) * 100);
            return (
              <div key={u.id ?? u.nome} className="panel p-5">
                <div className="flex justify-between items-baseline flex-wrap gap-2">
                  <p className="font-display text-lg text-bone">{u.nome}</p>
                  <span className="text-xs text-bonedim uppercase tracking-widest">
                    Alcance: {u.alcance}
                  </span>
                </div>
                {u.ataques && <p className="text-sm text-bonedim mt-2 leading-relaxed">{u.ataques}</p>}
                <div className="mt-3 max-w-xs">
                  <div className="flex justify-between text-[10px] uppercase tracking-widest text-bloodmoon mb-0.5">
                    <span>Durabilidade</span>
                    <span>{u.durabilidade_atual}/{u.durabilidade_maxima}</span>
                  </div>
                  <div className="stat-bar-track">
                    <div className="stat-bar-fill bg-bloodmoon" style={{ width: `${durPct}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl text-gold mb-4 uppercase tracking-widest">Traços</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {feral.tracos.map((t) => (
            <div key={t.id ?? t.nome} className="panel p-4">
              <p className="font-display text-bone">{t.nome}</p>
              <p className="text-xs text-gold/80 uppercase tracking-widest mt-0.5">Custo: {t.custo}</p>
              <p className="text-sm text-bonedim mt-2 leading-relaxed">{t.descricao}</p>
              <div className="flex gap-2 mt-3">
                <span className="chip chip-active !cursor-default">{t.habilidade_relacionada}</span>
                <span className="chip chip-active !cursor-default">{t.estilo_relacionado}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { titulo: "Criação", texto: feral.criacao },
          { titulo: "Iniciação", texto: feral.iniciacao },
          { titulo: "Ambição", texto: feral.ambicao },
          { titulo: "Conexão", texto: feral.conexao },
        ].map((b) => (
          <div key={b.titulo} className="panel p-5">
            <p className="font-display text-sm uppercase tracking-widest text-gold mb-2">{b.titulo}</p>
            <p className="text-sm text-bonedim leading-relaxed">{b.texto}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
