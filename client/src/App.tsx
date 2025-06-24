import "./App.css";
import {
  Blockfrost,
  Lucid,
  // type LucidEvolution,
  type WalletApi,
} from "@lucid-evolution/lucid";
import { useCardano } from "./context/CardanoContext";
type Wallet = {
  name: string;
  icon: string;
  apiVersion: string;
  enable(): Promise<WalletApi>;
  isEnabled(): Promise<boolean>;
};
function App() {
  function getWallets(): Wallet[] {
    const wallets: Wallet[] = [];
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
  async function connectWallet(wallet: Wallet) {
    const [api, lucid] = await Promise.all([
      wallet.enable(),
      Lucid(new Blockfrost("/bf"), "Preview"),
    ]);
    lucid.selectWallet.fromAPI(api);

    const address = await lucid.wallet().address();
    setCardano((prev) => ({ ...prev, lucid, address }));
  }
  function disconnect() {
    setCardano({});
  }
  return (
    <>
      {wallets.length === 0 && "No wallets found."}
      {wallets.map((wallet, w) => (
        <button key={`wallet.${w}`} onClick={() => connectWallet(wallet)}>
          {wallet.name}
        </button>
      ))}
      {address && (
        <>
          <p>Address: {address}</p>
          <button onClick={disconnect}>disconnect</button>
        </>
      )}
    </>
  );
}

export default App;
