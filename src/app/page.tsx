import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-violet-900 to-slate-900 text-white px-6">
      <div className="max-w-4xl text-center space-y-10">
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight leading-[1.1] drop-shadow-2xl">
          Neorly
        </h1>
        <p className="text-xl md:text-3xl font-light text-indigo-100 max-w-2xl mx-auto leading-relaxed">
          AI-помічник для навчання: перетворюй PDF на конспекти, картки та тести
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-full bg-white text-indigo-950 px-8 py-4 text-lg font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-50 hover:scale-105 transition-all duration-300"
          >
            Почати безкоштовно
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full border-2 border-white/30 text-white px-8 py-4 text-lg font-semibold hover:bg-white/10 hover:border-white/60 transition-all duration-300"
          >
            Увійти
          </Link>
        </div>
      </div>
    </main>
  );
}
