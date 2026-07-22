"use client";

import { useCallback, useState } from "react";
import { AddButton } from "./AddButton";
import { TabellaLavoro } from "./Tabella";
import { CardPayment } from "./OverviewCardScroll";

export default function Work() {
  const [refreshKey, setRefreshKey] = useState(0);
  const triggerRefresh = useCallback(() => setRefreshKey((key) => key + 1), []);

  return (
    <div className="ml-5 mr-5">
      <CardPayment refreshKey={refreshKey} />
      <AddButton onSuccess={triggerRefresh} />
      <TabellaLavoro refreshKey={refreshKey} onSuccess={triggerRefresh} />
    </div>
  );
}
