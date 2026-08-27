import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { kpiSport, pianoSettimana, volumeCorsa, gare } from "@/lib/mock-data";

const maxKm = Math.max(...volumeCorsa.map((v) => v.km));

export default function Sport() {
  const fatte = pianoSettimana.filter((p) => p.fatto).length;

  return (
    <div>
      <PageHeader title="Sport" />

      <div className="mb-4 grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        {kpiSport.map((k) => (
          <Card key={k.label} className="jarvis-panel gap-2 p-4.5">
            <span className="text-xs text-white/58">{k.label}</span>
            <b className="font-mono text-2xl font-medium tracking-tight">{k.value}</b>
            <span className="text-xs text-white/50">{k.note}</span>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="jarvis-panel gap-3 p-5">
          <CardHeader className="flex-row items-baseline justify-between gap-3 p-0">
            <CardTitle className="text-[15px]">Piano settimana</CardTitle>
            <span className="text-xs text-white/50">{fatte} / {pianoSettimana.length} sessioni</span>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 p-0">
            {pianoSettimana.map((p) => (
              <div
                key={p.nome}
                className="grid grid-cols-[46px_1fr_auto] items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5"
              >
                <span className="font-mono text-xs text-[#ffc4b4]/90">{p.giorno}</span>
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-sm">{p.nome}</span>
                  <span className="text-xs text-white/50">
                    {p.volume} · {p.target}
                  </span>
                </span>
                <Badge
                  variant="outline"
                  className={
                    p.fatto
                      ? "border-[rgba(110,231,168,.34)] bg-[rgba(110,231,168,.16)] text-[#a5f2c9]"
                      : "border-white/14 bg-white/8 text-white/62"
                  }
                >
                  {p.fatto ? "fatta" : "da fare"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="jarvis-panel gap-4 p-5">
            <CardHeader className="flex-row items-baseline justify-between gap-3 p-0">
              <CardTitle className="text-[15px]">Volume corsa</CardTitle>
              <span className="text-xs text-white/50">ultime 6 settimane</span>
            </CardHeader>
            <CardContent className="flex h-[132px] items-end gap-3 p-0">
              {volumeCorsa.map((v) => (
                <span key={v.settimana} className="flex flex-1 flex-col items-center justify-end gap-2">
                  <span className="font-mono text-[11px] text-white/60">{v.km}</span>
                  <span
                    className="w-full rounded-t-[10px] rounded-b-[4px] bg-gradient-to-b from-[rgba(255,164,140,.95)] to-[rgba(242,96,60,.55)]"
                    style={{ height: `${Math.max(8, (v.km / maxKm) * 86)}px` }}
                  />
                  <span className="text-[11px] text-white/45">{v.settimana}</span>
                </span>
              ))}
            </CardContent>
          </Card>

          <Card className="jarvis-panel gap-3 p-5">
            <CardTitle className="text-[15px]">Gare in calendario</CardTitle>
            <CardContent className="flex flex-col p-0">
              {gare.map((g) => (
                <div
                  key={g.nome}
                  className="flex items-center justify-between gap-3 border-b border-white/9 py-3 last:border-0"
                >
                  <span className="flex flex-col gap-0.5">
                    <span className="text-sm">{g.nome}</span>
                    <span className="text-xs text-white/50">
                      {g.data} · {g.distanza}
                    </span>
                  </span>
                  <b className="font-mono text-sm font-medium text-[#ffc0ad]">{g.giorni}</b>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
