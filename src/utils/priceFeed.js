import { async } from "@firebase/util";
import { providers, Contract, BigNumber, utils } from "ethers";

const provider = new providers.JsonRpcProvider(process.env.REACT_APP_ALCHEMY_URL);
const aggregatorV3InterfaceABI = [
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "description",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint80", name: "_roundId", type: "uint80" }],
    name: "getRoundData",
    outputs: [
      { internalType: "uint80", name: "roundId", type: "uint80" },
      { internalType: "int256", name: "answer", type: "int256" },
      { internalType: "uint256", name: "startedAt", type: "uint256" },
      { internalType: "uint256", name: "updatedAt", type: "uint256" },
      { internalType: "uint80", name: "answeredInRound", type: "uint80" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "latestRoundData",
    outputs: [
      { internalType: "uint80", name: "roundId", type: "uint80" },
      { internalType: "int256", name: "answer", type: "int256" },
      { internalType: "uint256", name: "startedAt", type: "uint256" },
      { internalType: "uint256", name: "updatedAt", type: "uint256" },
      { internalType: "uint80", name: "answeredInRound", type: "uint80" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "version",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

const ETH_USD = process.env.REACT_APP_ETH_USD;
const CELO_ETH = process.env.REACT_APP_CELO_ETH;
const MATIC_USD = process.env.REACT_APP_MATIC_USD;
const NEAR_USD = process.env.REACT_APP_NEAR_USD;
const AVAX_USD = process.env.REACT_APP_AVAX_USD;

export const getLatestPriceCelo = async () => {
  const ethPriceFeed = new Contract(ETH_USD, aggregatorV3InterfaceABI, provider);
  const celoPriceFeed = new Contract(CELO_ETH, aggregatorV3InterfaceABI, provider);
  ethPriceFeed.latestRoundData().then((data) => {
    const ethUSDPrice = Number(utils.formatUnits(data[1], 8));
    celoPriceFeed.latestRoundData().then((celoData) => {
      const celoETHPrice = celoData[1];
      const celoUSDPrice = (celoETHPrice * ethUSDPrice) / 10 ** 18;

      return celoUSDPrice;
    });
  });
};

export const getLatestPriceMatic = async () => {
  const maticPriceFeed = new Contract(MATIC_USD, aggregatorV3InterfaceABI, provider);
  maticPriceFeed.latestRoundData().then((maticData) => {
    console.log("PRRSDAFADFADSFADSF", Number(utils.formatUnits(maticData[1], 8)));

    return Number(utils.formatUnits(maticData[1], 8));
  });
};

export const getLatestPriceNear = async () => {
  const nearPriceFeed = new Contract(NEAR_USD, aggregatorV3InterfaceABI, provider);
  nearPriceFeed.latestRoundData().then((nearData) => {
    return Number(utils.formatUnits(nearData[1], 8));
  });
};

export const getLatestPriceAvax = async () => {
  const avaxPriceFeed = new Contract(AVAX_USD, aggregatorV3InterfaceABI, provider);
  avaxPriceFeed.latestRoundData().then((avaxData) => {
    return Number(utils.formatUnits(avaxData[1], 8));
  });
};
