"use client";

import { useCallback, useState } from "react";
import { AddButton } from "./AddButton";
import { TabellaLavoro } from "./Tabella";
import { KpiBar } from "./OverviewCardScroll";
import { PageHeader } from "@/components/PageHeader";

export default function Work() {
  const [refreshKey, setRefreshKey] = useState(0);
  const triggerRefresh = useCallback(() => setRefreshKey((key) => key + 1), []);

  return (
    <div>
      <PageHeader title="Lavoro" />
      <KpiBar refreshKey={refreshKey} />
      <AddButton onSuccess={triggerRefresh} />
      <TabellaLavoro refreshKey={refreshKey} onSuccess={triggerRefresh} />
    </div>
  );
}
