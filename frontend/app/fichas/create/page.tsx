"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";
import type { Condicao } from "@/lib/types";

const ABAS = ["Estilo", "Habilidades", "Traços", "Utensílio", "Informações"];

const ESTILOS = ["ligeiro", "poderoso", "preciso", "sagaz"] as const;
const HABILIDADES = [
  "agarrar", "atravessar", "estudar", "armazenar", "buscar", "exibir",
  "assegurar", "chamar", "golpear", "atirar", "curar", "manufaturar",
] as const;

interface TracoForm {
  nome: string;
  custo: string;
  descricao: string;
  habilidade_relacionada: string;
  estilo_relacionado: string;
}

const tracoVazio: TracoForm = {
  nome: "",
  custo: "",
  descricao: "",
  habilidade_relacionada: "agarrar",
  estilo_relacionado: "ligeiro",
};

export default function CreateFichaPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [aba, setAba] = useState(0);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [condicoes, setCondicoes] = useState<Condicao[]>([]);
  const [condicoesSelecionadas, setCondicoesSelecionadas] = useState<number[]>([]);

  const [estilo, setEstilo] = useState<Record<string, number>>({
    ligeiro: 0, poderoso: 0, preciso: 0, sagaz: 0,
  });
  const [habilidade, setHabilidade] = useState<Record<string, number>>(
    Object.fromEntries(HABILIDADES.map((h) => [h === "buscar" ? "procurar" : h, 0]))
  );
  const [tracos, setTracos] = useState<TracoForm[]>([tracoVazio, { ...tracoVazio }, { ...tracoVazio }]);
  const [utensilio, setUtensilio] = useState({ nome: "", alcance: "", ataques: "", durabilidade_maxima: 10 });
  const [imagem, setImagem] = useState<File | null>(null);
  const [info, setInfo] = useState({
    nome: "", titulo: "", especialidade: "", voce_e: "", tenta_ser: "",
    feras_familiares: "", prato_tipico: "", tempero_tipico: "",
    criacao: "", iniciacao: "", ambicao: "", conexao: "",
  });

  useEffect(() => {
    api.get<Condicao[]>("/feral/condicoes").then(setCondicoes).catch(() => {});
  }, []);

  if (!loading && !user) {
    return (
      <div className="max-w-lg mx-auto px-6 py-24 text-center">
        <p className="text-bonedim">Você precisa entrar na sua conta para criar um feral.</p>
      </div>
    );
  }

  function toggleCondicao(id: number) {
    setCondicoesSelecionadas((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  function atualizarTraco(idx: number, campo: keyof TracoForm, valor: string) {
    setTracos((prev) => prev.map((t, i) => (i === idx ? { ...t, [campo]: valor } : t)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setEnviando(true);
    try {
      const habilidadeCompleta = { ...habilidade };
      const fd = new FormData();
      Object.entries(info).forEach(([k, v]) => fd.append(k, v));
      fd.append("estilo", JSON.stringify(estilo));
      fd.append("habilidade", JSON.stringify(habilidadeCompleta));
      fd.append("utensilio", JSON.stringify(utensilio));
      fd.append("tracos", JSON.stringify(tracos));
      fd.append("condicoes", JSON.stringify(condicoesSelecionadas));
      if (imagem) fd.append("imagem", imagem);

      const feral = await api.post<{ id: number }>("/feral/create", fd);
      router.push(`/fichas/${feral.id}`);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao criar ficha.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <span className="eyebrow">Novo registro</span>
      <h1 className="font-display text-4xl text-bone mt-2 mb-8">Cadastro de Personagem</h1>

      <nav className="flex flex-wrap gap-2 mb-8">
        {ABAS.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => setAba(i)}
            className={`chip ${aba === i ? "chip-active" : ""}`}
          >
            {label}
          </button>
        ))}
      </nav>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {aba === 0 && (
          <div className="panel p-6 flex flex-col gap-4">
            <p className="text-sm text-bonedim leading-relaxed">
              <span className="text-gold">ESTILOS</span> são os atributos principais. Um feral preparado
              começa com 3 em um Estilo, 2 em outro e 1 nos restantes.
            </p>
            {ESTILOS.map((k) => (
              <div key={k} className="flex items-center justify-between gap-4">
                <label className="field-label !mb-0">{k}</label>
                <input
                  type="number" min={0} max={5} required
                  value={estilo[k]}
                  onChange={(e) => setEstilo((p) => ({ ...p, [k]: Number(e.target.value) }))}
                  className="field-input !w-24 text-center font-mono"
                />
              </div>
            ))}
          </div>
        )}

        {aba === 1 && (
          <div className="panel p-6 flex flex-col gap-4">
            <p className="text-sm text-bonedim leading-relaxed">
              <span className="text-gold">HABILIDADES</span> variam entre 0 e 3. Combine qualquer
              habilidade com qualquer estilo em um teste.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {HABILIDADES.map((h) => {
                const chave = h === "buscar" ? "procurar" : h;
                return (
                  <div key={h} className="flex items-center justify-between gap-2">
                    <label className="field-label !mb-0">{h}</label>
                    <input
                      type="number" min={0} max={5} required
                      value={habilidade[chave]}
                      onChange={(e) =>
                        setHabilidade((p) => ({ ...p, [chave]: Number(e.target.value) }))
                      }
                      className="field-input !w-20 text-center font-mono"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {aba === 2 && (
          <div className="flex flex-col gap-5">
            {tracos.map((t, idx) => (
              <div key={idx} className="panel p-5 flex flex-col gap-3">
                <p className="font-display text-gold uppercase tracking-widest text-sm">
                  Traço {idx + 1}
                </p>
                <input
                  className="field-input" placeholder="Nome" required
                  value={t.nome} onChange={(e) => atualizarTraco(idx, "nome", e.target.value)}
                />
                <input
                  className="field-input" placeholder="Custo" required
                  value={t.custo} onChange={(e) => atualizarTraco(idx, "custo", e.target.value)}
                />
                <textarea
                  className="field-textarea" placeholder="Descrição" required
                  value={t.descricao} onChange={(e) => atualizarTraco(idx, "descricao", e.target.value)}
                />
                <div className="grid grid-cols-2 gap-3">
                  <select
                    className="field-input"
                    value={t.habilidade_relacionada}
                    onChange={(e) => atualizarTraco(idx, "habilidade_relacionada", e.target.value)}
                  >
                    {HABILIDADES.map((h) => (
                      <option key={h} value={h === "buscar" ? "procurar" : h} className="bg-ironwood">
                        {h}
                      </option>
                    ))}
                  </select>
                  <select
                    className="field-input"
                    value={t.estilo_relacionado}
                    onChange={(e) => atualizarTraco(idx, "estilo_relacionado", e.target.value)}
                  >
                    {ESTILOS.map((s) => (
                      <option key={s} value={s} className="bg-ironwood">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}

        {aba === 3 && (
          <div className="panel p-6 flex flex-col gap-4">
            <input
              className="field-input" placeholder="Nome do utensílio" required
              value={utensilio.nome}
              onChange={(e) => setUtensilio((p) => ({ ...p, nome: e.target.value }))}
            />
            <input
              className="field-input" placeholder="Alcance" required
              value={utensilio.alcance}
              onChange={(e) => setUtensilio((p) => ({ ...p, alcance: e.target.value }))}
            />
            <textarea
              className="field-textarea" placeholder="Ataques" required
              value={utensilio.ataques}
              onChange={(e) => setUtensilio((p) => ({ ...p, ataques: e.target.value }))}
            />
            <div>
              <label className="field-label">Durabilidade máxima</label>
              <input
                type="number" min={1} required
                className="field-input !w-32 font-mono"
                value={utensilio.durabilidade_maxima}
                onChange={(e) =>
                  setUtensilio((p) => ({ ...p, durabilidade_maxima: Number(e.target.value) }))
                }
              />
            </div>
          </div>
        )}

        {aba === 4 && (
          <div className="panel p-6 flex flex-col gap-4">
            {[
              ["nome", "Nome"], ["titulo", "Título do feral"], ["especialidade", "Especialidade"],
              ["voce_e", "Você é..."], ["tenta_ser", "Mas tenta ser..."],
              ["feras_familiares", "Feras familiares"], ["prato_tipico", "Prato típico"],
              ["tempero_tipico", "Tempero típico"],
            ].map(([campo, label]) => (
              <div key={campo}>
                <label className="field-label">{label}</label>
                <input
                  className="field-input" required
                  value={info[campo as keyof typeof info]}
                  onChange={(e) => setInfo((p) => ({ ...p, [campo]: e.target.value }))}
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
                  value={info[campo as keyof typeof info]}
                  onChange={(e) => setInfo((p) => ({ ...p, [campo]: e.target.value }))}
                />
              </div>
            ))}

            <div>
              <label className="field-label">Condições iniciais</label>
              <div className="flex flex-wrap gap-2">
                {condicoes.map((c) => (
                  <button
                    type="button" key={c.id}
                    onClick={() => toggleCondicao(c.id)}
                    className={`chip ${condicoesSelecionadas.includes(c.id) ? "chip-active" : ""}`}
                  >
                    {c.nome}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="field-label">Imagem</label>
              <input
                type="file" accept="image/*" required
                onChange={(e) => setImagem(e.target.files?.[0] ?? null)}
                className="field-input file:mr-4 file:btn-ghost file:!py-1.5 file:!px-3 file:!text-xs"
              />
            </div>
          </div>
        )}

        {erro && (
          <p className="text-sm text-bloodmoon border border-bloodmoon/50 bg-bloodmoon/10 rounded-sm px-3 py-2">
            {erro}
          </p>
        )}

        <div className="flex justify-between">
          <button
            type="button"
            className="btn-ghost"
            disabled={aba === 0}
            onClick={() => setAba((a) => Math.max(0, a - 1))}
          >
            Voltar
          </button>
          {aba < ABAS.length - 1 ? (
            <button type="button" className="btn-hunter" onClick={() => setAba((a) => a + 1)}>
              Próximo
            </button>
          ) : (
            <button type="submit" className="btn-hunter" disabled={enviando}>
              {enviando ? "Criando..." : "Criar Feral"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
