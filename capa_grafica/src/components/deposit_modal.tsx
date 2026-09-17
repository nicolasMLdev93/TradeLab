import { useState, type FormEvent } from "react";
import { FiX } from "react-icons/fi";
import type { AxiosError } from "axios";
import { depositToWallet } from "../api/transactionApi";
import type { Wallet } from "../api/walletApi";

interface DepositModalProps {
  wallet: Wallet;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DepositModal({
  wallet,
  onClose,
  onSuccess,
}: DepositModalProps) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const symbol = wallet.currency?.symbol?.toUpperCase() ?? "—";
  const name = wallet.currency?.name ?? "Moneda";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const numeric = Number(amount);
    if (!amount || Number.isNaN(numeric) || numeric <= 0) {
      setError("Ingresa un monto válido mayor a 0.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await depositToWallet({
        walletId: wallet.id,
        amount,
        note: note.trim() || undefined,
      });
      onSuccess();
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      setError(
        axiosErr.response?.data?.message ?? "No se pudo hacer el depósito.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="
          relative w-full max-w-md overflow-hidden rounded-3xl border
          border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-white/[0.02]
          p-[1px] backdrop-blur-2xl
        "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative rounded-3xl bg-[#06100e]/95 p-8">
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-green-400/60 to-transparent" />

          <button
            onClick={onClose}
            disabled={loading}
            className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:text-green-300 disabled:opacity-40"
            aria-label="Cerrar"
          >
            <FiX size={18} />
          </button>

          <div>
            <h2 className="text-2xl font-bold tracking-tight">Depositar</h2>
            <p className="mt-1 text-sm text-slate-400">
              Acredita fondos a tu wallet de{" "}
              <span className="font-semibold text-green-300">{name}</span>
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-green-400/20 bg-green-400/10 text-xs font-bold text-green-300">
                {symbol.slice(0, 3)}
              </div>
              <div>
                <p className="text-sm font-medium">{name}</p>
                <p className="text-xs text-slate-500">
                  Balance actual:{" "}
                  {Number(wallet.balance).toLocaleString("en-US", {
                    maximumFractionDigits: 8,
                  })}{" "}
                  {symbol}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div>
              <label
                htmlFor="deposit-amount"
                className="text-xs font-medium uppercase tracking-wide text-slate-400"
              >
                Monto
              </label>
              <div className="relative mt-2">
                <input
                  id="deposit-amount"
                  type="number"
                  step="any"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  disabled={loading}
                  autoFocus
                  className="
                    h-12 w-full rounded-xl border border-white/10 bg-white/[0.03]
                    px-4 pr-16 text-sm text-white placeholder:text-slate-600
                    outline-none transition-all
                    focus:border-green-400/60 focus:bg-green-400/[0.04]
                    focus:shadow-[0_0_20px_rgba(34,197,94,0.15)]
                    disabled:opacity-50
                  "
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500">
                  {symbol}
                </span>
              </div>
            </div>

            <div>
              <label
                htmlFor="deposit-note"
                className="text-xs font-medium uppercase tracking-wide text-slate-400"
              >
                Nota (opcional)
              </label>
              <input
                id="deposit-note"
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ej: depósito inicial"
                disabled={loading}
                className="
                  mt-2 h-12 w-full rounded-xl border border-white/10 bg-white/[0.03]
                  px-4 text-sm text-white placeholder:text-slate-600
                  outline-none transition-all
                  focus:border-green-400/60 focus:bg-green-400/[0.04]
                  focus:shadow-[0_0_20px_rgba(34,197,94,0.15)]
                  disabled:opacity-50
                "
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <div className="mt-2 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="
                  h-12 flex-1 rounded-xl border border-white/10 bg-white/[0.03]
                  text-sm font-medium text-slate-300 transition-all
                  hover:border-white/20 hover:bg-white/[0.05]
                  disabled:opacity-40
                "
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={loading}
                className="
                  flex h-12 flex-1 items-center justify-center gap-2 rounded-xl
                  bg-green-400 text-sm font-semibold text-black transition-all
                  duration-300 disabled:cursor-not-allowed disabled:opacity-60
                  hover:bg-green-300 hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]
                  active:scale-[0.98]
                "
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                    Depositando...
                  </>
                ) : (
                  "Depositar"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
