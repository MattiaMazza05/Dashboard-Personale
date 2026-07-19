import { AddButton } from "./AddButton";
import { Calendario } from "./Calendar";
import { TabellaLavoro } from "./Tabella";

export default function Work() {
  return (
    <div>
      <Calendario />
      <AddButton />
      <TabellaLavoro />
    </div>
  );
}
