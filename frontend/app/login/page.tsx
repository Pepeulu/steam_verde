"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);
    try {
      await login(email, senha);
      router.push("/home");
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao entrar.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-6">
      <div className="panel w-full max-w-md p-8">
        <span className="eyebrow">Portão do Acampamento</span>
        <h1 className="font-display text-3xl text-bone mt-2 mb-8">Entrar na caçada</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="field-label">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field-input"
              placeholder="cacador@wilderfeast.com"
            />
          </div>
          <div>
            <label className="field-label">Senha</label>
            <input
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="field-input"
              placeholder="••••••••"
            />
          </div>

          {erro && (
            <p className="text-sm text-bloodmoon border border-bloodmoon/50 bg-bloodmoon/10 rounded-sm px-3 py-2">
              {erro}
            </p>
          )}

          <button type="submit" disabled={carregando} className="btn-hunter mt-2">
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="text-sm text-bonedim mt-6 text-center">
          Ainda não tem registro?{" "}
          <Link href="/register" className="text-ember hover:text-emberlight">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
