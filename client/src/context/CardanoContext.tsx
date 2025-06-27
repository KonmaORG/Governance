"use client";
import {
  createContext,
  type Dispatch,
  type SetStateAction,
  useContext,
  useState,
  useCallback,
} from "react";
import { type Address, type LucidEvolution } from "@lucid-evolution/lucid";
import type { CardanoWallet } from "../types/Cardano";

// Default Cardano state
const defaultCardano: Cardano = {
  wallet: null,
  address: null,
  balance: null,
  isEmulator: false,
};

export type Cardano = {
  lucid?: LucidEvolution | null;
  wallet?: CardanoWallet | null;
  address?: Address | null;
  balance?: number | null;
  isEmulator?: boolean;
};

type CardanoContextType = Cardano & {
  setCardano: Dispatch<SetStateAction<Cardano>>;
  resetCardano: () => void;
};

export const CardanoContext = createContext<CardanoContextType | undefined>(
  undefined
);

export default function CardanoProvider(props: { children: React.ReactNode }) {
  const [cardano, setCardano] = useState<Cardano>({ isEmulator: true });

  // Reset to default with isEmulator false
  const resetCardano = useCallback(() => {
    setCardano({ ...defaultCardano });
  }, []);

  const contextValue: CardanoContextType = {
    ...cardano,
    setCardano,
    resetCardano,
  };

  return (
    <CardanoContext.Provider value={contextValue}>
      {props.children}
    </CardanoContext.Provider>
  );
}

export const useCardano = () => {
  const context = useContext(CardanoContext);
  if (!context) {
    throw new Error(
      "useCardano must be used within a CardanoProvider fix by wrapping your component."
    );
  }
  return context;
};
