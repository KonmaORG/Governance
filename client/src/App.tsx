// non Emulator
import "./App.css";
import {
  Blockfrost,
  Lucid,
  // type LucidEvolution,
} from "@lucid-evolution/lucid";
import { useCardano } from "./context/CardanoContext";
import TxButtons from "./components/TxButtons";
import { BF_PID, BF_URL } from "./config/constants";
import type { CardanoWallet } from "@/types/Cardano";
import Navbar from "./components/navbar";

function App() {
  function getWallets(): CardanoWallet[] {
    const wallets: CardanoWallet[] = [];
    const cardano = (window as any).cardano;

    for (const c in cardano) {
      const wallet = cardano[c];

      if (!wallet.apiVersion) continue;

      wallets.push(wallet);
    }

    return wallets.sort((l, r) => {
      return l.name.toUpperCase() < r.name.toUpperCase() ? -1 : 1;
    });
  }

  const wallets = getWallets();
  // const [lucid, setLucid] = useState<LucidEvolution | null>(null);
  const { address, setCardano } = useCardano();
  async function connectWallet(wallet: CardanoWallet) {
    const [api, lucid] = await Promise.all([
      wallet.enable(),
      Lucid(new Blockfrost(BF_URL, BF_PID), "Preview"),
    ]);
    lucid.selectWallet.fromAPI(api);

    const address = await lucid.wallet().address();
    setCardano((prev) => ({ ...prev, lucid, address }));
  }
  function disconnect() {
    setCardano({});
  }

  return (
    <div className="w-full h-screen">
      <Navbar />
      {wallets.length === 0 && "No wallets found."}
      {!address ? (
        wallets.map((wallet, w) => (
          <button
            key={`wallet.${w}`}
            className="bg-green-700 p-3 rounded-lg"
            onClick={() => connectWallet(wallet)}
          >
            {wallet.name}
          </button>
        ))
      ) : (
        <div className="flex flex-col items-center gap-2">
          <p>Address: {address}</p>
          <button className="bg-red-700 p-3 rounded-lg" onClick={disconnect}>
            disconnect
          </button>
          <TxButtons />
        </div>
      )}
    </div>
  );
}

export default App;
