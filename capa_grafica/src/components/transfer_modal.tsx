import { useState, type FormEvent } from "react";
import {
  FiX,
  FiArrowRight,
  FiAlertTriangle,
  FiCheckCircle,
} from "react-icons/fi";
import type { AxiosError } from "axios";
import { transferBetweenWallets } from "../api/transactionApi";
import type { Wallet } from "../api/walletApi";

interface TransferModalProps {
  wallets: Wallet[];
  initialFromId?: number;
  onClose: () => void;
  onSuccess: () => void;
}

type Step = "form" | "confirm" | "sending" | "success";

export default function TransferModal({
  wallets,
  initialFromId,
  onClose,
  onSuccess,
}: TransferModalProps) {
  const [step, setStep] = useState<Step>("form");
  const [fromId, setFromId] = useState<number | null>(
    initialFromId ?? wallets[0]?.id ?? null,
  );
  const [toId, setToId] = useState<number | null>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fromWallet = wallets.find((w) => w.id === fromId);
  const toWallet = wallets.find((w) => w.id === toId);
  const symbol = fromWallet?.currency?.symbol?.toUpperCase() ?? "—";
  const availableBalance = Number(fromWallet?.balance ?? 0);

  const sameCurrencyWallets = wallets.filter(
    (w) => w.id !== fromId && w.currencyId === fromWallet?.currencyId,
  );

  const isSending = step === "sending";

  const handleFromChange = (id: number) => {
    if (isSending) return;
    setFromId(id);
    setToId(null);
    setError(null);
  };

  const validate = (): string | null => {
    if (!fromId) return "Selecciona una wallet de origen.";
    if (!toId) return "Selecciona una wallet de destino.";
    const numeric = Number(amount);
    if (!amount || Number.isNaN(numeric) || numeric <= 0) {
      return "Ingresa un monto válido mayor a 0.";
    }
    if (numeric > availableBalance) {
      return "Fondos insuficientes.";
    }
    return null;
  };

  const handleContinue = (e: FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setStep("confirm");
  };

  const handleConfirm = async () => {
    if (!fromId || !toId) return;

    setStep("sending");
    setError(null);

    try {
      await transferBetweenWallets({
        fromWalletId: fromId,
        toWalletId: toId,
        amount,
        note: note.trim() || undefined,
      });

      setSuccessMessage(
        `Transferiste ${Number(amount).toLocaleString("en-US", {
          maximumFractionDigits: 8,
        })} ${symbol}`,
      );
      setStep("success");

      setTimeout(() => {
        onSuccess();
      }, 1600);
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      setError(
        axiosErr.response?.data?.message ??
          "No se pudo realizar la transferencia.",
      );
      setStep("form");
    }
  };

  const handleBackdropClick = () => {
    if (isSending) return;
    onClose();
  };

  const handleCloseClick = () => {
    if (isSending) return;
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm ${
        isSending ? "cursor-wait" : ""
      }`}
      onClick={handleBackdropClick}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-[1px] backdrop-blur-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative rounded-3xl bg-[#06100e]/95 p-8">
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-green-400/60 to-transparent" />

          {!isSending && step !== "success" && (
            <button
              onClick={handleCloseClick}
              className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:text-green-300"
              aria-label="Cerrar"
            >
              <FiX size={18} />
            </button>
          )}

          {step === "form" && (
            <FormStep
              wallets={wallets}
              sameCurrencyWallets={sameCurrencyWallets}
              fromId={fromId}
              toId={toId}
              amount={amount}
              note={note}
              symbol={symbol}
              availableBalance={availableBalance}
              error={error}
              onFromChange={handleFromChange}
              onToChange={(id) => {
                setToId(id);
                setError(null);
              }}
              onAmountChange={(v) => {
                setAmount(v);
                setError(null);
              }}
              onNoteChange={setNote}
              onSubmit={handleContinue}
              onClose={onClose}
            />
          )}

          {step === "confirm" && fromWallet && toWallet && (
            <ConfirmStep
              amount={amount}
              symbol={symbol}
              fromWallet={fromWallet}
              toWallet={toWallet}
              note={note}
              onBack={() => setStep("form")}
              onConfirm={handleConfirm}
            />
          )}

          {step === "sending" && (
            <SendingStep symbol={symbol} amount={amount} />
          )}

          {step === "success" && successMessage && (
            <SuccessStep message={successMessage} />
          )}
        </div>
      </div>
    </div>
  );
}

function FormStep({
  wallets,
  sameCurrencyWallets,
  fromId,
  toId,
  amount,
  note,
  symbol,
  availableBalance,
  error,
  onFromChange,
  onToChange,
  onAmountChange,
  onNoteChange,
  onSubmit,
  onClose,
}: {
  wallets: Wallet[];
  sameCurrencyWallets: Wallet[];
  fromId: number | null;
  toId: number | null;
  amount: string;
  note: string;
  symbol: string;
  availableBalance: number;
  error: string | null;
  onFromChange: (id: number) => void;
  onToChange: (id: number) => void;
  onAmountChange: (v: string) => void;
  onNoteChange: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
  onClose: () => void;
}) {
  return (
    <>
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Transferir</h2>
        <p className="mt-1 text-sm text-slate-400">
          Mueve fondos entre tus wallets de la misma moneda.
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Desde
          </label>
          <select
            value={fromId ?? ""}
            onChange={(e) => onFromChange(Number(e.target.value))}
            className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition-all focus:border-green-400/60"
          >
            {wallets.map((w) => (
              <option key={w.id} value={w.id} className="bg-[#06100e]">
                {w.currency?.name ?? "Moneda"} (
                {w.currency?.symbol?.toUpperCase() ?? "—"}) ·{" "}
                {Number(w.balance).toLocaleString("en-US", {
                  maximumFractionDigits: 8,
                })}
              </option>
            ))}
          </select>
          <p className="mt-1 text-[11px] text-slate-500">
            Disponible:{" "}
            <span className="font-semibold text-green-300">
              {availableBalance.toLocaleString("en-US", {
                maximumFractionDigits: 8,
              })}{" "}
              {symbol}
            </span>
          </p>
        </div>

        <div className="flex justify-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-green-400/20 bg-green-400/10 text-green-400">
            <FiArrowRight size={14} />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Hacia
          </label>
          {sameCurrencyWallets.length === 0 ? (
            <div className="mt-2 rounded-xl border border-dashed border-white/10 px-4 py-3 text-xs text-slate-500">
              No tienes otra wallet de {symbol} para transferir.
            </div>
          ) : (
            <select
              value={toId ?? ""}
              onChange={(e) => onToChange(Number(e.target.value))}
              className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition-all focus:border-green-400/60"
            >
              <option value="" className="bg-[#06100e]">
                Selecciona una wallet...
              </option>
              {sameCurrencyWallets.map((w) => (
                <option key={w.id} value={w.id} className="bg-[#06100e]">
                  {w.address
                    ? `${w.address.slice(0, 10)}...${w.address.slice(-6)}`
                    : `Wallet #${w.id}`}{" "}
                  ·{" "}
                  {Number(w.balance).toLocaleString("en-US", {
                    maximumFractionDigits: 8,
                  })}{" "}
                  {symbol}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label
            htmlFor="transfer-amount"
            className="text-xs font-medium uppercase tracking-wide text-slate-400"
          >
            Monto
          </label>
          <div className="relative mt-2">
            <input
              id="transfer-amount"
              type="number"
              step="any"
              min="0"
              value={amount}
              onChange={(e) => onAmountChange(e.target.value)}
              placeholder="0.00"
              className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 pr-16 text-sm text-white placeholder:text-slate-600 outline-none transition-all focus:border-green-400/60 focus:bg-green-400/[0.04] focus:shadow-[0_0_20px_rgba(34,197,94,0.15)]"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500">
              {symbol}
            </span>
          </div>
          {availableBalance > 0 && (
            <button
              type="button"
              onClick={() => onAmountChange(String(availableBalance))}
              className="mt-2 text-[11px] font-medium text-green-400 transition-colors hover:text-green-300"
            >
              Usar todo el balance
            </button>
          )}
        </div>

        <div>
          <label
            htmlFor="transfer-note"
            className="text-xs font-medium uppercase tracking-wide text-slate-400"
          >
            Nota (opcional)
          </label>
          <input
            id="transfer-note"
            type="text"
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
            placeholder="Ej: mover a otra wallet"
            className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white placeholder:text-slate-600 outline-none transition-all focus:border-green-400/60 focus:bg-green-400/[0.04] focus:shadow-[0_0_20px_rgba(34,197,94,0.15)]"
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
            className="h-12 flex-1 rounded-xl border border-white/10 bg-white/[0.03] text-sm font-medium text-slate-300 transition-all hover:border-white/20 hover:bg-white/[0.05]"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={sameCurrencyWallets.length === 0}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-green-400 text-sm font-semibold text-black transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 hover:bg-green-300 hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] active:scale-[0.98]"
          >
            Continuar
          </button>
        </div>
      </form>
    </>
  );
}

