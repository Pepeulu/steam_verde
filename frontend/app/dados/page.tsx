"use client";

import { useState, useRef } from "react";

function useRolagem(lados: number, duracaoMs = 700) {
  const [valor, setValor] = useState(1);
  const [rolando, setRolando] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function rolar() {
    if (rolando) return;
    setRolando(true);
    let contagem = 0;
    intervalRef.current = setInterval(() => {
      setValor(Math.floor(Math.random() * lados) + 1);
      contagem++;
      if (contagem > 10) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setRolando(false);
      }
    }, duracaoMs / 12);
  }

  return { valor, rolando, rolar };
}

function Dado({
  lados,
  cor,
  onRolar,
  valor,
  rolando,
}: {
  lados: number;
  cor: string;
  onRolar: () => void;
  valor: number;
  rolando: boolean;
}) {
  return (
    <div
      className={`w-28 h-28 md:w-32 md:h-32 flex items-center justify-center panel relative transition-transform duration-500 ${
        rolando ? "rotate-[360deg]" : ""
      }`}
      style={{ borderColor: cor }}
    >
      <span className="font-mono text-3xl md:text-4xl font-bold" style={{ color: cor }}>
        {valor}
      </span>
      <span className="absolute -top-3 left-1/2 -translate-x-1/2 font-display text-[10px] uppercase tracking-widest bg-void px-2 text-bonedim">
        d{lados}
      </span>
    </div>
  );
}

export default function DadosPage() {
  const d8 = useRolagem(8);
  const d20 = useRolagem(20);
  const [qtd, setQtd] = useState(3);
  const estilos = [
    useRolagem(6),
    useRolagem(6),
    useRolagem(6),
    useRolagem(6),
    useRolagem(6),
  ];

  function rolarEstilo() {
    estilos.forEach((d, i) => {
      if (i < qtd) d.rolar();
    });
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 flex flex-col gap-16">
      <div>
        <span className="eyebrow">Diário do Caçador</span>
        <h1 className="font-display text-4xl text-bone mt-2">Dados</h1>
        <p className="text-bonedim mt-2 max-w-lg">
          Role os dados que decidem o destino de sua caçada.
        </p>
      </div>

      <section className="flex flex-col items-center gap-6">
        <h2 className="font-display text-lg uppercase tracking-widest text-gold">Dado de Humano</h2>
        <Dado lados={8} cor="#d9691f" valor={d8.valor} rolando={d8.rolando} onRolar={d8.rolar} />
        <button className="btn-hunter" onClick={d8.rolar} disabled={d8.rolando}>
          Rolar
        </button>
      </section>

      <div className="divider-rune" />

      <section className="flex flex-col items-center gap-6">
        <h2 className="font-display text-lg uppercase tracking-widest text-gold">Dado de Animal</h2>
        <Dado lados={20} cor="#7a2020" valor={d20.valor} rolando={d20.rolando} onRolar={d20.rolar} />
        <button className="btn-hunter" onClick={d20.rolar} disabled={d20.rolando}>
          Rolar
        </button>
      </section>

      <div className="divider-rune" />

      <section className="flex flex-col items-center gap-6">
        <h2 className="font-display text-lg uppercase tracking-widest text-gold">Dados de Estilo</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {estilos.map((d, i) =>
            i < qtd ? (
              <Dado key={i} lados={6} cor="#4a6741" valor={d.valor} rolando={d.rolando} onRolar={d.rolar} />
            ) : null
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="panel px-4 py-2 flex items-center gap-2">
            <span className="field-label !mb-0">Quantidade</span>
            <select
              value={qtd}
              onChange={(e) => setQtd(Number(e.target.value))}
              className="bg-transparent text-bone font-mono focus:outline-none"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n} className="bg-ironwood">
                  {n}
                </option>
              ))}
            </select>
          </div>
          <button className="btn-hunter" onClick={rolarEstilo}>
            Rolar
          </button>
        </div>
      </section>
    </div>
  );
}
