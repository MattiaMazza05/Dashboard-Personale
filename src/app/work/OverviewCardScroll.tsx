"use client";

import { Card, Separator, AlertDialog, Button, toast } from "@heroui/react";
import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { getUserId } from "@/hooks/commonHook";
import type { Lavoro, Bonifico } from "@/types/lavoro";

interface CardPaymentProps {
  refreshKey?: number;
}

export function CardPayment({ refreshKey }: CardPaymentProps) {
  const [lavori, setLavori] = useState<Lavoro[]>([]);
  const [bonifici, setBonifici] = useState<Bonifico[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const [resLavori, resBonifici] = await Promise.all([
      supabase.from("lavoro").select("*").eq("user_id", user.id),
      supabase.from("bonifici").select("*").eq("user_id", user.id)
    ]);

    if (resLavori.data) setLavori(resLavori.data);
    if (resBonifici.data) setBonifici(resBonifici.data);

    setLoading(false);
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

  const mesiAnno = [
    { nome: "Gennaio", numero: "01" },
    { nome: "Febbraio", numero: "02" },
    { nome: "Marzo", numero: "03" },
    { nome: "Aprile", numero: "04" },
    { nome: "Maggio", numero: "05" },
    { nome: "Giugno", numero: "06" },
    { nome: "Luglio", numero: "07" },
    { nome: "Agosto", numero: "08" },
    { nome: "Settembre", numero: "09" },
    { nome: "Ottobre", numero: "10" },
    { nome: "Novembre", numero: "11" },
    { nome: "Dicembre", numero: "12" },
  ];

  const annoCorrente = String(new Date().getFullYear());

  const datiMensili = mesiAnno.map((m) => {
    const lavoriDelMese =
      lavori?.filter((item) => {
        return item.data && item.data.startsWith(`${annoCorrente}-${m.numero}`);
      }) || [];

    const attesa = lavoriDelMese.reduce(
      (acc, curr) => acc + Number(curr.paga_attesa || 0),
      0,
    );

    const ore = lavoriDelMese.reduce(
      (acc, curr) => acc + Number(curr.ore_lavorate || 0),
      0,
    );
    const bonificiDelMese =
      bonifici?.filter((b) => {
        if (!b.mese_di_riferimento) return false;
        return (
          b.mese_di_riferimento.trim().toLowerCase() ===
          m.nome.trim().toLowerCase()
        );
      }) || [];

    const effettiva = bonificiDelMese.reduce(
      (acc, curr) => acc + Number(curr.importo_totale || 0),
      0,
    );
    const differenza = effettiva - attesa;
    const numAttivita = lavoriDelMese.length;

    return {
      mese: m.nome,
      attesa,
      effettiva,
      differenza,
      ore,
      numAttivita,
    };
  });

  type RealRevenue = {
    total: number;
    month: string;
  };

  const initialFormState: RealRevenue = {
    total: 0,
    month: "",
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
      toast.danger("Errore durante l'inserimento del bonifico");
      return;
    }
    setIsOpen(false);
    resetForm();
    toast.success("Bonifico inserito");
    fetchData();
  };

  return (
    <>
      <div className="pt-3 flex overflow-x-auto space-x-4 pb-4 scrollbar-thin scrollbar-thumb-gray-300">
        {datiMensili.map((item, index) => (
          <Card
            key={index}
            className="w-[320px] min-w-[320px] shrink-0 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            onClick={() => {
              // Impostiamo il mese nel form state e apriamo il dialog
              setFormState((prev) => ({ ...prev, month: item.mese }));
              setIsOpen(true);
            }}
          >
            <Card.Header>
              <Card.Title className="text-2xl font-bold text-gray-900 mb-6">
                {item.mese}
              </Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Attesa
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {item.attesa} €
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Effettiva
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {item.effettiva} €
                  </p>
                </div>
              </div>
              {item.differenza >= 0 ? (
                <p className="text-sm font-semibold text-emerald-600">
                  + {item.differenza} €
                </p>
              ) : (
                <p className="text-sm font-semibold text-red-600">
                  {item.differenza} €
                </p>
              )}
            </Card.Content>
            <Separator />
            <Card.Footer>
              <p className="text-sm text-gray-500">
                {item.ore}h · {item.numAttivita} attività
              </p>
            </Card.Footer>
          </Card>
        ))}
      </div>
      <AlertDialog isOpen={isOpen} onOpenChange={setIsOpen}>
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
                    Inserisci la paga effettiva per il mese di {formState.month}
                  </AlertDialog.Heading>
                </div>
              </AlertDialog.Header>
              <AlertDialog.Body>
                <form
                  id="new-work-form"
                  className="grid gap-6"
                  onSubmit={handleSubmit}
                >
                  <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_140px]">
                    <label className="grid min-w-0 gap-2 sm:col-span-2">
                      <span className="text-sm font-medium text-foreground/80">
                        Importo
                      </span>
                      <input
                        className="h-11 w-full rounded-xl border border-foreground/10 bg-background px-3 text-sm outline-none transition placeholder:text-foreground/35 focus:border-accent-soft focus:ring-2 focus:ring-accent-soft/30"
                        placeholder="Es. 250..."
                        required
                        type="number"
                        value={formState.total}
                        onChange={(event) =>
                          updateField("total", Number(event.target.value))
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
                  Inserisci
                </Button>
              </AlertDialog.Footer>
            </AlertDialog.Dialog>
          </AlertDialog.Container>
        </AlertDialog.Backdrop>
      </AlertDialog>
    </>
  );
}
