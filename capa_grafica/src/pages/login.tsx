import { useState, type FormEvent } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import type { AxiosError } from "axios";
import Logo from "../images/app_logo.png";
import { login } from "../api/authApi";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  onBack: () => void;
  onRegister: () => void;
  onSuccess?: () => void;
}

interface ApiError {
  ok: boolean;
  message: string;
  errors?: { field: string; message: string }[];
}

export default function Login({ onBack, onRegister, onSuccess }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = { email, password };

    try {
      await login(payload);
      onSuccess?.();
      navigate('/home')
    } catch (err) {
      const axiosErr = err as AxiosError<ApiError>;

      const message =
        axiosErr.response?.data?.message ??
        "No se pudo iniciar sesión. Verifica tus datos e intenta de nuevo.";

      setError(message);
    } finally {
      setLoading(false);
    }
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
                type="button"
                onClick={onBack}
                disabled={loading}
                className="absolute left-6 top-6 text-sm text-slate-500 transition-colors hover:text-green-300 disabled:opacity-40"
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
                noValidate
              >
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="login-email"
                    className="text-xs font-medium tracking-wide text-slate-400"
                  >
                    Correo electrónico
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                    autoComplete="email"
                    disabled={loading}
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
                      disabled:opacity-50

                      focus:border-green-400/60
                      focus:bg-green-400/[0.04]
                      focus:shadow-[0_0_20px_rgba(34,197,94,0.15)]
                    "
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="login-password"
                    className="text-xs font-medium tracking-wide text-slate-400"
                  >
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      autoComplete="current-password"
                      disabled={loading}
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
                        disabled:opacity-50

                        focus:border-green-400/60
                        focus:bg-green-400/[0.04]
                        focus:shadow-[0_0_20px_rgba(34,197,94,0.15)]
                      "
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      disabled={loading}
                      tabIndex={-1}
                      aria-label={
                        showPassword
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-green-300 disabled:opacity-40"
                    >
                      {showPassword ? (
                        <FiEyeOff size={18} />
                      ) : (
                        <FiEye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div
                    role="alert"
                    className="
                      flex
                      items-start
                      gap-3
                      rounded-xl
                      border
                      border-red-500/30
                      bg-red-500/10
                      px-4
                      py-3
                      text-sm
                      text-red-300
                    "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="mt-0.5 h-4 w-4 flex-shrink-0"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v4.5a.75.75 0 0 0 1.5 0V9Zm0 6.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="leading-relaxed">{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    mt-2
                    flex
                    h-12
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-green-400
                    text-sm
                    font-semibold
                    text-black
                    transition-all
                    duration-300
                    disabled:cursor-not-allowed
                    disabled:opacity-60

                    hover:bg-green-300
                    hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]

                    active:scale-[0.98]
                  "
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                      Ingresando...
                    </>
                  ) : (
                    "Ingresar"
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                ¿No tienes cuenta?{" "}
                <button
                  type="button"
                  onClick={onRegister}
                  disabled={loading}
                  className="font-semibold text-green-300 transition-colors hover:text-green-200 disabled:opacity-40"
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
