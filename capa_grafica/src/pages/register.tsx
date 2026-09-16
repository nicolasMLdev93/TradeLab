import { useState, type FormEvent } from "react";
import { FiEye, FiEyeOff, FiCheck, FiX } from "react-icons/fi";
import type { AxiosError } from "axios";
import Logo from "../images/app_logo.png";
import { register } from "../api/authApi";

interface RegisterProps {
  onBack: () => void;
  onLogin: () => void;
  onSuccess?: () => void;
}

interface ApiError {
  ok: boolean;
  message: string;
  errors?: { field: string; message: string }[];
}

interface FieldErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function Register({
  onBack,
  onLogin,
  onSuccess,
}: RegisterProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const rules = {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
  };

  const passwordValid =
    rules.minLength && rules.hasUpper && rules.hasLower && rules.hasNumber;

  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (!passwordValid) {
      setError("La contraseña no cumple con los requisitos mínimos.");
      return;
    }

    if (!passwordsMatch) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    const payload = { username, email, password, confirmPassword };

    try {
      await register(payload);
      onSuccess?.();
    } catch (err) {
      const axiosErr = err as AxiosError<ApiError>;
      const response = axiosErr.response?.data;

      if (response?.errors?.length) {
        const byField: FieldErrors = {};
        for (const e of response.errors) {
          const key = e.field as keyof FieldErrors;
          if (!byField[key]) byField[key] = e.message;
        }
        setFieldErrors(byField);
      }

      setError(
        response?.message ??
          "No se pudo completar el registro. Intenta de nuevo.",
      );
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
                  Crea tu cuenta
                </h1>
                <p className="mx-auto mt-3 max-w-[18rem] text-sm leading-relaxed text-slate-400">
                  Únete y empieza a operar en minutos.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-8 flex flex-col gap-4"
                noValidate
              >
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="register-username"
                    className="text-xs font-medium tracking-wide text-slate-400"
                  >
                    Nombre de usuario
                  </label>
                  <input
                    id="register-username"
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (fieldErrors.username) {
                        setFieldErrors((prev) => ({
                          ...prev,
                          username: undefined,
                        }));
                      }
                    }}
                    placeholder="juanperez"
                    required
                    autoComplete="username"
                    disabled={loading}
                    className={inputClass(Boolean(fieldErrors.username))}
                  />
                  {fieldErrors.username && (
                    <p className="text-xs text-red-400">
                      {fieldErrors.username}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="register-email"
                    className="text-xs font-medium tracking-wide text-slate-400"
                  >
                    Correo electrónico
                  </label>
                  <input
                    id="register-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) {
                        setFieldErrors((prev) => ({
                          ...prev,
                          email: undefined,
                        }));
                      }
                    }}
                    placeholder="tu@email.com"
                    required
                    autoComplete="email"
                    disabled={loading}
                    className={inputClass(Boolean(fieldErrors.email))}
                  />
                  {fieldErrors.email && (
                    <p className="text-xs text-red-400">{fieldErrors.email}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="register-password"
                    className="text-xs font-medium tracking-wide text-slate-400"
                  >
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) setError("");
                        if (fieldErrors.password) {
                          setFieldErrors((prev) => ({
                            ...prev,
                            password: undefined,
                          }));
                        }
                      }}
                      placeholder="••••••••"
                      required
                      autoComplete="new-password"
                      disabled={loading}
                      className={inputClass(
                        Boolean(fieldErrors.password),
                        "pr-12",
                      )}
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
                  {fieldErrors.password && (
                    <p className="text-xs text-red-400">
                      {fieldErrors.password}
                    </p>
                  )}

                  {password.length > 0 && (
                    <ul className="mt-1 flex flex-col gap-1 text-xs">
                      <Rule ok={rules.minLength}>Al menos 8 caracteres</Rule>
                      <Rule ok={rules.hasUpper}>Una mayúscula</Rule>
                      <Rule ok={rules.hasLower}>Una minúscula</Rule>
                      <Rule ok={rules.hasNumber}>Un número</Rule>
                    </ul>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="register-confirm"
                    className="text-xs font-medium tracking-wide text-slate-400"
                  >
                    Repetir contraseña
                  </label>
                  <div className="relative">
                    <input
                      id="register-confirm"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (error) setError("");
                        if (fieldErrors.confirmPassword) {
                          setFieldErrors((prev) => ({
                            ...prev,
                            confirmPassword: undefined,
                          }));
                        }
                      }}
                      placeholder="••••••••"
                      required
                      autoComplete="new-password"
                      disabled={loading}
                      className={inputClass(
                        Boolean(fieldErrors.confirmPassword) ||
                          (confirmPassword.length > 0 && !passwordsMatch),
                        "pr-12",
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      disabled={loading}
                      tabIndex={-1}
                      aria-label={
                        showConfirmPassword
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-green-300 disabled:opacity-40"
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff size={18} />
                      ) : (
                        <FiEye size={18} />
                      )}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p className="text-xs text-red-400">
                      {fieldErrors.confirmPassword}
                    </p>
                  )}
                  {!fieldErrors.confirmPassword &&
                    confirmPassword.length > 0 &&
                    !passwordsMatch && (
                      <p className="text-xs text-red-400">
                        Las contraseñas no coinciden
                      </p>
                    )}
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
                      Creando cuenta...
                    </>
                  ) : (
                    "Registrarse"
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                ¿Ya tienes cuenta?{" "}
                <button
                  type="button"
                  onClick={onLogin}
                  disabled={loading}
                  className="font-semibold text-green-300 transition-colors hover:text-green-200 disabled:opacity-40"
                >
                  Inicia sesión
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

function inputClass(hasError: boolean, extra = ""): string {
  return `
    h-12
    w-full
    rounded-xl
    border
    bg-white/[0.03]
    px-4
    text-sm
    text-white
    placeholder:text-slate-600
    outline-none
    transition-all
    duration-200
    disabled:opacity-50
    ${extra}

    ${
      hasError
        ? "border-red-500/60 focus:border-red-400 focus:shadow-[0_0_20px_rgba(239,68,68,0.2)]"
        : "border-white/10 focus:border-green-400/60 focus:bg-green-400/[0.04] focus:shadow-[0_0_20px_rgba(34,197,94,0.15)]"
    }
  `;
}

function Rule({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <li
      className={`flex items-center gap-2 ${
        ok ? "text-green-400" : "text-slate-500"
      }`}
    >
      {ok ? <FiCheck size={12} /> : <FiX size={12} />}
      <span>{children}</span>
    </li>
  );
}
