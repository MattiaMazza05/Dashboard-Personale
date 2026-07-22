export interface Lavoro {
  id: number;
  user_id: string;
  tipo_attivita: string;
  nome_evento: string;
  ore_lavorate: number;
  data: string;
  paga_attesa: number;
  status: 0 | 1;
}

export interface Bonifico {
  id: number;
  user_id: string;
  importo_totale: number;
  mese_di_riferimento: string;
}
