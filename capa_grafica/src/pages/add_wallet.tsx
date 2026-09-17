import { useEffect, useState, type FormEvent } from "react";
import { FiArrowLeft, FiCheck } from "react-icons/fi";
import type { AxiosError } from "axios";
import { createWallet } from "../api/walletApi";
import {
  getCurrenciesWithPrices,
  type CurrencyWithPrice,
} from "../api/currencyApi";

interface AddWalletProps {
  onBack: () => void;
  onSuccess: () => void;
}

export default function AddWallet({ onBack, onSuccess }: AddWalletProps) {
  const [currencies, setCurrencies] = useState<CurrencyWithPrice[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getCurrenciesWithPrices();
        setCurrencies(data.currencies);
      } catch {
        setError("No se pudieron cargar las monedas.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectedId) {
      setError("Selecciona una moneda.");
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      await createWallet({
        currencyId: selectedId,
        address: address.trim() || undefined,
      });
      onSuccess();
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      setError(
        axiosErr.response?.data?.message ?? "No se pudo crear la wallet."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#030807] text-white">
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(34,197,94,0.6) 1px, transparent 1.5px)`,
          backgroundSize: "32px 32px",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,197,94,0.15),transparent_50%)]" />

      <div className="relative z-10 mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <button
          onClick={onBack}
          disabled={submitting}
          className="flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-green-300 disabled:opacity-40"
        >
          <FiArrowLeft size={16} />
          Volver
        </button>

        <div className="mt-8">
          <h1 className="text-3xl font-bold tracking-tight">Nueva wallet</h1>
          <p className="mt-1 text-sm text-slate-400">
            Elige una moneda y opcionalmente agrega una dirección.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 flex flex-col gap-6"
          noValidate
        >
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Moneda
            </label>

            {loading ? (
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-20 animate-pulse rounded-xl bg-white/[0.03]"
                  />
                ))}
              </div>
            ) : (
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {currencies.map((c) => {
                  const isActive = selectedId === c.id;
                  return (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => setSelectedId(c.id)}
                      disabled={submitting}
                      className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border p-4 transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
                        isActive
                          ? "border-green-400/60 bg-green-400/[0.08] text-green-300"
                          : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/20"
                      }`}
                    >
                      {isActive && (
                        <div className="absolute right-2 top-2 text-green-400">
                          <FiCheck size={14} />
                        </div>
                      )}
                      <span className="text-lg font-bold">
                        {c.symbol.slice(0, 3)}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {c.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="wallet-address"
              className="text-xs font-medium uppercase tracking-wide text-slate-400"
            >
              Dirección (opcional)
            </label>
            <input
              id="wallet-address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x..."
              disabled={submitting}
              className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white placeholder:text-slate-600 outline-none transition-all focus:border-green-400/60 focus:bg-green-400/[0.04] focus:shadow-[0_0_20px_rgba(34,197,94,0.15)] disabled:opacity-50"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || loading}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-green-400 text-sm font-semibold text-black transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 hover:bg-green-300 hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] active:scale-[0.98]"
          >
            {submitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                Creando...
              </>
            ) : (
              "Crear wallet"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}