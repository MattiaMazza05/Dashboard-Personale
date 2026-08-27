"use client";

import { Pencil, Trash2, Inbox } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Lavoro } from "@/types/lavoro";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const statusLabel: Record<number, string> = {
  0: "Prenotato",
  1: "Fatto",
};

type EditFormState = {
  type: string;
  date: string;
  description: string;
  hours: string;
  standbyPay: string;
};

interface EditActivityDialogProps {
  item: Lavoro;
  onSuccess?: () => void;
}

function EditActivityDialog({ item, onSuccess }: EditActivityDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formState, setFormState] = useState<EditFormState>({
    type: item.tipo_attivita,
    date: item.data,
    description: item.nome_evento,
    hours: String(item.ore_lavorate),
    standbyPay: String(item.paga_attesa),
  });

  const updateField = <Key extends keyof EditFormState>(
    key: Key,
    value: EditFormState[Key],
  ) => {
    setFormState((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const oggi = new Date().toISOString().split("T")[0];
    const payload = {
      tipo_attivita: formState.type,
      nome_evento: formState.description,
      ore_lavorate: Number(formState.hours),
      data: formState.date,
      paga_attesa: Number(formState.standbyPay) || 0,
      status: oggi > formState.date ? 1 : 0,
    };

    const { data, error } = await supabase
      .from("lavoro")
      .update(payload)
      .eq("id", item.id)
      .select();

    if (error) {
      console.error("Errore durante la modifica:", error);
      toast.error("Errore durante la modifica");
      return;
    }

    if (!data || data.length === 0) {
      console.error(
        "Nessuna riga aggiornata: probabile blocco RLS (manca una policy UPDATE su 'lavoro') o id inesistente.",
      );
      toast.error(
        "Nessuna modifica salvata: controlla i permessi (RLS) sulla tabella 'lavoro'",
      );
      return;
    }

    setIsOpen(false);
    toast.success("Attività aggiornata");
    onSuccess?.();
  };

  const formId = `edit-work-form-${item.id}`;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button
        size="icon-sm"
        variant="ghost"
        onClick={() => setIsOpen(true)}
      >
        <Pencil className="size-4" />
      </Button>
      <DialogContent className="jarvis-panel sm:max-w-100">
        <DialogHeader>
          <DialogTitle>Modifica le informazioni</DialogTitle>
        </DialogHeader>
        <form id={formId} className="grid gap-6" onSubmit={handleUpdate}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Tipo attività</Label>
              <Select
                value={formState.type}
                onValueChange={(value) => updateField("type", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Steward">Steward</SelectItem>
                  <SelectItem value="Università">Università</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Data</Label>
              <Input
                required
                type="date"
                value={formState.date}
                onChange={(event) => updateField("date", event.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Descrizione</Label>
            <Input
              placeholder="Es. concerto..."
              required
              type="text"
              value={formState.description}
              onChange={(event) => updateField("description", event.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Ore</Label>
              <Input
                min="0"
                placeholder="8"
                required
                type="number"
                value={formState.hours}
                onChange={(event) => updateField("hours", event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Paga attesa</Label>
              <Input
                min="0"
                placeholder="40"
                required
                type="number"
                value={formState.standbyPay}
                onChange={(event) => updateField("standbyPay", event.target.value)}
              />
            </div>
          </div>
        </form>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            Annulla
          </Button>
          <Button form={formId} type="submit">
            Salva modifiche
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface TabellaLavoroProps {
  refreshKey?: number;
  onSuccess?: () => void;
}

function meseDi(data: string) {
  const nome = new Date(data).toLocaleDateString("it-IT", { month: "long" });
  return nome.charAt(0).toUpperCase() + nome.slice(1);
}

export function TabellaLavoro({ refreshKey, onSuccess }: TabellaLavoroProps) {
  const [lavori, setLavori] = useState<Lavoro[]>([]);
  const [loading, setLoading] = useState(true);
  const [meseFiltro, setMeseFiltro] = useState("Tutti");

  useEffect(() => {
    async function fetchLavori() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("lavoro")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error(error);
      } else {
        setLavori(data || []);
      }

      setLoading(false);
    }

    fetchLavori();

    const channel = supabase
      .channel("lavoro-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "lavoro",
        },
        () => {
          fetchLavori();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshKey]);

  if (loading) {
    return (
      <div className="flex min-h-50 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (lavori.length === 0) {
    return (
      <div className="jarvis-panel flex min-h-50 flex-col items-center justify-center gap-4 rounded-2xl p-8 text-center">
        <Inbox className="size-6 text-white/50" />
        <span className="text-sm text-white/50">Non ci sono voci da mostrare</span>
      </div>
    );
  }

  const mesiDisponibili = Array.from(
    new Set(lavori.map((item) => meseDi(item.data)).filter(Boolean)),
  ).sort(
    (a, b) =>
      lavori.findIndex((item) => meseDi(item.data) === a) -
      lavori.findIndex((item) => meseDi(item.data) === b),
  );

  const lavoriFiltrati =
    meseFiltro === "Tutti"
      ? lavori
      : lavori.filter((item) => meseDi(item.data) === meseFiltro);

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {["Tutti", ...mesiDisponibili].map((mese) => (
          <button
            key={mese}
            onClick={() => setMeseFiltro(mese)}
            className={
              mese === meseFiltro
                ? "flex min-h-9 items-center gap-2 rounded-full border border-white/22 bg-white/14 px-3.5 text-sm text-white transition-colors"
                : "flex min-h-9 items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3.5 text-sm text-white/60 transition-colors hover:bg-white/10"
            }
          >
            {mese === meseFiltro && (
              <span className="size-1.5 rounded-full bg-[#ff8b6f] shadow-[0_0_8px_#ff8b6f]" />
            )}
            {mese}
          </button>
        ))}
      </div>

      {lavoriFiltrati.length === 0 ? (
        <div className="jarvis-panel flex min-h-50 flex-col items-center justify-center gap-4 rounded-2xl p-8 text-center">
          <Inbox className="size-6 text-white/50" />
          <span className="text-sm text-white/50">
            Nessuna attività per {meseFiltro}
          </span>
        </div>
      ) : (
    <div className="jarvis-panel overflow-x-auto rounded-2xl">
      <Table className="min-w-150">
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-transparent">
            <TableHead className="text-white/45">Tipo Attività</TableHead>
            <TableHead className="text-white/45">Data</TableHead>
            <TableHead className="text-white/45">Descrizione</TableHead>
            <TableHead className="text-white/45">Ore</TableHead>
            <TableHead className="text-white/45">Paga Attesa</TableHead>
            <TableHead className="text-white/45">Status</TableHead>
            <TableHead className="text-white/45">Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lavoriFiltrati.map((item) => (
            <TableRow key={item.id} className="border-white/10">
              <TableCell>{item.tipo_attivita}</TableCell>
              <TableCell>{item.data}</TableCell>
              <TableCell>{item.nome_evento}</TableCell>
              <TableCell>{item.ore_lavorate}</TableCell>
              <TableCell>€ {item.paga_attesa} </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    item.status === 1
                      ? "border-[rgba(110,231,168,.34)] bg-[rgba(110,231,168,.16)] text-[#a5f2c9]"
                      : "border-white/14 bg-white/8 text-white/62"
                  }
                >
                  {statusLabel[item.status] ?? "Non Fatto"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <EditActivityDialog item={item} onSuccess={onSuccess} />
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    className="text-[#ffb4a2] hover:bg-[rgba(255,120,100,.16)] hover:text-[#ffb4a2]"
                    onClick={async () => {
                      const { error } = await supabase
                        .from("lavoro")
                        .delete()
                        .eq("id", item.id);

                      if (error) {
                        console.error("Errore durante l'eliminazione:", error);
                        toast.error("Errore durante l'eliminazione");
                        return;
                      }

                      toast.success("Attività eliminata");
                      onSuccess?.();
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
      )}
    </div>
  );
}
