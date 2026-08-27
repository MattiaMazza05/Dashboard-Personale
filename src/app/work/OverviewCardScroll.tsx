"use client";

import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useState } from "react";
import { getUserId } from "@/hooks/commonHook";
import type { Lavoro, Bonifico } from "@/types/lavoro";
import { toast } from "sonner";
import { Landmark } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const mesiAnno = [
  "Gennaio",
  "Febbraio",
  "Marzo",
  "Aprile",
  "Maggio",
  "Giugno",
  "Luglio",
  "Agosto",
  "Settembre",
  "Ottobre",
  "Novembre",
  "Dicembre",
];

interface KpiBarProps {
  refreshKey?: number;
}

export function KpiBar({ refreshKey }: KpiBarProps) {
  const [lavori, setLavori] = useState<Lavoro[]>([]);
  const [bonifici, setBonifici] = useState<Bonifico[]>([]);

  const fetchData = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return;
    }

    const [resLavori, resBonifici] = await Promise.all([
      supabase.from("lavoro").select("*").eq("user_id", user.id),
      supabase.from("bonifici").select("*").eq("user_id", user.id)
    ]);

    if (resLavori.data) setLavori(resLavori.data);
    if (resBonifici.data) setBonifici(resBonifici.data);
  }, []);

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel("cardpayment-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "lavoro" },
        () => {
          fetchData();
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bonifici" },
        () => {
          fetchData();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchData, refreshKey]);

  const oreTotali = lavori.reduce((acc, l) => acc + Number(l.ore_lavorate || 0), 0);
  const attesaTotale = lavori.reduce((acc, l) => acc + Number(l.paga_attesa || 0), 0);
  const effettivoTotale = bonifici.reduce((acc, b) => acc + Number(b.importo_totale || 0), 0);

  const kpi = [
    { label: "Ore totali", value: `${oreTotali} h` },
    { label: "Attesa totale", value: `€ ${attesaTotale}` },
    { label: "Guadagno effettivo", value: `€ ${effettivoTotale}` },
    { label: "Attività registrate", value: `${lavori.length}` },
  ];

  type RealRevenue = {
    total: number;
    month: string;
  };

  const initialFormState: RealRevenue = {
    total: 0,
    month: mesiAnno[new Date().getMonth()],
  };

  const [isOpen, setIsOpen] = useState(false);
  const [formState, setFormState] = useState<RealRevenue>(initialFormState);

  const updateField = <Key extends keyof RealRevenue>(
    key: Key,
    value: RealRevenue[Key],
  ) => {
    setFormState((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const resetForm = () => {
    setFormState(initialFormState);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const userId = await getUserId();
    if (!userId) return;

    const payload = {
      user_id: userId,
      importo_totale: formState.total,
      mese_di_riferimento: formState.month,
    };
    const { error } = await supabase.from("bonifici").insert(payload);

    if (error) {
      console.error(error);
      toast.error("Errore durante l'inserimento del bonifico");
      return;
    }
    setIsOpen(false);
    resetForm();
    toast.success("Bonifico inserito");
    fetchData();
  };

  return (
    <>
      <Card className="jarvis-panel mb-5 flex flex-row flex-wrap items-center gap-4 p-4">
        <div className="flex flex-1 flex-wrap gap-4">
          {kpi.map((k, index) => (
            <div
              key={k.label}
              className={
                index > 0
                  ? "flex min-w-[120px] flex-1 flex-col gap-1 border-l border-white/10 pl-4"
                  : "flex min-w-[120px] flex-1 flex-col gap-1"
              }
            >
              <span className="text-xs text-white/55">{k.label}</span>
              <b className="font-mono text-xl font-medium tracking-tight">{k.value}</b>
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          className="gap-2 border-white/16 bg-white/6"
          onClick={() => setIsOpen(true)}
        >
          <Landmark className="size-4" />
          Registra bonifico
        </Button>
      </Card>

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className="jarvis-panel sm:max-w-100">
          <DialogHeader>
            <DialogTitle>Registra un bonifico ricevuto</DialogTitle>
          </DialogHeader>
          <form id="bonifico-form" className="grid gap-6" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label>Mese di riferimento</Label>
              <Select
                value={formState.month}
                onValueChange={(value) => updateField("month", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mesiAnno.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Importo</Label>
              <Input
                placeholder="Es. 250..."
                required
                type="number"
                value={formState.total}
                onChange={(event) => updateField("total", Number(event.target.value))}
              />
            </div>
          </form>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Annulla
            </Button>
            <Button form="bonifico-form" type="submit">
              Inserisci
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
