import { MintIdentificationToken } from "@/lib/transactions";
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
    <button
      className={`bg-${color}-700 p-3 rounded-lg disabled:bg-${color}-800`}
      onClick={mintIdentificationToken}
      disabled={!lucid || !address}
    >
      {name}
    </button>
  );
}
