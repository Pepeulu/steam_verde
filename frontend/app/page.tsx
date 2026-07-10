import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-ember-glow pointer-events-none" />

      <section className="relative min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center text-center px-6 gap-10">
        <span className="eyebrow">Um chamado da mata selvagem</span>

        <h1 className="font-display text-5xl md:text-7xl leading-tight text-bone max-w-3xl">
          WILDER<span className="text-ember">FEAST</span>
        </h1>

        <p className="font-body text-bonedim text-lg max-w-xl leading-relaxed">
          Registre seu feral, catalogue as bestas da mata e role os dados do destino.
          O diário de caça está aberto — resta saber se você sobreviverá até a próxima refeição.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Link href="/register" className="btn-hunter">
            Iniciar caçada
          </Link>
          <Link href="/login" className="btn-ghost">
            Já tenho registro
          </Link>
        </div>

        <div className="divider-rune w-full max-w-md" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl w-full">
          {[
            { titulo: "Fichas de Feral", desc: "Crie e evolua caçadores com Estilo, Habilidade e Utensílio." },
            { titulo: "Bestiário", desc: "Catalogue partes, alcance e durabilidade de cada besta." },
            { titulo: "Dados", desc: "Role d8, d20 e os dados de Estilo direto no navegador." },
          ].map((item) => (
            <div key={item.titulo} className="panel p-6 text-left">
              <h3 className="font-display text-sm uppercase tracking-widest text-gold mb-2">
                {item.titulo}
              </h3>
              <p className="text-sm text-bonedim leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
