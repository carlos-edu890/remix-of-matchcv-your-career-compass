import { Link, useRouterState } from "@tanstack/react-router";
import {
  Briefcase,
  FileText,
  LayoutDashboard,
  Menu,
  Send,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { profileCompleteness, useAppState } from "@/store/app-state";
import { Progress } from "@/components/ui/progress";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/vagas", label: "Vagas", icon: Briefcase },
  { to: "/curriculos", label: "Currículos", icon: FileText },
  { to: "/candidaturas", label: "Candidaturas", icon: Send },
  { to: "/perfil", label: "Perfil", icon: UserRound },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex flex-col gap-1">
      {navItems.map(({ to, label, icon: Icon }) => {
        const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="grid size-8 place-items-center rounded-lg bg-foreground text-background">
        <Sparkles className="size-4" aria-hidden="true" />
      </span>
      <span className="text-lg font-bold tracking-tight">
        Match<span className="text-primary">CV</span>
      </span>
    </Link>
  );
}

function CompletenessCard() {
  const { state } = useAppState();
  const pct = profileCompleteness(state);
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs font-medium text-muted-foreground">Perfil completo</p>
      <p className="mt-1 text-2xl font-bold">{pct}%</p>
      <Progress value={pct} className="mt-2 h-1.5" />
      {pct < 100 && (
        <Link to="/perfil" className="mt-3 inline-block text-xs font-medium text-primary">
          Completar perfil →
        </Link>
      )}
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/85 px-4 py-3 backdrop-blur lg:hidden">
        <Brand />
        <button
          type="button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((v) => !v)}
          className="rounded-md border border-border p-2"
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </header>

      {open && (
        <div className="border-b border-border bg-background px-4 py-3 lg:hidden">
          <NavLinks onNavigate={() => setOpen(false)} />
        </div>
      )}

      <div className="mx-auto flex w-full max-w-[1400px]">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-6 border-r border-border px-5 py-6 lg:flex">
          <Brand />
          <NavLinks />
          <div className="mt-auto">
            <CompletenessCard />
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-10">{children}</main>
      </div>
    </div>
  );
}
