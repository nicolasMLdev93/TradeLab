import { useEffect, useState, useMemo, type ReactNode } from "react";
import {
  FiLogOut,
  FiPlus,
  FiArrowUpRight,
  FiArrowDownLeft,
  FiRepeat,
  FiUser,
  FiRefreshCw,
  FiTrendingUp,
  FiTrendingDown,
  FiChevronRight,
} from "react-icons/fi";
import { logout, getStoredUser, type AuthUser } from "../api/authApi";
import { getWallets, type Wallet } from "../api/walletApi";
import { getTransactions, type Transaction } from "../api/transactionApi";
import {
  getCurrenciesWithPrices,
  type CurrencyWithPrice,
} from "../api/currencyApi";
import Logo from "../images/app_logo.png";

interface HomeProps {
  onLogout: () => void;
  onAddWallet: () => void;
  onViewAllWallets: () => void;
  onViewAllTransactions: () => void;
}

interface WalletWithUsd extends Wallet {
  balanceNum: number;
  usdValue: number;
  change24h: number;
  isCrypto: boolean;
}

const LOGOUT_DELAY_MS = 1200;

export default function Home({
  onLogout,
  onAddWallet,
  onViewAllWallets,
  onViewAllTransactions,
}: HomeProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [catalog, setCatalog] = useState<CurrencyWithPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    setError(null);

    try {
      const [walletsData, txData, catalogData] = await Promise.all([
        getWallets(),
        getTransactions({ limit: 5 }),
        getCurrenciesWithPrices(),
      ]);

      setWallets(walletsData);
      setTransactions(txData.items);
      setCatalog(catalogData.currencies);
    } catch {
      setError("No se pudieron cargar los datos. Intenta de nuevo.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setUser(getStoredUser());
    loadData();
  }, []);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);

    try {
      await logout();
    } catch {
      // 
    }

    setTimeout(() => {
      onLogout();
    }, LOGOUT_DELAY_MS);
  };

  const pricesBySymbol = useMemo(() => {
    const map = new Map<string, CurrencyWithPrice>();
    for (const c of catalog) {
      map.set(c.symbol.toUpperCase(), c);
    }
    return map;
  }, [catalog]);

  const walletsWithUsd = useMemo<WalletWithUsd[]>(() => {
    return wallets.map((w) => {
      const balanceNum = Number(w.balance || 0);
      const symbol = w.currency?.symbol?.toUpperCase() ?? "";
      const price = pricesBySymbol.get(symbol);

      const usdValue = price ? balanceNum * price.usd : balanceNum;
      const change24h = price?.change24h ?? 0;
      const isCrypto = w.currency?.type === "crypto";

      return { ...w, balanceNum, usdValue, change24h, isCrypto };
    });
  }, [wallets, pricesBySymbol]);

  const totalBalance = walletsWithUsd.reduce((sum, w) => sum + w.usdValue, 0);

  const totalChange24h = walletsWithUsd.reduce(
    (sum, w) => sum + (w.usdValue * w.change24h) / 100,
    0,
  );

  const changePercent =
    totalBalance - totalChange24h > 0
      ? (totalChange24h / (totalBalance - totalChange24h)) * 100
      : 0;

  const incomingCount = transactions.filter((t) =>
    ["deposit", "buy", "transfer_in"].includes(t.type),
  ).length;

  const outgoingCount = transactions.filter((t) =>
    ["withdrawal", "sell", "transfer_out"].includes(t.type),
  ).length;

  const cryptosCount = walletsWithUsd.filter((w) => w.isCrypto).length;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030807] text-white">
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `
            radial-gradient(circle, rgba(34,197,94,0.6) 1px, transparent 1.5px)
          `,
          backgroundSize: "32px 32px",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,197,94,0.15),transparent_50%)]" />
      <div className="pointer-events-none absolute -left-32 top-1/3 h-[500px] w-[500px] rounded-full bg-green-500/[0.05] blur-[160px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-green-400/20 blur-xl" />
              <img
                src={Logo}
                alt="TradeLab"
                className="relative h-10 w-10 object-contain"
              />
            </div>
            <span className="text-lg font-semibold tracking-tight">
              TradeLab
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => loadData(true)}
              disabled={refreshing || loggingOut}
              title="Recargar precios"
              className="
                flex h-9 w-9 items-center justify-center rounded-lg
                border border-white/10 bg-white/[0.03] text-slate-400
                transition-all hover:border-green-400/40 hover:text-green-300
                disabled:opacity-40
              "
            >
              <FiRefreshCw
                size={15}
                className={refreshing ? "animate-spin" : ""}
              />
            </button>

            <div className="hidden items-center gap-2 sm:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
                <FiUser size={16} className="text-green-400" />
              </div>
              <div className="text-sm">
                <p className="font-medium leading-tight">
                  {user?.username ?? "Usuario"}
                </p>
                <p className="text-xs text-slate-500">{user?.email ?? ""}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="
                flex min-w-[92px] items-center justify-center gap-2 rounded-lg border
                border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-300
                transition-all hover:border-red-500/40 hover:bg-red-500/10
                hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-60
              "
            >
              {loggingOut ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-500/30 border-t-red-400" />
                  <span className="hidden sm:inline">Saliendo...</span>
                </>
              ) : (
                <>
                  <FiLogOut size={15} />
                  <span className="hidden sm:inline">Salir</span>
                </>
              )}
            </button>
          </div>
        </header>

        <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="bg-gradient-to-b from-white to-white/70 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
              Hola, {user?.username ?? "bienvenido"}
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Aquí tienes el resumen de tu portafolio.
            </p>
          </div>

          <button
            onClick={onAddWallet}
            disabled={loggingOut}
            className="
              flex items-center justify-center gap-2 rounded-xl bg-green-400
              px-5 py-3 text-sm font-semibold text-black
              transition-all duration-300
              hover:bg-green-300 hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]
              active:scale-[0.98] disabled:opacity-60
            "
          >
            <FiPlus size={16} />
            Nueva wallet
          </button>
        </div>

        <div
          className="
            relative mt-8 overflow-hidden rounded-3xl border border-green-400/20
            bg-gradient-to-br from-green-400/[0.08] via-transparent to-transparent
            p-8
          "
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-green-400/10 blur-[80px]" />

          <div className="relative">
            <p className="text-xs font-medium uppercase tracking-wide text-green-300/80">
              Balance total (USD)
            </p>

            <div className="mt-3 flex flex-wrap items-end gap-4">
              <p className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                $
                {totalBalance.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>

              {totalChange24h !== 0 && (
                <span
                  className={`
                    flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold
                    ${
                      totalChange24h >= 0
                        ? "bg-green-400/10 text-green-300"
                        : "bg-red-400/10 text-red-300"
                    }
                  `}
                >
                  {totalChange24h >= 0 ? (
                    <FiTrendingUp size={12} />
                  ) : (
                    <FiTrendingDown size={12} />
                  )}
                  {totalChange24h >= 0 ? "+" : ""}
                  {totalChange24h.toFixed(2)} USD (
                  {changePercent >= 0 ? "+" : ""}
                  {changePercent.toFixed(2)}%)
                </span>
              )}
            </div>

            <p className="mt-2 text-xs text-slate-500">
              {catalog.length > 0
                ? "Precios en vivo · CoinGecko"
                : "Cargando precios..."}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Wallets"
            value={String(wallets.length)}
            icon={<FiTrendingUp size={16} />}
            hint={wallets.length === 0 ? "Crea la primera" : "Activas"}
          />
          <StatCard
            label="Crypto"
            value={String(cryptosCount)}
            icon={<FiTrendingUp size={16} />}
            hint="Monedas digitales"
          />
          <StatCard
            label="Ingresos"
            value={String(incomingCount)}
            icon={<FiArrowDownLeft size={16} />}
            hint="Últimas transacciones"
          />
          <StatCard
            label="Egresos"
            value={String(outgoingCount)}
            icon={<FiArrowUpRight size={16} />}
            hint="Últimas transacciones"
          />
        </div>

        {error && (
          <div className="mt-6 flex items-center justify-between rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            <span>{error}</span>
            <button
              onClick={() => loadData()}
              className="text-xs font-semibold underline hover:no-underline"
            >
              Reintentar
            </button>
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-5">
          <section className="lg:col-span-3">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Mis wallets</h2>
                  <p className="text-xs text-slate-500">
                    {wallets.length === 0
                      ? "Aún no tienes wallets"
                      : `${wallets.length} ${
                          wallets.length === 1 ? "wallet" : "wallets"
                        } activas`}
                  </p>
                </div>
                {wallets.length > 0 && (
                  <button
                    onClick={onViewAllWallets}
                    className="flex items-center gap-1 text-xs text-green-400 transition-colors hover:text-green-300"
                  >
                    Ver todas
                    <FiChevronRight size={14} />
                  </button>
                )}
              </div>

              <div className="mt-5">
                {loading ? (
                  <SkeletonRows />
                ) : walletsWithUsd.length === 0 ? (
                  <EmptyState
                    title="Sin wallets todavía"
                    description="Crea tu primera wallet para empezar a operar."
                    actionLabel="Crear wallet"
                    onAction={onAddWallet}
                  />
                ) : (
                  <ul className="flex flex-col gap-3">
                    {walletsWithUsd.slice(0, 5).map((wallet) => (
                      <WalletRow key={wallet.id} wallet={wallet} />
                    ))}
                  </ul>
                )}
              </div>
            </Card>
          </section>

          <section className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Reciente</h2>
                  <p className="text-xs text-slate-500">Últimos movimientos</p>
                </div>
                {transactions.length > 0 && (
                  <button
                    onClick={onViewAllTransactions}
                    className="flex items-center gap-1 text-xs text-green-400 transition-colors hover:text-green-300"
                  >
                    Ver todo
                    <FiChevronRight size={14} />
                  </button>
                )}
              </div>

              <div className="mt-5">
                {loading ? (
                  <SkeletonRows />
                ) : transactions.length === 0 ? (
                  <EmptyState
                    title="Sin movimientos"
                    description="Tus transacciones aparecerán aquí."
                  />
                ) : (
                  <ul className="flex flex-col gap-4">
                    {transactions.map((tx) => (
                      <TransactionRow key={tx.id} tx={tx} />
                    ))}
                  </ul>
                )}
              </div>
            </Card>
          </section>
        </div>

        <p className="mt-12 text-center text-xs text-slate-600">
          © 2025 TradeLab · Precios por{" "}
          <a
            href="https://www.coingecko.com"
            target="_blank"
            rel="noreferrer"
            className="text-green-400 hover:underline"
          >
            CoinGecko
          </a>
        </p>
      </div>

      {loggingOut && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <span className="h-10 w-10 animate-spin rounded-full border-2 border-green-400/20 border-t-green-400" />
            <p className="text-sm text-slate-300">Cerrando sesión...</p>
          </div>
        </div>
      )}
    </div>
  );
}

