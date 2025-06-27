import { MintIdentificationToken } from "@/lib/cardano/transactions";
import { Button } from "../ui/button";
export function MintIdentificationButton({
  name,
  color,
  lucid,
  address,
  setResult,
}: {
  name: string;
  color: string;
  lucid: any;
  address: string | null | undefined;
  setResult: (result: string) => void;
}) {
  async function mintIdentificationToken() {
    if (!lucid || !address) {
      console.log("Missing lucid or address");
      return;
    }
    const result = await MintIdentificationToken(lucid, address);
    setResult(result);
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
