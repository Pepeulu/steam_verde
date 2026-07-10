"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, imagemUrl } from "@/lib/api";
import type { Feral } from "@/lib/types";
import { useAuth } from "@/components/AuthProvider";

export default function FichasPage() {
  const { user } = useAuth();
  const [ferais, setFerais] = useState<Feral[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    api
      .get<Feral[]>("/feral/fichas")
      .then(setFerais)
      .finally(() => setCarregando(false));
  }, []);

  async function apagar(id: number) {
    if (!confirm("Tem certeza que deseja apagar esta ficha? Esta ação é permanente.")) return;
    await api.del(`/feral/delete/${id}`);
    setFerais((prev) => prev.filter((f) => f.id !== id));
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col gap-8">
      <div>
        <span className="eyebrow">Diário de caça</span>
        <h1 className="font-display text-4xl text-bone mt-2">Fichas</h1>
      </div>

      {carregando ? (
        <p className="text-bonedim">Consultando o diário...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ferais.map((feral) => {
            const vigorPct = Math.round((feral.vigor_atual / feral.vigor_maximo) * 100);
            const utensilio = feral.utensilios[0];
            const durPct = utensilio
              ? Math.round((utensilio.durabilidade_atual / utensilio.durabilidade_maxima) * 100)
              : 0;
            const dono = user && user.nome === feral.player;

            return (
              <div key={feral.id} className="panel p-5 flex flex-col gap-4">
                <div className="flex gap-4">
                  <img
                    src={imagemUrl(feral.imagem_url)}
                    alt={feral.nome}
                    className="w-32 h-32 object-cover rounded-sm border border-gold/30"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <p className="font-display text-xl text-bone">{feral.nome}</p>
                      <p className="text-xs text-bonedim uppercase tracking-widest">{feral.player}</p>
                    </div>
                    <div className="flex gap-3 mt-2">
                      {(["poderoso", "preciso", "ligeiro", "sagaz"] as const).map((k) => (
                        <div key={k} className="text-center">
                          <p className="text-[10px] uppercase tracking-widest text-gold/80">
                            {k.slice(0, 3)}
                          </p>
                          <p className="font-mono text-sm text-bone">{feral.estilo[k]}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div>
                    <div className="flex justify-between text-[10px] uppercase tracking-widest text-sage mb-0.5">
                      <span>Vigor</span>
                      <span>{feral.vigor_atual}/{feral.vigor_maximo}</span>
                    </div>
                    <div className="stat-bar-track">
                      <div className="stat-bar-fill bg-sage" style={{ width: `${vigorPct}%` }} />
                    </div>
                  </div>
                  {utensilio && (
                    <div>
                      <div className="flex justify-between text-[10px] uppercase tracking-widest text-bloodmoon mb-0.5">
                        <span>Durabilidade — {utensilio.nome}</span>
                        <span>
                          {utensilio.durabilidade_atual}/{utensilio.durabilidade_maxima}
                        </span>
                      </div>
                      <div className="stat-bar-track">
                        <div className="stat-bar-fill bg-bloodmoon" style={{ width: `${durPct}%` }} />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 mt-1">
                  <Link href={`/fichas/${feral.id}`} className="btn-ghost !py-2 !text-xs">
                    Ficha completa
                  </Link>
                  {dono && (
                    <>
                      <Link href={`/fichas/${feral.id}/edit`} className="btn-ghost !py-2 !text-xs">
                        Editar
                      </Link>
                      <button onClick={() => apagar(feral.id)} className="btn-danger">
                        Apagar
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}

          <Link
            href="/fichas/create"
            className="panel flex items-center justify-center min-h-[200px] text-gold font-display uppercase tracking-widest hover:bg-gold/10 transition-colors"
          >
            + Criar Personagem
          </Link>
        </div>
      )}
    </div>
  );
}
