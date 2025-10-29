import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <main className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-24 sm:px-10 lg:px-20">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_45%),_radial-gradient(circle_at_bottom,_rgba(249,115,22,0.2),_transparent_55%)]" />
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-end">
          <div className="group relative h-56 w-56 overflow-hidden rounded-[3rem] border border-white/10 bg-slate-900/60 shadow-[0_30px_80px_rgba(15,23,42,0.55)] backdrop-blur">
            <Image
              src="/alex-rivera-portrait.svg"
              alt="Alex Rivera portrait"
              fill
              priority
              sizes="(max-width: 1024px) 224px, 224px"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/25 via-fuchsia-500/20 to-orange-400/35 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
          </div>
          <div className="flex max-w-2xl flex-col items-center text-center lg:items-start lg:text-left">
            <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
              Hi, I’m Alex Rivera — a full-stack developer based in Austin, Texas.
            </h1>
            <p className="mt-6 text-lg text-slate-200/90">
              I architect resilient web experiences and human-centered products that help teams launch faster and scale with confidence.
            </p>
            <p className="mt-4 text-base font-medium text-cyan-300">
              Full-stack developer crafting scalable MERN applications.
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center gap-6 sm:flex-row sm:items-center">
          <div className="flex flex-wrap justify-center gap-4 text-sm font-medium sm:justify-start">
            <Link
              className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 transition hover:border-cyan-400/60 hover:bg-cyan-400/10"
              href="https://github.com/alexrivera"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="h-2 w-2 rounded-full bg-cyan-300 transition group-hover:scale-150" />
              GitHub
            </Link>
            <Link
              className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 transition hover:border-cyan-400/60 hover:bg-cyan-400/10"
              href="https://www.linkedin.com/in/alexrivera"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="h-2 w-2 rounded-full bg-orange-300 transition group-hover:scale-150" />
              LinkedIn
            </Link>
            <Link
              className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 transition hover:border-cyan-400/60 hover:bg-cyan-400/10"
              href="mailto:hello@alexrivera.dev"
            >
              <span className="h-2 w-2 rounded-full bg-fuchsia-300 transition group-hover:scale-150" />
              Email
            </Link>
          </div>
          <Link
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-orange-400 px-8 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:scale-[1.02]"
            href="https://example.com/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download Resume
          </Link>
        </div>
      </main>
    </div>
  );
}
