"use client";

import {
  Button,
  Chip,
  Table,
  Spinner,
  EmptyState,
  toast,
  AlertDialog,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Lavoro } from "@/types/lavoro";

const statusColorMap: Record<string, "success" | "danger" | "warning"> = {
  1: "success",
  0: "warning",
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
      toast.danger("Errore durante la modifica");
      return;
    }

    if (!data || data.length === 0) {
      console.error(
        "Nessuna riga aggiornata: probabile blocco RLS (manca una policy UPDATE su 'lavoro') o id inesistente.",
      );
      toast.danger(
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
    <AlertDialog isOpen={isOpen} onOpenChange={setIsOpen}>
      <Button isIconOnly size="sm" variant="tertiary">
        <Icon className="size-4" icon="gravity-ui:pencil" />
      </Button>
      <AlertDialog.Backdrop>
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-[400px]">
            <AlertDialog.CloseTrigger />
            <AlertDialog.Header>
              <AlertDialog.Icon />
              <AlertDialog.Heading>Modifica le informazioni</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <form id={formId} className="grid gap-6" onSubmit={handleUpdate}>
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
                      <option value="Steward">Steward</option>
                      <option value="Università">Università</option>
                    </select>
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
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_140px]">
                  <label className="grid min-w-0 gap-2 sm:col-span-2">
                    <span className="text-sm font-medium text-foreground/80">
                      Descrizione
                    </span>
                    <input
                      className="h-11 w-full  rounded-xl border border-foreground/10 bg-background px-3 text-sm outline-none transition placeholder:text-foreground/35 focus:border-accent-soft focus:ring-2 focus:ring-accent-soft/30"
                      placeholder="Es. concerto..."
                      required
                      type="text"
                      value={formState.description}
                      onChange={(event) =>
                        updateField("description", event.target.value)
                      }
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
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
                </div>
              </form>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button slot="close" variant="tertiary">
                Annulla
              </Button>
              <Button form={formId} type="submit">
                Salva modifiche
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}

interface TabellaLavoroProps {
  refreshKey?: number;
  onSuccess?: () => void;
}

export function TabellaLavoro({ refreshKey, onSuccess }: TabellaLavoroProps) {
  const [lavori, setLavori] = useState<Lavoro[]>([]);
  const [loading, setLoading] = useState(true);

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
  if (loading) return <Spinner />;

  if (lavori.length === 0) {
    return (
      <Table className="min-h-50">
        <Table.ScrollContainer>
          <Table.Content aria-label="Empty table" className="h-full min-w-150">
            <Table.Header>
              <Table.Column isRowHeader>Tipo Attività</Table.Column>
              <Table.Column>Data</Table.Column>
              <Table.Column>Descrizione</Table.Column>
              <Table.Column>Ore</Table.Column>
              <Table.Column>Paga Attesa</Table.Column>
              <Table.Column>Status</Table.Column>
            </Table.Header>
            <Table.Body
              renderEmptyState={() => (
                <EmptyState className="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
                  <Icon className="size-6 text-muted" icon="gravity-ui:tray" />
                  <span className="text-sm text-muted">
                    Non ci sono voci da mostrare
                  </span>
                </EmptyState>
              )}
            >
              {[]}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    );
  }

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label="Team members" className="min-w-150">
          <Table.Header>
            <Table.Column isRowHeader>Tipo Attività</Table.Column>
            <Table.Column>Data</Table.Column>
            <Table.Column>Descrizione</Table.Column>
            <Table.Column>Ore</Table.Column>
            <Table.Column>Paga Attesa</Table.Column>
            <Table.Column>Status</Table.Column>
            <Table.Column>Azioni</Table.Column>
          </Table.Header>
          <Table.Body>
            {lavori.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell>{item.tipo_attivita}</Table.Cell>
                <Table.Cell>{item.data}</Table.Cell>
                <Table.Cell>{item.nome_evento}</Table.Cell>
                <Table.Cell>{item.ore_lavorate}</Table.Cell>
                <Table.Cell>€ {item.paga_attesa} </Table.Cell>
                <Table.Cell>
                  <Chip
                    color={statusColorMap[item.status]}
                    size="sm"
                    variant="soft"
                  >
                    {item.status === 0
                      ? "Prenotato"
                      : item.status == 1
                        ? "Fatto"
                        : "Non Fatto"}
                  </Chip>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-1">
                    <EditActivityDialog item={item} onSuccess={onSuccess} />
                    <Button
                      isIconOnly
                      size="sm"
                      variant="danger-soft"
                      onClick={async () => {
                        const { error } = await supabase
                          .from("lavoro")
                          .delete()
                          .eq("id", item.id);

                        if (error) {
                          console.error(
                            "Errore durante l'eliminazione:",
                            error,
                          );
                          toast.danger("Errore durante l'eliminazione");
                          return;
                        }

                        toast.success("Attività eliminata");
                        onSuccess?.();
                      }}
                    >
                      <Icon className="size-4" icon="gravity-ui:trash-bin" />
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}
