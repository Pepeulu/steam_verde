"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { Feral } from "@/lib/types";

export default function EditFichaPage() {
  const params = useParams();
  const router = useRouter();
  const [feral, setFeral] = useState<Feral | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    api.get<Feral>(`/feral/detail/${params.id}`).then(setFeral);
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!feral) return;
    setErro(null);
    setEnviando(true);
    try {
      const fd = new FormData();
      fd.append("nome", feral.nome);
      fd.append("titulo", feral.titulo);
      fd.append("especialidade", feral.especialidade);
      fd.append("criacao", feral.criacao);
      fd.append("iniciacao", feral.iniciacao);
      fd.append("ambicao", feral.ambicao);
      fd.append("conexao", feral.conexao);
      await api.put(`/feral/edit/${feral.id}`, fd);
      router.push(`/fichas/${feral.id}`);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao editar ficha.");
    } finally {
      setEnviando(false);
    }
  }

  if (!feral) return <p className="text-center text-bonedim py-24">Carregando ficha...</p>;

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <span className="eyebrow">Revisão de registro</span>
      <h1 className="font-display text-4xl text-bone mt-2 mb-8">Editar {feral.nome}</h1>

      <form onSubmit={handleSubmit} className="panel p-6 flex flex-col gap-4">
        {[
          ["nome", "Nome"], ["titulo", "Título do feral"], ["especialidade", "Especialidade"],
        ].map(([campo, label]) => (
          <div key={campo}>
            <label className="field-label">{label}</label>
            <input
              className="field-input" required
              value={feral[campo as keyof Feral] as string}
              onChange={(e) => setFeral({ ...feral, [campo]: e.target.value })}
            />
          </div>
        ))}
        {[
          ["criacao", "Criação"], ["iniciacao", "Iniciação"],
          ["ambicao", "Ambição"], ["conexao", "Conexão"],
        ].map(([campo, label]) => (
          <div key={campo}>
            <label className="field-label">{label}</label>
            <textarea
              className="field-textarea" required
              value={feral[campo as keyof Feral] as string}
              onChange={(e) => setFeral({ ...feral, [campo]: e.target.value })}
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
