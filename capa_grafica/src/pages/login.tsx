import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Logo from "../images/app_logo.png";

interface LoginProps {
  onBack: () => void;
  onRegister: () => void;
}

export default function Login({ onBack, onRegister }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

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
            <div className="relative rounded-3xl bg-[#06100e]/95 px-8 py-12 sm:px-10">
              <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-green-400/60 to-transparent" />

              <button
                onClick={onBack}
                className="absolute left-6 top-6 text-sm text-slate-500 transition-colors hover:text-green-300"
              >
                ← Volver
              </button>

              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-green-400/20 blur-2xl" />
                  <img
                    src={Logo}
                    alt="TradeLab"
                    className="relative h-24 w-24 object-contain"
                  />
                </div>
              </div>

              <div className="mt-6 text-center">
                <h1 className="bg-gradient-to-b from-white to-white/70 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
                  Bienvenido de vuelta
                </h1>
                <p className="mx-auto mt-3 max-w-[18rem] text-sm leading-relaxed text-slate-400">
                  Ingresa a tu cuenta para continuar operando.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-8 flex flex-col gap-4"
              >
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium tracking-wide text-slate-400">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                    className="
                      h-12
                      rounded-xl
                      border
                      border-white/10
                      bg-white/[0.03]
                      px-4
                      text-sm
                      text-white
                      placeholder:text-slate-600
                      outline-none
                      transition-all
                      duration-200

                      focus:border-green-400/60
                      focus:bg-green-400/[0.04]
                      focus:shadow-[0_0_20px_rgba(34,197,94,0.15)]
                    "
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium tracking-wide text-slate-400">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="
                        h-12
                        w-full
                        rounded-xl
                        border
                        border-white/10
                        bg-white/[0.03]
                        px-4
                        pr-12
                        text-sm
                        text-white
                        placeholder:text-slate-600
                        outline-none
                        transition-all
                        duration-200

                        focus:border-green-400/60
                        focus:bg-green-400/[0.04]
                        focus:shadow-[0_0_20px_rgba(34,197,94,0.15)]
                      "
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-green-300"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <FiEyeOff size={18} />
                      ) : (
                        <FiEye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="
                    mt-2
                    h-12
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
                  Ingresar
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                ¿No tienes cuenta?{" "}
                <button
                  onClick={onRegister}
                  className="font-semibold text-green-300 transition-colors hover:text-green-200"
                >
                  Regístrate
                </button>
              </p>
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
