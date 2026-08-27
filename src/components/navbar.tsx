"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Briefcase,
  GraduationCap,
  Activity,
  HouseIcon,
  LogOut,
} from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { fontiSincronizzate } from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { id: "home", label: "Home", short: "Home", href: "/", icon: Home },
  { id: "work", label: "Lavoro", short: "Lavoro", href: "/work", icon: Briefcase },
  { id: "uni", label: "Università", short: "Uni", href: "/uni", icon: GraduationCap },
  { id: "sport", label: "Sport", short: "Sport", href: "/sport", icon: Activity },
  { id: "house", label: "Casa", short: "Casa", href: "/house", icon: HouseIcon },
] as const;

type NavId = (typeof NAV_ITEMS)[number]["id"];

function resolveActiveId(pathname: string): NavId | null {
  if (pathname === "/") return "home";
  const found = NAV_ITEMS.find(
    (item) => item.href !== "/" && (pathname === item.href || pathname.startsWith(`${item.href}/`))
  );
  return found ? found.id : null;
}

function AuthControl({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (!ready) {
    return <div className="h-9 w-9 animate-pulse rounded-full bg-white/10" />;
  }

  const user = session?.user;

  if (!user) {
    return (
      <Button size={compact ? "sm" : "default"} onClick={() => router.push("/login")}>
        Accedi
      </Button>
    );
  }

  const email = user.email ?? "";
  const avatarUrl = user.user_metadata?.avatar_url as string | undefined;
  const initial = email ? email[0]!.toUpperCase() : "?";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full outline-none">
        <Avatar size="sm" className="cursor-pointer">
          {avatarUrl && <AvatarImage src={avatarUrl} alt={email} />}
          <AvatarFallback>{initial}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="jarvis-panel min-w-56 rounded-2xl text-white">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="text-xs font-normal text-white/50">Accesso effettuato come</span>
          <span className="truncate text-sm">{email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleLogout}>
          <LogOut className="size-4" />
          Esci
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Nav() {
  const pathname = usePathname();

  if (pathname?.startsWith("/login")) return null;

  const activeId = resolveActiveId(pathname ?? "");

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-[252px] flex-none flex-col gap-[18px] overflow-y-auto p-4 md:flex">
        <div className="flex items-center gap-3 px-3 pt-2 pb-3.5">
          <span className="flex h-[34px] w-[34px] items-center justify-center rounded-xl bg-gradient-to-br from-[#ff8b6f] to-[#e8492a] text-[15px] font-semibold text-[#200904] shadow-[0_6px_18px_rgba(232,73,42,.45),inset_0_1px_0_rgba(255,255,255,.35)]">
            J
          </span>
          <span className="flex flex-col leading-tight">
            <b className="text-[15px] tracking-tight">Jarvis</b>
            <span className="text-[11px] text-white/50">Dashboard di Mattia</span>
          </span>
        </div>

        <nav className="jarvis-panel flex flex-col gap-1.5 rounded-[20px] p-2.5">
          {NAV_ITEMS.map((item) => {
            const isActive = activeId === item.id;
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                className="flex min-h-[44px] items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/8 hover:text-white"
              >
                <span
                  className="h-[22px] w-1.5 flex-none rounded-full"
                  style={
                    isActive
                      ? {
                          background: "linear-gradient(180deg,#ffa48c,#f2603c)",
                          boxShadow: "0 0 12px rgba(242,96,60,.7)",
                        }
                      : { background: "rgba(255,255,255,.10)" }
                  }
                />
                <Icon className="size-4 flex-none" />
                <span className="flex-1">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="jarvis-panel flex flex-col gap-2.5 rounded-[20px] p-4">
          <span className="text-[11px] tracking-[.1em] text-white/48 uppercase">
            Sincronizzato
          </span>
          {fontiSincronizzate.map((f) => (
            <div key={f.nome} className="flex items-center justify-between gap-2 text-xs">
              <span className="text-white/78">{f.nome}</span>
              <span className="text-[11px] text-white/45">{f.quando}</span>
            </div>
          ))}
        </div>

        <div className="flex-1" />
        <AuthControl />
      </aside>

      {/* Mobile bottom nav */}
      <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 pt-3 pb-[22px] md:hidden">
        <nav className="jarvis-panel flex gap-1 rounded-[22px] p-2">
          {NAV_ITEMS.map((item) => {
            const isActive = activeId === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                className="flex min-h-[52px] min-w-[58px] flex-col items-center justify-center gap-1.5 rounded-2xl px-1.5 text-[11px] text-white/66 transition-colors hover:bg-white/10"
              >
                <span
                  className="h-1 w-5 rounded-full"
                  style={
                    isActive
                      ? {
                          background: "linear-gradient(90deg,#ffa48c,#f2603c)",
                          boxShadow: "0 0 12px rgba(242,96,60,.8)",
                        }
                      : { background: "rgba(255,255,255,.12)" }
                  }
                />
                <span className={isActive ? "text-white" : undefined}>{item.short}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile floating account control */}
      <div className="fixed top-4 right-4 z-50 md:hidden">
        <AuthControl compact />
      </div>
    </>
  );
}
