"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Lavoro } from "@/types/lavoro";
import { agendaHome, riepilogoHome } from "@/lib/mock-data";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";

const oggi = new Date();
const dataOggi = oggi.toLocaleDateString("it-IT", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});
const meseCorrente = oggi.toISOString().slice(0, 7); // "2026-08"
const nomeMese = oggi.toLocaleDateString("it-IT", { month: "long" });

const chips = [
  { label: "Analisi II tra 9 giorni", href: "/uni" },
  { label: "Prossima uscita: ripetute", href: "/sport" },
  { label: "Turno cucina questa settimana", href: "/house" },
];

const oggiChecklist = [
  { nome: "Tutoraggio — aula informatica", ora: "15:00" },
  { nome: "Analisi II, capitolo 7", ora: "17:00" },
  { nome: "Fondo lento 8 km", ora: "19:15" },
];

export default function Home() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [nome, setNome] = useState("");
  const [lavori, setLavori] = useState<Lavoro[]>([]);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setNome(
        (user.user_metadata?.full_name as string | undefined)?.split(" ")[0] ??
          user.email?.split("@")[0] ??
          "",
      );

      const { data } = await supabase
        .from("lavoro")
        .select("*")
        .eq("user_id", user.id);

      setLavori(data ?? []);
      setReady(true);
    }

    load();
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const lavoriDelMese = lavori.filter((l) => l.data?.startsWith(meseCorrente));
  const pagaAttesa = lavoriDelMese.reduce((acc, l) => acc + Number(l.paga_attesa || 0), 0);
  const oreLavorate = lavoriDelMese.reduce((acc, l) => acc + Number(l.ore_lavorate || 0), 0);

  const kpiHome = [
    { label: `Paga attesa · ${nomeMese}`, value: `€ ${pagaAttesa}`, note: `${lavoriDelMese.length} attività registrate` },
    { label: `Ore lavorate · ${nomeMese}`, value: `${oreLavorate} h`, note: "vedi dettaglio in Lavoro" },
    { label: "Esami in coda", value: "3", note: "il primo tra 9 giorni · dati di esempio" },
    { label: "Km questa settimana", value: "26", note: "streak 6 settimane · dati di esempio" },
  ];

  const riepilogo = [
    {
      title: "Lavoro",
      href: "/work",
      flag: lavoriDelMese.length > 0 ? `${lavoriDelMese.length} attività` : "nessuna attività",
      stats: [
        { value: `€ ${pagaAttesa}`, label: `attesi ${nomeMese}` },
        { value: `${oreLavorate} h`, label: "ore mese" },
      ],
    },
    { title: "Università", href: "/uni", ...riepilogoHome.uni },
    { title: "Sport", href: "/sport", ...riepilogoHome.sport },
    { title: "Casa", href: "/house", ...riepilogoHome.casa },
  ];

  return (
    <div className="flex flex-col gap-5 pb-6">
      <Card className="jarvis-panel-hero flex flex-col gap-4.5 p-6.5">
        <span className="text-[11px] tracking-[.12em] text-[#ffc4b4]/85 uppercase">
          {dataOggi}
        </span>
        <h1 className="max-w-[620px] text-3xl leading-[1.18] font-semibold tracking-tight text-balance">
          {nome ? `Buon pomeriggio, ${nome}.` : "Buon pomeriggio."} Ecco il punto sulla giornata.
        </h1>
        <div className="flex flex-wrap gap-2.5">
          {chips.map((c) => (
            <Link key={c.label} href={c.href}>
              <span className="flex min-h-10 items-center gap-2 rounded-full border border-white/18 bg-white/9 px-3.5 text-[13px] transition-colors hover:bg-white/16">
                <span className="size-1.5 rounded-full bg-[#ff8b6f] shadow-[0_0_10px_#ff8b6f]" />
                {c.label}
              </span>
            </Link>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        {kpiHome.map((k) => (
          <Card key={k.label} className="jarvis-panel gap-2 p-4.5">
            <span className="text-xs text-white/58">{k.label}</span>
            <b className="font-mono text-[27px] font-medium tracking-tight">{k.value}</b>
            <span className="text-xs text-white/50">{k.note}</span>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="jarvis-panel gap-3.5 p-5">
          <div className="flex items-baseline justify-between gap-3">
            <b className="text-[15px]">Prossimi giorni</b>
            <span className="text-xs text-white/50">dati di esempio</span>
          </div>
          <div className="flex flex-col gap-1">
            {agendaHome.map((a) => (
              <div
                key={a.nome}
                className="grid grid-cols-[56px_1fr_auto] items-center gap-3 rounded-2xl p-2.5"
              >
                <span className="font-mono text-xs text-[#ffc4b4]/90">{a.quando}</span>
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-sm">{a.nome}</span>
                  <span className="text-xs text-white/50">{a.nota}</span>
                </span>
                <Badge variant="outline" className="border-white/14 bg-white/9 text-white/72">{a.tag}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="jarvis-panel gap-3.5 p-5">
          <div className="flex items-baseline justify-between gap-3">
            <b className="text-[15px]">Da chiudere oggi</b>
            <span className="text-xs text-white/50">dati di esempio</span>
          </div>
          <div className="flex flex-col gap-1">
            {oggiChecklist.map((t) => (
              <div key={t.nome} className="flex items-center gap-3 rounded-2xl p-2.5">
                <span className="size-[22px] flex-none rounded-lg border border-white/28 bg-white/6" />
                <span className="flex-1 text-sm">{t.nome}</span>
                <span className="font-mono text-xs text-white/50">{t.ora}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {riepilogo.map((s) => (
          <Card key={s.title} className="jarvis-panel gap-4 p-5">
            <CardHeader className="flex-row items-center justify-between gap-2.5 p-0">
              <CardTitle className="text-[15px]">{s.title}</CardTitle>
              <Badge variant="outline" className="border-[rgba(255,122,92,.3)] bg-[rgba(255,122,92,.16)] text-[#ffc0ad]">{s.flag}</Badge>
            </CardHeader>
            <CardContent className="flex gap-5 p-0">
              {s.stats.map((st) => (
                <div key={st.label} className="flex flex-col gap-1">
                  <b className="font-mono text-xl font-medium">{st.value}</b>
                  <span className="text-[11px] text-white/50">{st.label}</span>
                </div>
              ))}
            </CardContent>
            {"lines" in s && s.lines && (
              <div className="flex flex-col gap-2">
                {s.lines.map((l) => (
                  <div key={l.a} className="border-t border-white/9 pt-2">
                    <div className="flex justify-between gap-2.5 text-[13px]">
                      <span className="text-white/82">{l.a}</span>
                      <span className="text-white/50">{l.b}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Separator className="bg-white/10" />
            <CardFooter className="p-0">
              <Link
                href={s.href}
                className="flex min-h-10 w-full items-center rounded-2xl border border-white/16 bg-white/7 px-3.5 text-[13px] transition-colors hover:bg-white/13"
              >
                Apri {s.title} →
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