function ConfirmStep({
  amount,
  symbol,
  fromWallet,
  toWallet,
  note,
  onBack,
  onConfirm,
}: {
  amount: string;
  symbol: string;
  fromWallet: Wallet;
  toWallet: Wallet;
  note: string;
  onBack: () => void;
  onConfirm: () => void;
}) {
  const fromLabel = fromWallet.address
    ? `${fromWallet.address.slice(0, 10)}...${fromWallet.address.slice(-6)}`
    : `Wallet #${fromWallet.id}`;

  const toLabel = toWallet.address
    ? `${toWallet.address.slice(0, 10)}...${toWallet.address.slice(-6)}`
    : `Wallet #${toWallet.id}`;

  return (
    <>
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-yellow-400/30 bg-yellow-400/10 text-yellow-400">
          <FiAlertTriangle size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight">
            ¿Confirmar transferencia?
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Revisa los datos antes de continuar.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Monto</span>
          <span className="font-semibold text-white tabular-nums">
            {Number(amount).toLocaleString("en-US", {
              maximumFractionDigits: 8,
            })}{" "}
            {symbol}
          </span>
        </div>

        <div className="h-px bg-white/[0.06]" />

        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Desde</span>
          <span className="font-medium text-white">{fromLabel}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Hacia</span>
          <span className="font-medium text-white">{toLabel}</span>
        </div>

        {note && (
          <>
            <div className="h-px bg-white/[0.06]" />
            <div className="flex flex-col gap-1 text-sm">
              <span className="text-slate-400">Nota</span>
              <span className="text-white">{note}</span>
            </div>
          </>
        )}
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="h-12 flex-1 rounded-xl border border-white/10 bg-white/[0.03] text-sm font-medium text-slate-300 transition-all hover:border-white/20 hover:bg-white/[0.05]"
        >
          Volver
        </button>

        <button
          type="button"
          onClick={onConfirm}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-green-400 text-sm font-semibold text-black transition-all duration-300 hover:bg-green-300 hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] active:scale-[0.98]"
        >
          Confirmar
        </button>
      </div>
    </>
  );
}

