"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { getUserId } from "@/hooks/commonHook";
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
  DialogTrigger,
} from "@/components/ui/dialog";

type ActivityFormState = {
  type: string;
  date: string;
  description: string;
  hours: string;
  standbyPay: string;
};

const initialFormState: ActivityFormState = {
  type: "Steward",
  date: "",
  description: "",
  hours: "",
  standbyPay: "",
};

interface AddButtonProps {
  onSuccess?: () => void;
}

export function AddButton({ onSuccess }: AddButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formState, setFormState] =
    useState<ActivityFormState>(initialFormState);

  const updateField = <Key extends keyof ActivityFormState>(
    key: Key,
    value: ActivityFormState[Key],
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
    const oggi = new Date().toISOString().split("T")[0];
    const payload = {
      user_id: await getUserId(),
      tipo_attivita: formState.type,
      nome_evento: formState.description,
      ore_lavorate: Number(formState.hours),
      data: formState.date,
      paga_attesa: Number(formState.standbyPay) || 0,
      status: oggi > formState.date ? 1 : 0,
    };
    const { error } = await supabase.from("lavoro").insert(payload);

    if (error) {
      console.error(error);
      toast.error("Errore durante l'inserimento dell'attività");
      return;
    }
    setIsOpen(false);
    resetForm();
    toast.success("Attività inserita");
    onSuccess?.();
  };

  return (
    <div className="mb-4 flex flex-wrap gap-4">
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogTrigger asChild>
          <Button className="jarvis-cta gap-2 border border-white/22 text-[#210c05]">
            <Plus className="size-4" />
            Nuova attività
          </Button>
        </DialogTrigger>
        <DialogContent className="jarvis-panel sm:max-w-100">
          <DialogHeader>
            <DialogTitle>Inserisci nuova attività</DialogTitle>
          </DialogHeader>
          <form id="new-work-form" className="grid gap-6" onSubmit={handleSubmit}>
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
            <Button form="new-work-form" type="submit">
              Inserisci attività
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
