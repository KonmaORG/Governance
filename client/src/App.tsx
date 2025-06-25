import "./App.css";
import {
  Lucid,
  type EmulatorAccount,
  // type LucidEvolution,
} from "@lucid-evolution/lucid";
import { useCardano } from "./context/CardanoContext";
import TxButtons from "./components/TxButtons";
import {
  accountA,
  accountB,
  accountC,
  accountD,
  emulator,
} from "./lib/emulator";

function App() {
  function getWallets(): EmulatorAccount[] {
    const wallets: EmulatorAccount[] = [accountA, accountB, accountC, accountD];
    return wallets;
  }

  const wallets = getWallets();
  // const [lucid, setLucid] = useState<LucidEvolution | null>(null);
  const { address, setCardano } = useCardano();
  async function connectWallet(account: EmulatorAccount) {
    const lucidInstance = await Lucid(emulator, "Custom");
    lucidInstance.selectWallet.fromSeed(account.seedPhrase);
    const address = await lucidInstance.wallet().address();
    setCardano((prev) => ({ ...prev, lucid: lucidInstance, address }));
  }
  function disconnect() {
    setCardano({});
  }
  const awaitBlock = () => {
    emulator.awaitBlock();
    console.log("awaited block");
    console.log("current block height: ", emulator.blockHeight);
  };

  return (
    <>
      <div className="flex justify-center items-center gap-2 w-full mx-auto">
        {wallets.map((wallet, w) => (
          <button
            key={`wallet.${w}`}
            className="bg-green-700 p-3 rounded-lg"
            onClick={() => connectWallet(wallet)}
          >
            {wallet.address.slice(0, 8)}...{wallet.address.slice(-8)}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center gap-2 w-full mx-auto">
        <p>Address: {address}</p>
        <div className="flex gap-2">
          <button className="bg-red-700 p-3 rounded-lg" onClick={disconnect}>
            disconnect
          </button>
          <button className="bg-slate-700 p-3 rounded-lg" onClick={awaitBlock}>
            await block
          </button>
        </div>
        <TxButtons />
      </div>
    </>
  );
}

export default App;