function Card({ children }: { children: ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-[1px] backdrop-blur-2xl">
      <div className="relative h-full rounded-2xl bg-[#06100e]/95 p-6">
        {children}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  hint,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
  hint?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-5 backdrop-blur-2xl transition-all duration-300 hover:border-white/[0.15]">
      <div className="relative flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>
        {icon && <span className="text-slate-500">{icon}</span>}
      </div>
      <p className="relative mt-2 text-2xl font-bold tracking-tight text-white">
        {value}
      </p>
      {hint && (
        <p className="relative mt-1 text-[11px] text-slate-500">{hint}</p>
      )}
    </div>
  );
}

function WalletRow({ wallet }: { wallet: WalletWithUsd }) {
  const symbol = wallet.currency?.symbol?.toUpperCase() ?? "—";
  const name = wallet.currency?.name ?? "Moneda";

  return (
    <li className="group flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 transition-all duration-200 hover:border-green-400/20 hover:bg-green-400/[0.03]">
      <div className="flex items-center gap-3">
        <div
          className={`
            flex h-10 w-10 items-center justify-center rounded-full border text-xs font-bold uppercase
            ${
              wallet.isCrypto
                ? "border-green-400/20 bg-green-400/10 text-green-300"
                : "border-blue-400/20 bg-blue-400/10 text-blue-300"
            }
          `}
        >
          {symbol.slice(0, 3)}
        </div>
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-slate-500">
            {wallet.balanceNum.toLocaleString("en-US", {
              maximumFractionDigits: 8,
            })}{" "}
            {symbol}
          </p>
        </div>
      </div>

      <div className="text-right">
        <p className="text-sm font-semibold tabular-nums">
          $
          {wallet.usdValue.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
        {wallet.isCrypto && wallet.change24h !== 0 && (
          <p
            className={`text-[11px] font-medium ${
              wallet.change24h >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {wallet.change24h >= 0 ? "+" : ""}
            {wallet.change24h.toFixed(2)}% 24h
          </p>
        )}
      </div>
    </li>
  );
}

function TransactionRow({ tx }: { tx: Transaction }) {
  const config = getTxConfig(tx.type);

  return (
    <li className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-full ${config.bg} ${config.color}`}
        >
          {config.icon}
        </div>
        <div>
          <p className="text-sm font-medium capitalize">
            {translateType(tx.type)}
          </p>
          <p className="text-xs text-slate-500">{formatDate(tx.createdAt)}</p>
        </div>
      </div>

      <div className="text-right">
        <p className={`text-sm font-semibold tabular-nums ${config.color}`}>
          {config.sign}
          {Number(tx.amount).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 8,
          })}
        </p>
        <StatusBadge status={tx.status} />
      </div>
    </li>
  );
}

function StatusBadge({ status }: { status: Transaction["status"] }) {
  const styles: Record<Transaction["status"], string> = {
    pending: "text-yellow-400",
    completed: "text-green-400",
    failed: "text-red-400",
    cancelled: "text-slate-500",
  };

  return (
    <p className={`text-[10px] uppercase tracking-wide ${styles[status]}`}>
      {status}
    </p>
  );
}

function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 py-10 text-center">
      <p className="text-sm font-medium text-slate-300">{title}</p>
      <p className="mt-1 max-w-xs text-xs text-slate-500">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 flex items-center gap-2 rounded-lg bg-green-400 px-3 py-1.5 text-xs font-semibold text-black transition-all hover:bg-green-300"
        >
          <FiPlus size={14} />
          {actionLabel}
        </button>
      )}
    </div>
  );
}

function SkeletonRows({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-16 animate-pulse rounded-xl bg-white/[0.03]"
        />
      ))}
    </div>
  );
}

function getTxConfig(type: Transaction["type"]) {
  switch (type) {
    case "deposit":
    case "buy":
    case "transfer_in":
      return {
        icon: <FiArrowDownLeft size={15} />,
        color: "text-green-400",
        bg: "bg-green-400/10",
        sign: "+",
      };
    case "withdrawal":
    case "sell":
    case "transfer_out":
      return {
        icon: <FiArrowUpRight size={15} />,
        color: "text-red-400",
        bg: "bg-red-400/10",
        sign: "-",
      };
    default:
      return {
        icon: <FiRepeat size={15} />,
        color: "text-slate-400",
        bg: "bg-slate-400/10",
        sign: "",
      };
  }
}

function translateType(type: Transaction["type"]): string {
  const map: Record<Transaction["type"], string> = {
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
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Ahora";
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours} h`;
  if (diffDays < 7) return `Hace ${diffDays} d`;

  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
  });
}
