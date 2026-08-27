import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { turniCasa, ricorrenzeCasa } from "@/lib/mock-data";

export default function House() {
  return (
    <div>
      <PageHeader title="Casa" />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="jarvis-panel gap-3 p-5">
          <CardHeader className="flex-row items-baseline justify-between gap-3 p-0">
            <CardTitle className="text-[15px]">Turni della settimana</CardTitle>
            <span className="text-xs text-white/50">ruotano domenica sera</span>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 p-0">
            {turniCasa.map((t) => (
              <div
                key={t.cosa}
                className="flex items-center gap-3.5 rounded-2xl border border-white/10 bg-white/5 p-3.5"
              >
                <span className="flex size-[38px] flex-none items-center justify-center rounded-xl border border-white/16 bg-white/10 text-sm font-semibold">
                  {t.iniziale}
                </span>
                <span className="flex flex-1 flex-col gap-0.5">
                  <span className="text-sm">{t.cosa}</span>
                  <span className="text-xs text-white/50">
                    {t.chi} · fino a {t.fino}
                  </span>
                </span>
                {t.mio && (
                  <Badge
                    variant="outline"
                    className="border-[rgba(255,122,92,.32)] bg-[rgba(255,122,92,.18)] text-[#ffc0ad]"
                  >
                    tocca a te
                  </Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="jarvis-panel gap-3 p-5">
          <CardHeader className="flex-row items-baseline justify-between gap-3 p-0">
            <CardTitle className="text-[15px]">Ricorrenze</CardTitle>
            <span className="text-xs text-white/50">tocca per segnare fatto</span>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 p-0">
            {ricorrenzeCasa.map((r) => {
              const resto = r.ogni - r.ultimaVolta;
              const pct = Math.min(100, Math.round((r.ultimaVolta / r.ogni) * 100));
              const inRitardo = resto <= 0;
              return (
                <div
                  key={r.nome}
                  className="flex w-full flex-col gap-2.5 rounded-2xl border border-white/10 bg-white/5 p-3.5 text-left"
                >
                  <span className="flex w-full items-baseline justify-between gap-3">
                    <span className="text-sm">{r.nome}</span>
                    <span className={inRitardo ? "text-xs text-[rgba(255,180,162,.95)]" : "text-xs text-white/50"}>
                      {inRitardo ? `in ritardo di ${Math.abs(resto)} g` : `tra ${resto} giorni`}
                    </span>
                  </span>
                  <span className="block h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <span
                      className="block h-1.5 rounded-full bg-gradient-to-r from-[#ffa48c] to-[#f2603c]"
                      style={{ width: `${pct}%` }}
                    />
                  </span>
                  <span className="text-[11px] text-white/45">
                    ogni {r.ogni} giorni · ultima volta {r.ultimaVolta} giorni fa
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
