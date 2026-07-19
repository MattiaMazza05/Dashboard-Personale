"use client";

import { useState } from "react";
import { AlertDialog, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { supabase } from "@/lib/supabase";

type ActivityFormState = {
  type: string;
  date: string;
  description: string;
  hours: string;
  standbyPay: string;
  receivedPay: string;
};

const initialFormState: ActivityFormState = {
  type: "steward",
  date: "",
  description: "",
  hours: "",
  standbyPay: "",
  receivedPay: "",
};

export function AddButton() {
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
    const payload = {
      tipo_attivita: formState.type,
      nome_evento: formState.description,
      ore_lavorate: Number(formState.hours),
      data: formState.date,
      paga_attesa: Number(formState.standbyPay) || 0,
    };
    const { error } = await supabase.from("lavoro").insert(payload);

    if (error) {
      console.error(error);
      return;
    }
    setIsOpen(false);
    resetForm();
  };

  return (
    <div className="flex flex-wrap gap-4">
      <AlertDialog isOpen={isOpen} onOpenChange={setIsOpen}>
        <Button className="gap-2 bg-accent-soft text-accent-soft-foreground">
          <Icon className="size-4" icon="gravity-ui:plus" />
          Nuova attività
        </Button>
        <AlertDialog.Backdrop>
          <AlertDialog.Container>
            <AlertDialog.Dialog className="sm:max-w-100">
              <AlertDialog.CloseTrigger />
              <AlertDialog.Header>
                <div className="flex items-center gap-3">
                  <AlertDialog.Icon status="accent">
                    <Icon className="size-4" icon="gravity-ui:plus" />
                  </AlertDialog.Icon>
                  <AlertDialog.Heading>
                    Inserisci nuova attività
                  </AlertDialog.Heading>
                </div>
              </AlertDialog.Header>
              <AlertDialog.Body>
                <form
                  id="new-work-form"
                  className="grid gap-6"
                  onSubmit={handleSubmit}
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-2">
                      <span className="text-sm font-medium text-foreground/80">
                        Tipo attività
                      </span>
                      <select
                        className="h-11 rounded-xl border border-foreground/10 bg-background px-3 text-sm outline-none transition focus:border-accent-soft focus:ring-2 focus:ring-accent-soft/30"
                        required
                        value={formState.type}
                        onChange={(event) =>
                          updateField("type", event.target.value)
                        }
                      >
                        <option value="steward">Steward</option>
                        <option value="uni">Università</option>
                      </select>
                      <span className="text-xs text-foreground/55">
                        Scegli la categoria corretta dell’attività.
                      </span>
                    </label>

                    <label className="grid gap-2">
                      <span className="text-sm font-medium text-foreground/80">
                        Data
                      </span>
                      <input
                        className="h-11 rounded-xl border border-foreground/10 bg-background px-3 text-sm outline-none transition focus:border-accent-soft focus:ring-2 focus:ring-accent-soft/30"
                        required
                        type="date"
                        value={formState.date}
                        onChange={(event) =>
                          updateField("date", event.target.value)
                        }
                      />
                      <span className="text-xs text-foreground/55">
                        Quando si è svolta l’attività.
                      </span>
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_140px]">
                    <label className="grid min-w-0 gap-2">
                      <span className="text-sm font-medium text-foreground/80">
                        Descrizione
                      </span>
                      <input
                        className="h-11 w-full max-w-64 rounded-xl border border-foreground/10 bg-background px-3 text-sm outline-none transition placeholder:text-foreground/35 focus:border-accent-soft focus:ring-2 focus:ring-accent-soft/30"
                        placeholder="Es. concerto..."
                        required
                        type="text"
                        value={formState.description}
                        onChange={(event) =>
                          updateField("description", event.target.value)
                        }
                      />
                    </label>

                    <label className="grid min-w-0 gap-2">
                      <span className="text-sm font-medium text-foreground/80">
                        Ore
                      </span>
                      <input
                        className="h-11 w-full rounded-xl border border-foreground/10 bg-background px-3 text-sm outline-none transition placeholder:text-foreground/35 focus:border-accent-soft focus:ring-2 focus:ring-accent-soft/30"
                        min="0"
                        placeholder="8"
                        required
                        type="number"
                        value={formState.hours}
                        onChange={(event) =>
                          updateField("hours", event.target.value)
                        }
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid min-w-0 gap-2">
                      <span className="text-sm font-medium text-foreground/80">
                        Paga attesa
                      </span>
                      <input
                        className="h-11 w-full rounded-xl border border-foreground/10 bg-background px-3 text-sm outline-none transition placeholder:text-foreground/35 focus:border-accent-soft focus:ring-2 focus:ring-accent-soft/30"
                        min="0"
                        placeholder="40"
                        required
                        type="number"
                        value={formState.standbyPay}
                        onChange={(event) =>
                          updateField("standbyPay", event.target.value)
                        }
                      />
                    </label>

                    <label className="grid min-w-0 gap-2">
                      <span className="text-sm font-medium text-foreground/80">
                        Paga effettiva
                      </span>
                      <input
                        className="h-11 w-full rounded-xl border border-foreground/10 bg-background px-3 text-sm outline-none transition placeholder:text-foreground/35 focus:border-accent-soft focus:ring-2 focus:ring-accent-soft/30"
                        min="0"
                        placeholder="50"
                        required
                        type="number"
                        value={formState.receivedPay}
                        onChange={(event) =>
                          updateField("receivedPay", event.target.value)
                        }
                      />
                    </label>
                  </div>
                </form>
              </AlertDialog.Body>
              <AlertDialog.Footer>
                <Button slot="close" variant="tertiary" onPress={resetForm}>
                  Annulla
                </Button>
                <Button form="new-work-form" type="submit">
                  Inserisci attività
                </Button>
              </AlertDialog.Footer>
            </AlertDialog.Dialog>
          </AlertDialog.Container>
        </AlertDialog.Backdrop>
      </AlertDialog>
    </div>
  );
}
