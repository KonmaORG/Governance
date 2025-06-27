"use client";

import { useEffect, useState } from "react";
import { handleError } from "@/lib/utils";
import { mkLucid, walletConnect } from "@/lib/lucid";
import { Button } from "../ui/button";
import { LoaderCircle, LogOut, WalletIcon } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { useCardano } from "@/context/CardanoContext";
import type { CardanoWallet } from "@/types/Cardano";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Label } from "../ui/label";

export default function WalletComponent() {
  const { lucid, wallet, balance, isEmulator, setCardano } = useCardano();
  const [wallets, setWallets] = useState<CardanoWallet[]>();
  const [isOpen, setIsOpen] = useState(false);
  const [connecting, setConnecting] = useState(false);
  useEffect(() => {
    const wallets: CardanoWallet[] = [];
    const { cardano } = window;
    for (const c in cardano) {
      const wallet = cardano[c];
      if (!wallet.apiVersion) continue;
      wallets.push(wallet);
    }
    wallets.sort((l, r) => {
      return l.name.toUpperCase() < r.name.toUpperCase() ? -1 : 1;
    });
    setWallets(wallets);
    mkLucid(setCardano, isEmulator);
  }, []);

  async function onConnectWallet(wallet: CardanoWallet) {
    setIsOpen(false);
    setConnecting(true);
    try {
      if (!lucid) throw "Uninitialized Lucid!!!";
      await walletConnect(setCardano, wallet, lucid);
      console.log("connected");
    } catch (error) {
      handleError(error);
    }
    setConnecting(false);
  }
  function disconnect() {
    setCardano((prev) => ({
      ...prev,
      address: undefined,
      wallet: undefined,
      balance: undefined,
      isEmulator: false,
    }));
    setIsOpen(false);
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          // variant={!wallet ? "default" : "outline"}
          variant={"outline"}
          disabled={connecting}
          className={"max-sm:p-2 max-sm:h-8 border-primary/50 border-2"}
        >
          {connecting ? (
            <>
              <LoaderCircle className="animate-spin" />
              Connecting
            </>
          ) : balance ? (
            <>
              <img className="w-4" src={wallet?.icon || ""} alt="wallet icon" />
              <span className="max-sm:text-xs text-center tracking-wide">
                ₳ {balance.toFixed(2)}
              </span>
            </>
          ) : (
            <>
              <WalletIcon size={30} />
              <span>
                <span className="max-sm:hidden">Connect</span> Wallet
              </span>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-popover py-1 px-2 min-w-[300px] mx-2 bg-opacity-60 rounded-lg backdrop-blur-[6.8px] shadow-[3px_0px_51px_-35px_rgba(0,_0,_255,_0.6)] border ">
        {!wallets ? (
          <div>
            <LoaderCircle className="animate-spin text-blue-500 w-6 h-6" />;
          </div>
        ) : !wallet ? (
          <span>
            <h2 className="text-accent-foreground text-xl font-semibold text-center uppercase py-4">
              Select Wallet
            </h2>
            {/* Emulator Toggle  */}
            <div className="flex items-center justify-between rounded-lg border p-2 mx-2">
              <div className="space-y-0.5">
                <Label className="text-base font-semibold">Emulator Mode</Label>
                <p className="text-sm text-muted-foreground">
                  This will use Emulator Accounts.
                </p>
              </div>
              <Switch
                id="marketing"
                checked={isEmulator}
                onCheckedChange={(checked) => {
                  setIsOpen(false);
                  setTimeout(() => {
                    setCardano((prev) => ({
                      ...prev,
                      isEmulator: checked,
                    }));
                  }, 500);
                }}
                aria-label="Toggle marketing emails"
              />
            </div>
            <div className="flex flex-wrap py-2 justify-center gap-2">
              {!wallets.length ? (
                <div>
                  <p className="uppercase">No Cardano Wallet</p>
                </div>
              ) : (
                wallets.map((w, i) => (
                  <Button
                    key={i}
                    variant={"ghost"}
                    className="group hover:bg-transparent h-24 p-0 w-16"
                    onClick={() => onConnectWallet(w)}
                  >
                    <span className="flex flex-col items-center justify-center gap-1 bg-transparent shadow-none rounded-sm p-1 w-full hover:border hover:border-muted-foreground">
                      <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-accent bg-opacity-50 group-hover:bg-opacity-100">
                        <img src={w.icon} className="w-7" alt="wallet icon" />
                      </span>

                      <span className="text-xs capitalize">{w.name}</span>
                    </span>
                  </Button>
                ))
              )}
            </div>
          </span>
        ) : (
          <>
            <Button
              onClick={disconnect}
              variant={"ghost"}
              className="hover:bg-transparent w-full"
            >
              <LogOut />
              Disconnect
            </Button>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
