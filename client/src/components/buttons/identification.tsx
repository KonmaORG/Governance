import { MintIdentificationToken } from "@/lib/cardano/transactions";
import { Button } from "../ui/button";
import { useCardano } from "@/context/CardanoContext";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
export function MintIdentificationButton({
  name,
  color,
}: {
  name: string;
  color: string;
}) {
  const { lucid, address } = useCardano();
  const [submitting, setSubmitting] = useState(false);
  async function mintIdentificationToken() {
    setSubmitting(true);
    if (!lucid || !address) {
      console.log("Missing lucid or address");
      return;
    }
    const result = await MintIdentificationToken(lucid, address);
    console.log(result);
    setSubmitting(false);
  }

  return (
    <Button
      className={`bg-${color}-700 p-3 rounded-lg hover:bg-${color}-800`}
      onClick={mintIdentificationToken}
      disabled={!lucid || !address || submitting}
    >
      {submitting && <LoaderCircle className="animate-spin" />} {name}
    </Button>
  );
}
