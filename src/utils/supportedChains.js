import algoIcon from "../assets/icon-algo.svg";
import auroraIcon from "../assets/icon-aurora.svg";
import celoIcon from "../assets/icon-celo.svg";
import polygonIcon from "../assets/icon-polygon.svg";
import nearIcon from "../assets/icon-near.svg";
// import solanaIcon from "../assets/icon-solana.svg";
import avalancheIcon from "../assets/icon-avalanche.svg";
import { addChain, switchChain } from "./chainConnect";

const supportedChains = {
  4160: {
    id: "algorand",
    label: "Algorand",
    chain: "Algorand",
    icon: algoIcon,
    symbol: "ALGO",
    networkId: 4160,
    add: null,
    isMainnet: process.env.REACT_APP_ENV_STAGING === "false",
    switch: null,
  },
  1313161554: {
    id: "aurora-near",
    label: "Aurora",
    chain: "Aurora",
    icon: auroraIcon,
    symbol: "AETH",
    explorer: "https://aurorascan.dev/",
    networkId: 1313161554,
    add: addChain,
    isMainnet: true,
    switch: switchChain,
    coinGeckoLabel: "ethereum",
  },
  137: {
    id: "matic-network",
    label: "Polygon",
    chain: "Polygon",
    explorer: "https://polygonscan.com/address",
    icon: polygonIcon,
    symbol: "MATIC",
    networkId: 137,
    livePrice: "https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd",
    add: addChain,
    isMainnet: true,
    switch: switchChain,
    coinGeckoLabel: "matic-network",
  },
  42220: {
    id: "celo",
    label: "Celo",
    chain: "Celo",
    icon: celoIcon,
    symbol: "CGLD",
    networkId: 42220,
    explorer: "https://explorer.celo.org/address",
    add: addChain,
    isMainnet: true,
    switch: switchChain,
    coinGeckoLabel: "celo",
  },
  80001: {
    id: "matic-network",
    label: "Polygon Testnet",
    chain: "Polygon",
    icon: polygonIcon,
    symbol: "MATIC",
    explorer: "https://mumbai.polygonscan.com/address",
    networkId: 80001,
    livePrice: "https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd",
    add: addChain,
    isMainnet: false,
    switch: switchChain,
    coinGeckoLabel: "matic-network",
  },
  1111: {
    id: "near",
    label: "Near Testnet",
    chain: "Near",
    icon: nearIcon,
    livePrice: "",
    symbol: "",
    networkId: 1111,
    explorer: "https://explorer.testnet.near.org/?query=",
    add: null,
    isMainnet: false,
    switch: null,
    coinGeckoLabel: "",
  },
  1112: {
    id: "near",
    label: "Near",
    chain: "Near",
    icon: nearIcon,
    livePrice: "",
    symbol: "",
    networkId: 1112,
    explorer: "https://explorer.near.org/?query=",
    add: null,
    isMainnet: true,
    switch: null,
    coinGeckoLabel: "",
  },
  44787: {
    label: "Celo Testnet (Alfajores)",
    chain: "Celo",
    icon: celoIcon,
    id: "celo",
    symbol: "CGLD",
    networkId: 44787,
    add: addChain,
    explorer: "https://alfajores-blockscout.celo-testnet.org/address/",
    isMainnet: false,
    livePrice: "https://api.coingecko.com/api/v3/simple/price?ids=celo&vs_currencies=usd",
    switch: switchChain,
    coinGeckoLabel: "celo",
    comingSoon: false,
  },
  // 62320: {
  //   label: "Celo Testnet (Baklava)",
  //   chain: "Celo",
  //   icon: celoIcon,
  //   symbol: "CGLD",
  //   networkId: 62320,
  //   add: addChain,
  //   isMainnet: false,
  //   switch: switchChain,
  //   coinGeckoLabel: "celo",
  //   comingSoon: true,
  // },
  1313161555: {
    id: "ethereum",
    label: "Aurora Testnet",
    chain: "Aurora",
    icon: auroraIcon,
    livePrice: "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
    symbol: "AETH",
    networkId: 1313161555,
    explorer: "https://testnet.aurorascan.dev/address/",
    add: addChain,
    isMainnet: false,
    switch: switchChain,
    coinGeckoLabel: "ethereum",
  },
  43114: {
    id: "avalanche",
    label: "Avalanche",
    chain: "Avalanche",
    icon: avalancheIcon,
    livePrice: "https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2&vs_currencies=usd",
    symbol: "AVAX",
    networkId: 43114,
    explorer: "https://snowtrace.io/",
    add: addChain,
    isMainnet: true,
    switch: switchChain,
    coinGeckoLabel: "avalanche-2",
  },

  43113: {
    id: "avalanche",
    label: "Avalanche Testnet",
    chain: "Avalanche",
    icon: avalancheIcon,
    livePrice: "https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2&vs_currencies=usd",
    symbol: "AVAX",
    networkId: 43113,
    explorer: "https://testnet.snowtrace.io/",
    add: addChain,
    isMainnet: false,
    switch: switchChain,
    coinGeckoLabel: "avalanche-2",
  },

  // "add-avalanche-t-id": {
  //   id: "avalanche",
  //   label: "Avalanche Testnet",
  //   chain: "Avalanche",
  //   icon: avalancheIcon,
  //   livePrice: "",
  //   symbol: "",
  //   networkId: null,
  //   explorer: "",
  //   add: null,
  //   isMainnet: false,
  //   switch: null,
  //   coinGeckoLabel: "",
  //   comingSoon: true,
  // },
  // "add-solana-id": {
  //   id: "solana",
  //   label: "Solana",
  //   chain: "Solana",
  //   icon: solanaIcon,
  //   livePrice: "",
  //   symbol: "",
  //   networkId: null,
  //   explorer: "",
  //   add: null,
  //   isMainnet: true,
  //   switch: null,
  //   coinGeckoLabel: "",
  //   comingSoon: true,
  // },
  // "add-solana-t-id": {
  //   id: "solana",
  //   label: "Solana Testnet",
  //   chain: "Solana",
  //   icon: solanaIcon,
  //   livePrice: "",
  //   symbol: "",
  //   networkId: null,
  //   explorer: "",
  //   add: null,
  //   isMainnet: false,
  //   switch: null,
  //   coinGeckoLabel: "",
  //   comingSoon: true,
  // },
};

export default supportedChains;
