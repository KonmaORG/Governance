"use client";
import { useCardano } from "@/context/CardanoContext";
import { mkLucid } from "@/lib/lucid";
import { useEffect } from "react";
import WalletConnector from "@/components/walletConnector/emulator";
import WalletComponent from "@/components/walletConnector/WalletComponent";

export default function WalletConnectorButton() {
  const { isEmulator, setCardano } = useCardano();
  useEffect(() => {
    mkLucid(setCardano, isEmulator);
  }, [isEmulator]);
  return isEmulator ? <WalletConnector /> : <WalletComponent />;
}
