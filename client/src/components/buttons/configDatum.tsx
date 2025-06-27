import { AttachConfigDatum } from "@/lib/cardano/transactions";
import { Button } from "../ui/button";
export function AttachConfigButton({
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
  async function attachConfigDatum() {
    if (!lucid || !address) {
      console.log("Missing lucid or address");
      return;
    }
    const result = await AttachConfigDatum(lucid);
    setResult(result);
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
