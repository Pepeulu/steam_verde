"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function CreateMonstroPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nome: "", categoria: "Jovem", resistencia_base: 10,
    descricao: "", alvos: "", acoes: "",
  });
  const [imagem, setImagem] = useState<File | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setEnviando(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
      if (imagem) fd.append("imagem", imagem);
      const monstro = await api.post<{ id: number }>("/bestiario/", fd);
      router.push(`/bestiario/${monstro.id}`);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao cadastrar besta.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <span className="eyebrow">Novo espécime</span>
      <h1 className="font-display text-4xl text-bone mt-2 mb-8">Cadastro da Besta</h1>

      <form onSubmit={handleSubmit} className="panel p-6 flex flex-col gap-4">
        <div>
          <label className="field-label">Nome</label>
          <input
            className="field-input" required
            value={form.nome} onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))}
          />
        </div>

        <div>
          <label className="field-label">Imagem</label>
          <input
            type="file" accept="image/*" required
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
                onClick={() => setForm((p) => ({ ...p, categoria: c }))}
                className={`chip ${form.categoria === c ? "chip-active" : ""}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="field-label">Resistência</label>
          <input
            type="number" min={1} required
            className="field-input !w-32 font-mono"
            value={form.resistencia_base}
            onChange={(e) => setForm((p) => ({ ...p, resistencia_base: Number(e.target.value) }))}
          />
        </div>

        {[
          ["descricao", "Descrição"], ["alvos", "Alvos"], ["acoes", "Ações"],
        ].map(([campo, label]) => (
          <div key={campo}>
            <label className="field-label">{label}</label>
            <textarea
              className="field-textarea" required
              value={form[campo as keyof typeof form] as string}
              onChange={(e) => setForm((p) => ({ ...p, [campo]: e.target.value }))}
            />
          </div>
        ))}

        {erro && (
          <p className="text-sm text-bloodmoon border border-bloodmoon/50 bg-bloodmoon/10 rounded-sm px-3 py-2">
            {erro}
          </p>
        )}

        <button type="submit" className="btn-hunter mt-2" disabled={enviando}>
          {enviando ? "Registrando..." : "Criar Besta"}
        </button>
      </form>
    </div>
  );
}
