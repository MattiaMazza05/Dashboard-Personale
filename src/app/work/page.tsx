import { AddButton } from "./AddButton";
import { TabellaLavoro } from "./Tabella";
import { CardPayment } from "./OverviewCardScroll";
export default function Work() {
  return (
    <div className="ml-5 mr-5">
      <CardPayment />

      <AddButton />
      <TabellaLavoro />
    </div>
  );
}
