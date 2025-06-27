import TxButtons from "@/components/TxButtons";
import WalletConnectorButton from "@/components/walletConnector/WalletConnectorButton";
import { useCardano } from "@/context/CardanoContext";

export default function Home() {
  const { address } = useCardano();
  return (
    <div>
      {!address ? (
        <>
          <span>Connect your wallet</span>
          <WalletConnectorButton />
        </>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <TxButtons />
        </div>
      )}
    </div>
  );
}
