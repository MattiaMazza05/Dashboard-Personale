"use client";

import { useEffect, useState, type Key } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Tabs, Avatar, Dropdown, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

const NAV_ITEMS = [
  { id: "sport", label: "Sport", href: "/sport", icon: "solar:running-round-linear" },
  { id: "house", label: "Casa", href: "/house", icon: "solar:home-2-linear" },
  { id: "uni", label: "Università", href: "/uni", icon: "solar:square-academic-cap-linear" },
  { id: "work", label: "Lavoro", href: "/work", icon: "solar:case-round-linear" },
] as const;

type NavId = (typeof NAV_ITEMS)[number]["id"];

function resolveActiveId(pathname: string): NavId | null {
  const found = NAV_ITEMS.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
  );
  return found ? found.id : null;
}

interface NavTabsProps {
  activeId: NavId | null;
  onNavigate: (key: Key) => void;
  variant: "desktop" | "mobile";
}

function NavTabs({ activeId, onNavigate, variant }: NavTabsProps) {
  const isMobile = variant === "mobile";
  return (
    <Tabs
      aria-label="Sezioni dashboard"
      selectedKey={activeId ?? undefined}
      onSelectionChange={onNavigate}
      className={isMobile ? "w-full" : ""}
    >
      <Tabs.ListContainer>
        <Tabs.List className={isMobile ? "w-full justify-between" : ""}>
          {NAV_ITEMS.map((item) => (
            <Tabs.Tab
              key={item.id}
              id={item.id}
              className={isMobile ? "h-14 flex-1 flex-col gap-0.5 px-2 text-[11px]" : "px-4"}
            >
              <Tabs.Indicator />
              <span className="relative z-10 flex flex-col items-center gap-0.5">
                {isMobile && <Icon icon={item.icon} className="h-5 w-5" />}
                {item.label}
              </span>
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs.ListContainer>
    </Tabs>
  );
}

function AuthControl() {
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
    return <div className="h-9 w-9 animate-pulse rounded-full bg-default" />;
  }

  const user = session?.user;

  if (!user) {
    return (
      <Button size="sm" onPress={() => router.push("/login")}>
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
    <Dropdown>
      <Dropdown.Trigger className="rounded-full outline-none">
        <Avatar size="sm" className="cursor-pointer">
          {avatarUrl && <Avatar.Image src={avatarUrl} alt={email} />}
          <Avatar.Fallback>{initial}</Avatar.Fallback>
        </Avatar>
      </Dropdown.Trigger>
      <Dropdown.Popover placement="top end" className="min-w-60">
        <div className="border-b border-black/10 px-3 py-2.5 dark:border-white/10">
          <p className="text-xs text-muted">Accesso effettuato come</p>
          <p className="truncate text-sm font-medium text-foreground">{email}</p>
        </div>
        <Dropdown.Menu
          onAction={(key) => {
            if (key === "logout") handleLogout();
          }}
        >
          <Dropdown.Item id="logout" textValue="Esci" variant="danger">
            <Icon icon="solar:logout-2-linear" className="h-4 w-4" />
            Esci
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname?.startsWith("/login")) return null;

  const activeId = resolveActiveId(pathname ?? "");

  const handleNavigate = (key: Key) => {
    if (key === activeId) return;
    const item = NAV_ITEMS.find((i) => i.id === key);
    if (item) router.push(item.href);
  };

  return (
    <>
      {/* Desktop / tablet: top navbar */}
      <nav className="fixed inset-x-0 top-0 z-50 hidden items-center justify-between border-b border-black/10 bg-background/80 px-6 py-3 backdrop-blur-md dark:border-white/10 md:flex">
        <span className="text-sm font-semibold tracking-tight text-foreground">
          Dashboard di Mattia
        </span>
        <NavTabs activeId={activeId} onNavigate={handleNavigate} variant="desktop" />
        <AuthControl />
      </nav>

      {/* Mobile / tablet portrait: floating account control */}
      <div className="fixed top-4 right-4 z-50 md:hidden">
        <AuthControl />
      </div>

      {/* Mobile / tablet portrait: floating bottom nav */}
      <nav className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 md:hidden">
        <div className="rounded-full bg-background/80 p-1.5 shadow-lg backdrop-blur-md">
          <NavTabs activeId={activeId} onNavigate={handleNavigate} variant="mobile" />
        </div>
      </nav>
    </>
  );
}
