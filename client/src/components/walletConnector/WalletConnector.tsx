"use client";
import { useCardano } from "@/context/CardanoContext";
import { mkLucid } from "@/lib/lucid";
import { useEffect } from "react";
import WalletConnector from "@/components/walletConnector/emulator";

export default function WalletConnectors() {
  const { isEmulator, setCardano } = useCardano();
  useEffect(() => {
    mkLucid(setCardano, isEmulator);
  }, [isEmulator]);
  return isEmulator ? <WalletConnector /> : <WalletComponent />;
}
