"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { Monstro } from "@/lib/types";

export default function EditMonstroPage() {
  const params = useParams();
  const router = useRouter();
  const [monstro, setMonstro] = useState<Monstro | null>(null);
  const [imagem, setImagem] = useState<File | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    api.get<Monstro>(`/bestiario/${params.id}`).then(setMonstro);
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!monstro) return;
    setErro(null);
    setEnviando(true);
    try {
      const fd = new FormData();
      fd.append("nome", monstro.nome);
      fd.append("categoria", monstro.categoria);
      fd.append("resistencia_base", String(monstro.resistencia_base));
      fd.append("descricao", monstro.descricao);
      fd.append("alvos", monstro.alvos);
      fd.append("acoes", monstro.acoes);
      if (imagem) fd.append("imagem", imagem);
      await api.put(`/bestiario/${monstro.id}`, fd);
      router.push(`/bestiario/${monstro.id}`);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao editar besta.");
    } finally {
      setEnviando(false);
    }
  }

  if (!monstro) return <p className="text-center text-bonedim py-24">Carregando besta...</p>;

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <span className="eyebrow">Revisão de espécime</span>
      <h1 className="font-display text-4xl text-bone mt-2 mb-8">Editar {monstro.nome}</h1>

      <form onSubmit={handleSubmit} className="panel p-6 flex flex-col gap-4">
        <div>
          <label className="field-label">Nome</label>
          <input
            className="field-input" required
            value={monstro.nome}
            onChange={(e) => setMonstro({ ...monstro, nome: e.target.value })}
          />
        </div>

        <div>
          <label className="field-label">Nova imagem (opcional)</label>
          <input
            type="file" accept="image/*"
            onChange={(e) => setImagem(e.target.files?.[0] ?? null)}
            className="field-input file:mr-4 file:btn-ghost file:!py-1.5 file:!px-3 file:!text-xs"
          />
        </div>

        <div>
          <label className="field-label">Categoria</label>
          <div className="flex gap-2">
            {["Jovem", "Adulto", "Apex"].map((c) => (
              <button
                type="button" key={c}
                onClick={() => setMonstro({ ...monstro, categoria: c })}
                className={`chip ${monstro.categoria === c ? "chip-active" : ""}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="field-label">Resistência base</label>
          <input
            type="number" min={1} required
            className="field-input !w-32 font-mono"
            value={monstro.resistencia_base}
            onChange={(e) => setMonstro({ ...monstro, resistencia_base: Number(e.target.value) })}
          />
        </div>

        {[
          ["descricao", "Descrição"], ["alvos", "Alvos"], ["acoes", "Ações"],
        ].map(([campo, label]) => (
          <div key={campo}>
            <label className="field-label">{label}</label>
            <textarea
              className="field-textarea" required
              value={monstro[campo as keyof Monstro] as string}
              onChange={(e) => setMonstro({ ...monstro, [campo]: e.target.value })}
            />
          </div>
        ))}

        {erro && (
          <p className="text-sm text-bloodmoon border border-bloodmoon/50 bg-bloodmoon/10 rounded-sm px-3 py-2">
            {erro}
          </p>
        )}

        <button type="submit" className="btn-hunter mt-2" disabled={enviando}>
          {enviando ? "Salvando..." : "Salvar alterações"}
        </button>
      </form>
    </div>
  );
}
