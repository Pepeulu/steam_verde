"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { api, imagemUrl } from "@/lib/api";
import type { Feral, Monstro } from "@/lib/types";
import { useAuth } from "@/components/AuthProvider";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [ferais, setFerais] = useState<Feral[]>([]);
  const [monstros, setMonstros] = useState<Monstro[]>([]);
  const [totalJogadores, setTotalJogadores] = useState<number>(0);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<Feral[]>("/feral/fichas").catch(() => []),
      api.get<Monstro[]>("/bestiario/").catch(() => []),
      api.get<number>("/auth/usuarios/count").catch((err) => {
        console.error("Erro ao buscar contagem de jogadores:", err);
        return 0; 
      }) 
    ])
      .then(([f, m, count]) => {
        const fichasInvertidas = [...f].reverse();
        setFerais(fichasInvertidas);
        setMonstros(m);
        setTotalJogadores(count); 
      })
      .finally(() => setIsLoadingData(false));
  }, []);

  const fichaRecente = ferais[0]; 
  const monstroAleatorio = monstros.length > 0 ? monstros[0] : null; // Pega o monstro mais recente ou o primeiro da lista para o card

  return (
    <main className="w-full max-w-7xl mx-auto px-8 py-12 flex flex-col gap-10">
      
      {/* CABEÇALHO */}
      <header className="flex flex-col gap-2">
        <span className="text-sm font-bold tracking-widest uppercase text-[#d97736]">
          Bem-vindo, Feral
        </span>
        <h1 className="font-display text-5xl text-bone font-bold">
          {user?.nome || "Arthur"}
        </h1>
        <p className="text-base text-bonedim font-medium">
          Portal da Terra Una — Terra Una, 2326 d.C.
        </p>
      </header>

      {/* LINHA DE ESTATÍSTICAS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Fichas Ativas" value={ferais.length} />
        <StatCard title="Monstros Catalogados" value={monstros.length} />
        <StatCard title="Jogadores" value={totalJogadores} />
      </section>

      {/* CONTEÚDO PRINCIPAL (Grid 2 Colunas perfeitamente simétricas) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        
        {/* COLUNA DA ESQUERDA: Ficha Recente */}
        <div className="panel p-6 flex flex-col gap-6 h-full justify-between">
          <div className="flex justify-between items-center border-b border-[#3a2f28] pb-3 h-10">
            <h3 className="text-sm uppercase tracking-widest text-[#d97736] font-bold">
              Ficha Recente
            </h3>
            {fichaRecente && (
              <Link href={`/fichas/${fichaRecente.id}`} className="btn-ghost !text-sm !py-2 !px-4 font-semibold">
                Ver Ficha →
              </Link>
            )}
          </div>
          
          <div className="flex-1 flex flex-col justify-center mt-4">
            {isLoadingData ? (
              <p className="text-base text-bonedim animate-pulse text-center">Buscando registros...</p>
            ) : fichaRecente ? (
              <div className="relative w-full bg-[#1c1613] p-6 rounded-sm border border-[#3a2f28] flex flex-col justify-between h-full min-h-[400px] shadow-xl">
                
                <div className="relative w-full h-56 flex items-center justify-center overflow-hidden">
                  {fichaRecente.imagem_url ? (
                    <Image 
                      src={imagemUrl(fichaRecente.imagem_url)} 
                      alt={fichaRecente.nome}
                      fill
                      unoptimized
                      className="object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm text-bonedim/50 font-mono border border-dashed border-bonedim/20 bg-black/20">
                      Sem Ilustração Disponível
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-4 mt-auto">
                  <h4 className="font-display text-3xl uppercase tracking-wide text-bone font-bold">
                    {fichaRecente.nome}
                  </h4>
                  
                  <div className="grid grid-cols-1 gap-4 pt-4 border-t border-[#3a2f28]">
                    <StatusBar label="Vigor" atual={fichaRecente.vigor_atual} maximo={fichaRecente.vigor_maximo} cor="bg-[#d97736]" />
                    {fichaRecente.utensilios[0] && (
                      <StatusBar label="Durabilidade" atual={fichaRecente.utensilios[0].durabilidade_atual} maximo={fichaRecente.utensilios[0].durabilidade_maxima} cor="bg-sage" />
                    )}
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[400px] border-dashed border-2 border-bonedim/20 bg-transparent w-full rounded-sm">
                <Link href="/fichas/create" className="btn-hunter !text-base !py-3 !px-6">Criar Novo Feral</Link>
              </div>
            )}
          </div>
        </div>

        {/* COLUNA DA DIREITA: Ameaças em Alta */}
        <div className="panel p-6 flex flex-col gap-6 h-full justify-between">
          <div className="flex justify-between items-center border-b border-[#3a2f28] pb-3 h-10">
            <h3 className="text-sm uppercase tracking-widest text-bloodmoon font-bold">
              Ameaças em Alta
            </h3>
            {monstroAleatorio && (
              <Link href={`/bestiario/${monstroAleatorio.id}`} className="btn-ghost !text-sm !py-2 !px-4 font-semibold">
                Ver Ficha →
              </Link>
            )}
          </div>
          
          <div className="flex-1 flex flex-col justify-center mt-4">
            {isLoadingData ? (
              <p className="text-base text-bonedim animate-pulse text-center">Buscando registros...</p>
            ) : monstroAleatorio ? (
              <div className="relative w-full bg-[#1c1613] p-6 rounded-sm border border-[#3a2f28] flex flex-col justify-between h-full min-h-[400px] shadow-xl">
                
                <div className="absolute top-4 right-4 border border-[#2e473b] bg-[#13221b]/80 px-4 py-1.5 text-xs uppercase tracking-wider text-sage font-bold rounded-sm z-10">
                  {monstroAleatorio.categoria || "JOVEM"}
                </div>

                <div className="relative w-full h-56 flex items-center justify-center overflow-hidden">
                  {monstroAleatorio.imagem_url ? (
                    <Image 
                      src={imagemUrl(monstroAleatorio.imagem_url)} 
                      alt={monstroAleatorio.nome}
                      fill
                      unoptimized
                      className="object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm text-bloodmoon/50 font-mono border border-dashed border-bloodmoon/20 bg-black/20">
                      Sem Ilustração Disponível
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 mt-auto">
                  <h4 className="font-display text-3xl uppercase tracking-wide text-bone font-bold">
                    {monstroAleatorio.nome}
                  </h4>
                  <div className="pt-4 border-t border-[#3a2f28]">
                    <p className="text-sm text-bonedim font-serif leading-relaxed line-clamp-3 max-w-md">
                      {monstroAleatorio.descricao}
                    </p>
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[400px] border-dashed border-2 border-bonedim/20 bg-transparent w-full rounded-sm">
                <p className="text-base text-bonedim text-center">Nenhum monstro catalogado.</p>
              </div>
            )}
          </div>
        </div>

      </section>
    </main>
  );
}

// --- SUBCOMPONENTES AUXILIARES ---

function StatCard({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="panel p-5 flex flex-col justify-between h-28 border border-bonedim/10 hover:border-[#d97736]/30 transition-colors shadow-md">
      <div className="flex justify-between items-start text-bonedim">
        <span className="text-xs uppercase tracking-widest font-bold">{title}</span>
      </div>
      <span className="text-4xl text-[#d97736] font-display font-bold">{value}</span>
    </div>
  );
}

function StatusBar({ label, atual, maximo, cor }: { label: string; atual: number; maximo: number; cor: string }) {
  const pct = maximo > 0 ? Math.round((atual / maximo) * 100) : 0;
  
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex justify-between text-xs text-bonedim uppercase tracking-wider font-semibold">
        <span>{label}</span>
        <span>{atual} / {maximo}</span>
      </div>
      <div className="flex gap-1.5 h-2.5 w-full bg-black/20 p-0.5 rounded-sm">
        {Array.from({ length: 5 }).map((_, i) => {
          const isFilled = (i / 5) * 100 < pct;
          return (
            <div 
              key={i} 
              className={`flex-1 rounded-sm transition-all duration-500 ${isFilled ? cor : 'bg-black/50'}`} 
            />
          );
        })}
      </div>
    </div>
  );
}