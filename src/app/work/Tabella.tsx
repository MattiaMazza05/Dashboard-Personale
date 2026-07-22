"use client";

import { Button, Chip, Table, Spinner, EmptyState, toast } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Lavoro } from "@/types/lavoro";

const statusColorMap: Record<string, "success" | "danger" | "warning"> = {
  1: "success",
  0: "warning",
};

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
                    <Button isIconOnly size="sm" variant="tertiary">
                      <Icon className="size-4" icon="gravity-ui:pencil" />
                    </Button>
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
                          console.error("Errore durante l'eliminazione:", error);
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
