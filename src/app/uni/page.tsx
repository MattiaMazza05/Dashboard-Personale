import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { kpiUni, esami, libretto } from "@/lib/mock-data";

export default function Uni() {
  return (
    <div>
      <PageHeader title="Università" />

      <div className="mb-4 grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        {kpiUni.map((k) => (
          <Card key={k.label} className="jarvis-panel gap-2.5 p-4.5">
            <span className="text-xs text-white/58">{k.label}</span>
            <b className="font-mono text-2xl font-medium tracking-tight">{k.value}</b>
            {"pct" in k && k.pct !== undefined && (
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-1.5 rounded-full bg-gradient-to-r from-[#ffa48c] to-[#f2603c]"
                  style={{ width: `${k.pct}%` }}
                />
              </div>
            )}
            <span className="text-xs text-white/50">{k.note}</span>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="jarvis-panel gap-3 p-5">
          <CardHeader className="p-0">
            <CardTitle className="text-[15px]">Esami prenotati</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 p-0">
            {esami.map((e) => (
              <div
                key={e.nome}
                className="flex items-center gap-3.5 rounded-2xl border border-white/10 bg-white/5 p-3.5"
              >
                <span className="flex w-[58px] flex-none flex-col items-center gap-0.5 rounded-xl border border-[rgba(255,122,92,.28)] bg-[rgba(255,122,92,.16)] py-2">
                  <b className="font-mono text-lg font-medium text-[#ffc0ad]">{e.giorni}</b>
                  <span className="text-[10px] text-[#ffc4b4]/80">giorni</span>
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <b className="text-sm font-medium">{e.nome}</b>
                  <span className="text-xs text-white/50">
                    {e.data} · {e.aula}
                  </span>
                </span>
                <span className="font-mono text-xs text-white/60">{e.cfu}</span>
              </div>
            ))}
            <div className="flex flex-col gap-2 rounded-2xl border border-[rgba(124,215,255,.22)] bg-[rgba(124,215,255,.08)] p-3.5">
              <b className="text-[13px] text-[#a9e4ff]">Tirocinio · 112 / 180 h</b>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-2 w-[62%] rounded-full bg-gradient-to-r from-[#a9e4ff] to-[#4bb8ee]" />
              </div>
              <span className="text-xs text-white/66">
                68 ore residue · diario di bordo da consegnare il 15 set
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="jarvis-panel gap-3 p-5">
          <CardHeader className="flex-row items-baseline justify-between gap-3 p-0">
            <CardTitle className="text-[15px]">Libretto</CardTitle>
            <span className="text-xs text-white/50">media 26,4 · 108 CFU</span>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-[1fr_56px_56px] gap-2.5 border-b border-white/10 px-1 pb-2 text-[11px] tracking-[.06em] text-white/45 uppercase">
              <span>Esame</span>
              <span>Voto</span>
              <span>CFU</span>
            </div>
            {libretto.map((l) => (
              <div
                key={l.nome}
                className="grid grid-cols-[1fr_56px_56px] items-center gap-2.5 rounded-xl px-1 py-2.5 hover:bg-white/6"
              >
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-sm">{l.nome}</span>
                  <span className="text-xs text-white/45">{l.data}</span>
                </span>
                <b className="font-mono text-base font-medium">{l.voto}</b>
                <span className="font-mono text-sm text-white/60">{l.cfu}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
