import { AttachConfigDatum } from "@/lib/transactions";
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
    <button
      className={`bg-${color}-700 p-3 rounded-lg disabled:bg-${color}-800`}
      onClick={attachConfigDatum}
      disabled={!lucid || !address}
    >
      {name}
    </button>
  );
}
