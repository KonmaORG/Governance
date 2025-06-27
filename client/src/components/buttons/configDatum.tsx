import { AttachConfigDatum } from "@/lib/cardano/transactions";
import { Button } from "../ui/button";
import { useCardano } from "@/context/CardanoContext";
export function AttachConfigButton({
  name,
  color,
}: {
  name: string;
  color: string;
}) {
  const { lucid, address } = useCardano();

  async function attachConfigDatum() {
    if (!lucid || !address) {
      console.log("Missing lucid or address");
      return;
    }
    const result = await AttachConfigDatum(lucid);
    console.log(result);
  }

  return (
    <Button
      className={`bg-${color}-700 p-3 rounded-lg hover:bg-${color}-800`}
      onClick={attachConfigDatum}
      disabled={!lucid || !address}
    >
      {name}
    </Button>
  );
}
