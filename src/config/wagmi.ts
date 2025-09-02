import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";
import { http } from "wagmi";

export const config = getDefaultConfig({
  appName: "BallotBox",
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(
      `https://sepolia.infura.io/v3/${import.meta.env.VITE_INFURA_API_KEY}`
    ),
  },
  ssr: false,
});
