import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-6">
      <div className="panel p-10 text-center max-w-md flex flex-col gap-4 items-center">
        <span className="eyebrow">Erro 404</span>
        <h1 className="font-display text-3xl text-bone">Rastro perdido</h1>
        <p className="text-bonedim">O conteúdo que você procura não existe nesta mata.</p>
        <Link href="/" className="btn-hunter mt-2">
          Retornar ao acampamento
        </Link>
      </div>
    </div>
  );
}