function SendingStep({ amount, symbol }: { amount: string; symbol: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="relative">
        <div className="absolute inset-0 animate-ping rounded-full bg-green-400/20" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-green-400/30 bg-green-400/10">
          <span className="h-10 w-10 animate-spin rounded-full border-2 border-green-400/20 border-t-green-400" />
        </div>
      </div>

      <h2 className="mt-6 text-xl font-bold tracking-tight">
        Transfiriendo...
      </h2>

      <p className="mt-2 text-sm text-slate-400">
        Enviando{" "}
        <span className="font-semibold text-green-300">
          {Number(amount).toLocaleString("en-US", {
            maximumFractionDigits: 8,
          })}{" "}
          {symbol}
        </span>
      </p>

      <p className="mt-4 max-w-xs text-xs text-slate-500">
        No cierres esta ventana. La operación se está procesando.
      </p>
    </div>
  );
}

function SuccessStep({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="relative">
        <div className="absolute inset-0 animate-pulse rounded-full bg-green-400/20 blur-xl" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-green-400/40 bg-green-400/20 text-green-300">
          <FiCheckCircle size={36} />
        </div>
      </div>

      <h2 className="mt-6 text-xl font-bold tracking-tight">
        ¡Transferencia exitosa!
      </h2>

      <p className="mt-2 text-sm text-slate-400">{message}</p>
    </div>
  );
}
