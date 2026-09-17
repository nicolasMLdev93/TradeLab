import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiArrowUpRight,
  FiArrowDownLeft,
  FiRepeat,
  FiFilter,
} from "react-icons/fi";
import {
  getTransactions,
  type Transaction,
  type TransactionStatus,
  type TransactionType,
} from "../api/transactionApi";

interface TransactionsProps {
  onBack: () => void;
}

const STATUS_OPTIONS: { value: TransactionStatus | ""; label: string }[] = [
  { value: "", label: "Todos" },
  { value: "pending", label: "Pendientes" },
  { value: "completed", label: "Completadas" },
  { value: "failed", label: "Fallidas" },
  { value: "cancelled", label: "Canceladas" },
];

const TYPE_OPTIONS: { value: TransactionType | ""; label: string }[] = [
  { value: "", label: "Todos" },
  { value: "buy", label: "Compra" },
  { value: "sell", label: "Venta" },
  { value: "deposit", label: "Depósito" },
  { value: "withdrawal", label: "Retiro" },
  { value: "transfer_in", label: "Recibida" },
  { value: "transfer_out", label: "Enviada" },
];

export default function Transactions({ onBack }: TransactionsProps) {
  const [items, setItems] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState<TransactionStatus | "">("");
  const [type, setType] = useState<TransactionType | "">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getTransactions({
          status: status || undefined,
          type: type || undefined,
          limit: 50,
        });
        setItems(data.items);
        setTotal(data.total);
      } catch {
        setError("No se pudieron cargar las transacciones.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [status, type]);

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
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-green-300"
        >
          <FiArrowLeft size={16} />
          Volver
        </button>

        <div className="mt-8">
          <h1 className="text-3xl font-bold tracking-tight">Transacciones</h1>
          <p className="mt-1 text-sm text-slate-400">
            {total} {total === 1 ? "movimiento" : "movimientos"}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <FiFilter size={14} />
            Filtros:
          </div>

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as TransactionStatus | "")
            }
            className="h-9 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-xs text-white outline-none transition-all focus:border-green-400/60"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className="bg-[#06100e]">
                {o.label}
              </option>
            ))}
          </select>

          <select
            value={type}
            onChange={(e) => setType(e.target.value as TransactionType | "")}
            className="h-9 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-xs text-white outline-none transition-all focus:border-green-400/60"
          >
            {TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className="bg-[#06100e]">
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="mt-6">
          {loading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-20 animate-pulse rounded-2xl bg-white/[0.03]"
                />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-white/10 py-16 text-center">
              <FiRepeat size={32} className="text-slate-600" />
              <p className="mt-3 text-sm font-medium text-slate-300">
                Sin movimientos
              </p>
              <p className="mt-1 text-xs text-slate-500">
                No hay transacciones que coincidan con los filtros.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {items.map((tx) => {
                const isIncoming = ["deposit", "buy", "transfer_in"].includes(
                  tx.type,
                );
                const config = isIncoming
                  ? {
                      icon: <FiArrowDownLeft size={16} />,
                      color: "text-green-400",
                      bg: "bg-green-400/10",
                      sign: "+",
                    }
                  : {
                      icon: <FiArrowUpRight size={16} />,
                      color: "text-red-400",
                      bg: "bg-red-400/10",
                      sign: "-",
                    };

                const statusColor: Record<TransactionStatus, string> = {
                  pending:
                    "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
                  completed:
                    "text-green-400 border-green-400/30 bg-green-400/10",
                  failed: "text-red-400 border-red-400/30 bg-red-400/10",
                  cancelled: "text-slate-400 border-white/10 bg-white/[0.03]",
                };

                return (
                  <li
                    key={tx.id}
                    className="flex items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 transition-colors hover:border-green-400/20"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-full ${config.bg} ${config.color}`}
                      >
                        {config.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium capitalize">
                          {translateType(tx.type)}
                        </p>
                        <p className="text-xs text-slate-500">
                          {formatDate(tx.createdAt)}
                          {tx.note && ` · ${tx.note}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p
                          className={`text-sm font-semibold tabular-nums ${config.color}`}
                        >
                          {config.sign}
                          {Number(tx.amount).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 8,
                          })}
                        </p>
                        {tx.price && (
                          <p className="text-[11px] text-slate-500">
                            @ $
                            {Number(tx.price).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        )}
                      </div>

                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide ${
                          statusColor[tx.status]
                        }`}
                      >
                        {tx.status}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function translateType(type: TransactionType): string {
  const map: Record<TransactionType, string> = {
    buy: "Compra",
    sell: "Venta",
    deposit: "Depósito",
    withdrawal: "Retiro",
    transfer_in: "Transferencia recibida",
    transfer_out: "Transferencia enviada",
  };
  return map[type] ?? type;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
