import { MintIdentificationToken } from "@/lib/cardano/transactions";
import { Button } from "../ui/button";
import { useCardano } from "@/context/CardanoContext";
export function MintIdentificationButton({
  name,
  color,
}: {
  name: string;
  color: string;
}) {
  const { lucid, address } = useCardano();
  async function mintIdentificationToken() {
    if (!lucid || !address) {
      console.log("Missing lucid or address");
      return;
    }
    const result = await MintIdentificationToken(lucid, address);
    console.log(result);
  }

  return (
    <Button
      className={`bg-${color}-700 p-3 rounded-lg hover:bg-${color}-800`}
      onClick={mintIdentificationToken}
      disabled={!lucid || !address}
    >
      {name}
    </Button>
  );
}
