"use client";

import { usePathname } from "next/navigation";
import Nav from "@/components/navbar";
import { AppBackground } from "@/components/AppBackground";

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const showNav = !pathname?.startsWith("/login");

  if (!showNav) {
    return <div className="min-h-full flex flex-col">{children}</div>;
  }

  return (
    <div className="relative min-h-full">
      <AppBackground />
      <Nav />
      <main className="relative z-10 flex min-h-full flex-col px-4 pt-4 pb-28 md:pl-[268px] md:pr-6 md:pt-6 md:pb-14">
        <div className="mx-auto w-full max-w-[1120px] flex-1">{children}</div>
      </main>
    </div>
  );
}
