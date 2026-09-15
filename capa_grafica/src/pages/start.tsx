import Logo from "../images/app_logo.png";

interface StartProps {
  onLogin: () => void;
  onRegister: () => void;
}

export default function Start({ onLogin, onRegister }: StartProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030807] text-white">
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `
            radial-gradient(
              circle,
              rgba(34, 197, 94, 0.6) 1px,
              transparent 1.5px
            )
          `,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,197,94,0.15),transparent_50%)]" />

      <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500/[0.07] blur-[160px]" />

      <main className="relative z-10 flex min-h-screen items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <div
            className="
              group
              relative
              overflow-hidden
              rounded-3xl
              border
              border-white/[0.08]
              bg-gradient-to-b
              from-white/[0.06]
              to-white/[0.02]
              p-[1px]
              backdrop-blur-2xl
            "
          >
            <div
              className="
                relative
                rounded-3xl
                bg-[#06100e]/95
                px-8
                py-12
                sm:px-10
              "
            >
              <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-green-400/60 to-transparent" />

              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-green-400/20 blur-2xl" />
                  <img
                    src={Logo}
                    alt="TradeLab"
                    className="relative h-28 w-28 object-contain"
                  />
                </div>
              </div>

              <div className="mt-6 text-center">
                <h1 className="bg-gradient-to-b from-white to-white/70 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
                  TradeLab
                </h1>

                <p className="mx-auto mt-4 max-w-[18rem] text-sm leading-relaxed text-slate-400">
                  Analiza el mercado, administra tu portafolio y toma el
                  control de tu experiencia de trading.
                </p>
              </div>

              <div className="mt-10 flex flex-col gap-3">
                <button
                  onClick={onLogin}
                  className="
                    group/btn
                    relative
                    h-12
                    overflow-hidden
                    rounded-xl
                    bg-green-400
                    text-sm
                    font-semibold
                    text-black
                    transition-all
                    duration-300

                    hover:bg-green-300
                    hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]

                    active:scale-[0.98]
                  "
                >
                  <span className="relative z-10">Ingresar</span>
                </button>

                <button
                  onClick={onRegister}
                  className="
                    h-12
                    rounded-xl
                    border
                    border-white/10
                    bg-white/[0.03]
                    text-sm
                    font-semibold
                    text-white/90
                    backdrop-blur-sm
                    transition-all
                    duration-300

                    hover:border-green-400/60
                    hover:bg-green-400/[0.06]
                    hover:text-green-300

                    active:scale-[0.98]
                  "
                >
                  Registro
                </button>
              </div>

              <div className="mt-8 flex items-center justify-center gap-2">
                <span className="h-px w-6 bg-white/10" />
                <p className="text-[10px] font-medium tracking-[0.2em] text-slate-500">
                  SECURE • MODERN • BUILT FOR TRADERS
                </p>
                <span className="h-px w-6 bg-white/10" />
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-slate-600">
            © 2025 TradeLab. Todos los derechos reservados.
          </p>
        </div>
      </main>
    </div>
  );
}