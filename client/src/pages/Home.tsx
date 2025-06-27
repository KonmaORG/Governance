import TxButtons from "@/components/TxButtons";
import { useCardano } from "@/context/CardanoContext";

export default function Home() {
  const { address } = useCardano();
  return (
    <div>
      {!address ? (
        <>Connect your wallet</>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <p>Address: {address}</p>
          <TxButtons />
        </div>
      )}
    </div>
  );
}
