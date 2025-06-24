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
          <div className="flex gap-2 ">
            <button
              disabled
              className="bg-green-700 p-3 rounded-lg disabled:bg-green-800"
            >
              SubmitProposal
            </button>
            <button
              disabled
              className="bg-green-700 p-3 rounded-lg disabled:bg-green-800"
            >
              VoteProposal
            </button>
            <button
              disabled
              className="bg-green-700 p-3 rounded-lg disabled:bg-green-800"
            >
              ExecuteProposal
            </button>
            <button
              disabled
              className="bg-green-700 p-3 rounded-lg disabled:bg-green-800"
            >
              RejectProposal
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
