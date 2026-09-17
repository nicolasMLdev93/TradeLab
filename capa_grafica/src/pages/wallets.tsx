import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiPlus,
  FiTrash2,
  FiUser,
  FiDownload,
  FiSend,
} from "react-icons/fi";
import { getWallets, deleteWallet, type Wallet } from "../api/walletApi";
import {
  getCurrenciesWithPrices,
  type CurrencyWithPrice,
} from "../api/currencyApi";
import DepositModal from "../components/deposit_modal";
import TransferModal from "../components/transfer_modal";

interface WalletsProps {
  onBack: () => void;
  onAddWallet: () => void;
}

export default function Wallets({ onBack, onAddWallet }: WalletsProps) {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [catalog, setCatalog] = useState<CurrencyWithPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [depositWallet, setDepositWallet] = useState<Wallet | null>(null);
  const [transferFrom, setTransferFrom] = useState<Wallet | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [walletsData, catalogData] = await Promise.all([
        getWallets(),
        getCurrenciesWithPrices(),
      ]);
      setWallets(walletsData);
      setCatalog(catalogData.currencies);
    } catch {
      setError("No se pudieron cargar las wallets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar esta wallet?")) return;
    setDeletingId(id);
    try {
      await deleteWallet(id);
      setWallets((prev) => prev.filter((w) => w.id !== id));
    } catch {
      alert("No se pudo eliminar la wallet.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleModalSuccess = async () => {
    setDepositWallet(null);
    setTransferFrom(null);
    await load();
  };

  const pricesBySymbol = new Map<string, CurrencyWithPrice>();
  for (const c of catalog) pricesBySymbol.set(c.symbol.toUpperCase(), c);

  const totalUsd = wallets.reduce((sum, w) => {
    const balance = Number(w.balance || 0);
    const symbol = w.currency?.symbol?.toUpperCase() ?? "";
    const price = pricesBySymbol.get(symbol);
    return sum + (price ? balance * price.usd : balance);
  }, 0);

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

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-green-300"
          >
            <FiArrowLeft size={16} />
            Volver
          </button>

          <button
            onClick={onAddWallet}
            className="flex items-center gap-2 rounded-lg bg-green-400 px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-green-300 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]"
          >
            <FiPlus size={14} />
            Nueva wallet
          </button>
        </header>

        <div className="mt-8">
          <h1 className="text-3xl font-bold tracking-tight">Mis wallets</h1>
          <p className="mt-1 text-sm text-slate-400">
            Total:{" "}
            <span className="font-semibold text-green-300">
              $
              {totalUsd.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="mt-6">
          {loading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-20 animate-pulse rounded-2xl bg-white/[0.03]"
                />
              ))}
            </div>
          ) : wallets.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-white/10 py-16 text-center">
              <FiUser size={32} className="text-slate-600" />
              <p className="mt-3 text-sm font-medium text-slate-300">
                No tienes wallets todavía
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Crea tu primera wallet para empezar a operar.
              </p>
              <button
                onClick={onAddWallet}
                className="mt-5 flex items-center gap-2 rounded-lg bg-green-400 px-4 py-2 text-xs font-semibold text-black transition-all hover:bg-green-300"
              >
                <FiPlus size={14} />
                Crear wallet
              </button>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {wallets.map((wallet) => {
                const symbol = wallet.currency?.symbol?.toUpperCase() ?? "—";
                const name = wallet.currency?.name ?? "Moneda";
                const balance = Number(wallet.balance || 0);
                const price = pricesBySymbol.get(symbol);
                const usd = price ? balance * price.usd : balance;
                const isCrypto = wallet.currency?.type === "crypto";

                return (
                  <li
                    key={wallet.id}
                    className="flex flex-col gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full border text-sm font-bold ${
                          isCrypto
                            ? "border-green-400/20 bg-green-400/10 text-green-300"
                            : "border-blue-400/20 bg-blue-400/10 text-blue-300"
                        }`}
                      >
                        {symbol.slice(0, 3)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{name}</p>
                        <p className="text-xs text-slate-500">
                          {balance.toLocaleString("en-US", {
                            maximumFractionDigits: 8,
                          })}{" "}
                          {symbol}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 lg:justify-end">
                      <div className="text-right">
                        <p className="text-sm font-semibold tabular-nums">
                          $
                          {usd.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                        {price && isCrypto && (
                          <p
                            className={`text-[11px] font-medium ${
                              price.change24h >= 0
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {price.change24h >= 0 ? "+" : ""}
                            {price.change24h.toFixed(2)}% 24h
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setDepositWallet(wallet)}
                          className="flex h-9 items-center gap-2 rounded-lg bg-green-400/10 px-3 text-xs font-semibold text-green-300 transition-all hover:bg-green-400/20"
                          title="Depositar"
                        >
                          <FiDownload size={14} />
                          Depositar
                        </button>

                        <button
                          onClick={() => setTransferFrom(wallet)}
                          disabled={wallets.length < 2}
                          className="flex h-9 items-center gap-2 rounded-lg bg-blue-400/10 px-3 text-xs font-semibold text-blue-300 transition-all hover:bg-blue-400/20 disabled:cursor-not-allowed disabled:opacity-40"
                          title={
                            wallets.length < 2
                              ? "Necesitas al menos 2 wallets"
                              : "Transferir"
                          }
                        >
                          <FiSend size={14} />
                          Transferir
                        </button>

                        <button
                          onClick={() => handleDelete(wallet.id)}
                          disabled={deletingId === wallet.id}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-500 transition-all hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40"
                          title="Eliminar"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {depositWallet && (
        <DepositModal
          wallet={depositWallet}
          onClose={() => setDepositWallet(null)}
          onSuccess={handleModalSuccess}
        />
      )}

      {transferFrom && (
        <TransferModal
          wallets={wallets}
          initialFromId={transferFrom.id}
          onClose={() => setTransferFrom(null)}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
}