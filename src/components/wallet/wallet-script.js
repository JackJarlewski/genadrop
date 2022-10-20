import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";
import {
  setNotification,
  setProposedChain,
  setConnector,
  setChainId,
  setAccount,
  setMainnet,
  setClipboard,
  setToggleWalletPopup,
  setSwitchWalletNotification,
} from "../../gen-state/gen.actions";
import { chainIdToParams } from "../../utils/chainConnect";
import blankImage from "../../assets/blank.png";
import supportedChains from "../../utils/supportedChains";
import * as WS from "./wallet-script";
import getConfig from "../wallet-popup/nearConfig";
import { setupWalletSelector } from "@near-wallet-selector/core";
import LedgerIconUrl from "@near-wallet-selector/ledger/assets/ledger-icon.png";
import SenderIconUrl from "@near-wallet-selector/sender/assets/sender-icon.png";
import NightlyIconUrl from "@near-wallet-selector/nightly/assets/nightly.png";
import MathIconUrl from "@near-wallet-selector/math-wallet/assets/math-wallet-icon.png";
import NearIconUrl from "@near-wallet-selector/near-wallet/assets/near-wallet-icon.png";
import { setupLedger } from "@near-wallet-selector/ledger";
import "@near-wallet-selector/modal-ui/styles.css";
import { setupSender } from "@near-wallet-selector/sender";
import { setupNightly } from "@near-wallet-selector/nightly";
import { setupMathWallet } from "@near-wallet-selector/math-wallet";
import { setupNearWallet } from "@near-wallet-selector/near-wallet";

export const breakAddress = (address = "", width = 6) => {
  if (address) return `${address.slice(0, width)}...${address.slice(-width)}`;
};

export const getConnectedChain = (chainId) => {
  const c = supportedChains[chainId];
  if (!c) return blankImage;
  return c.icon;
};

export const getNetworkID = () => {
  return new Promise(async (resolve) => {
    const networkId = await window.ethereum.request({ method: "net_version" });
    resolve(Number(networkId));
  });
};

export const initializeConnection = async (walletProps) => {
  const { dispatch, handleSetState, rpc, mainnet } = walletProps;
  const search = new URL(document.location).searchParams;
  let walletConnectProvider = null;
  if (window.localStorage.walletconnect) {
    let newRpc = null;
    const storedProvider = JSON.parse(window.localStorage.walletconnect);
    if (storedProvider.chainId === 4160) {
      newRpc = {
        4160: mainnet ? "https://node.algoexplorerapi.io" : "https://node.testnet.algoexplorerapi.io",
      };
    } else {
      newRpc = {
        [storedProvider.chainId]: chainIdToParams[storedProvider.chainId].rpcUrls[0],
      };
    }
    walletConnectProvider = new WalletConnectProvider({
      rpc: newRpc,
    });
    dispatch(setProposedChain(storedProvider.chainId));
    dispatch(setConnector(walletConnectProvider));
    handleSetState({ overrideWalletConnect: true });
    handleSetState({ walletConnectProvider });
    walletConnectProvider.on("accountsChanged", (accounts) => {
      dispatch(setAccount(accounts[0]));
      // dispatch(setChainId(walletConnectProvider.chainId));
    });

    // Subscribe to chainId change
    walletConnectProvider.on("chainChanged", (chainId) => {
      dispatch(setChainId(chainId));
    });

    // Subscribe to session disconnection
    walletConnectProvider.on("disconnect", (code, reason) => {
      WS.disconnectWallet(walletProps);
    });
  } else if (rpc) {
    walletConnectProvider = new WalletConnectProvider({
      rpc,
    });
    handleSetState({ walletConnectProvider });
    walletConnectProvider.on("accountsChanged", (accounts) => {
      dispatch(setAccount(accounts[0]));
      // dispatch(setChainId(walletConnectProvider.chainId));
    });

    // Subscribe to chainId change
    walletConnectProvider.on("chainChanged", (chainId) => {
      dispatch(setChainId(chainId));
    });

    // Subscribe to session disconnection
    walletConnectProvider.on("disconnect", (code, reason) => {
      WS.disconnectWallet(walletProps);
    });
  } else if (
    window.localStorage.near_app_wallet_auth_key ||
    search.get("account_id") ||
    window.localStorage.getItem("near_wallet") === "connected_to_near"
  ) {
    const network = process.env.REACT_APP_ENV_STAGING === "true" ? "testnet" : "mainnet";
    const nearConfig = getConfig(network);

    const walletSelector = await setupWalletSelector({
      network: nearConfig,
      modules: [
        setupNearWallet({ iconUrl: NearIconUrl }),
        setupLedger({ iconUrl: LedgerIconUrl }),
        setupSender({ iconUrl: SenderIconUrl }),
        setupMathWallet({ iconUrl: MathIconUrl }),
        setupNightly({ iconUrl: NightlyIconUrl }),
      ],
    });

    const isSignedIn = walletSelector.isSignedIn();
    window.selector = walletSelector;
    const connectedChain = process.env.REACT_APP_ENV_STAGING === "true" ? 1111 : 1112;
    console.log(isSignedIn);
    if (isSignedIn) {
      window.localStorage.setItem("near_wallet", "connected_to_near");
      dispatch(setChainId(connectedChain));
      dispatch(setAccount(walletSelector.store.getState().accounts[0].accountId));
      dispatch(setProposedChain(connectedChain));
      dispatch(setConnector(walletSelector.wallet()));
      dispatch(
        setNotification({
          message: `Your site is connected to ${supportedChains[1111].label}`,
          type: "success",
        })
      );
    }
    return;
  } else if (window.ethereum !== undefined) {
    WS.updateAccount(walletProps);

    const ethereumProvider = new ethers.providers.Web3Provider(window.ethereum);
    dispatch(setConnector(ethereumProvider));
    const { ethereum } = window;
    // Subscribe to accounts change
    ethereum.on("accountsChanged", function (accounts) {
      WS.updateAccount(walletProps);
    });

    // Subscribe to chainId change
    ethereum.on("chainChanged", (chainId) => {
      const ethereumProvider = new ethers.providers.Web3Provider(window.ethereum);
      dispatch(setConnector(ethereumProvider));
      WS.updateAccount(walletProps);
    });
    handleSetState({ isMetamask: true });
    return;
  } else {
    handleSetState({ isMetamask: false });
    return;
  }

  // Subscribe to accounts change
};

export const setNetworkType = ({ dispatch, handleSetState }) => {
  dispatch(setMainnet(process.env.REACT_APP_ENV_STAGING === "false"));
  handleSetState({ network: process.env.REACT_APP_ENV_STAGING === "false" ? "mainnet" : "testnet" });
};

export const connectWithQRCode = async ({ walletConnectProvider, dispatch, supportedChains }) => {
  const proposedChain = Object.keys(walletConnectProvider.rpc)[0];
  try {
    await walletConnectProvider.enable();
    if (proposedChain !== String(walletConnectProvider.chainId)) {
      walletConnectProvider.disconnect();
      setTimeout(() => {
        alert(
          `Invalid connection! Please ensure that ${supportedChains[proposedChain].label} network is selected on your scanning wallet`
        );
        window.location.reload();
      }, 100);
    }
    dispatch(setConnector(walletConnectProvider));
  } catch (error) {
    console.log("error: ", error);
    dispatch(
      setNotification({
        message: "Connection failed",
        type: "error",
      })
    );
    dispatch(setProposedChain(null));
  }
};

export const connectWithMetamask = async (walletProps) => {
  const { dispatch, walletConnectProvider, supportedChains, proposedChain } = walletProps;
  let res;
  res = await supportedChains[proposedChain]?.switch(proposedChain);
  if (!res) {
    await WS.disconnectWalletConnectProvider(walletConnectProvider);
    const activeChain = await WS.getNetworkID();
    if (activeChain === proposedChain) {
      WS.updateAccount(walletProps);
    }
  } else if (res.message.includes("Unrecognized")) {
    res = await supportedChains[proposedChain].add(proposedChain);
    if (!res) {
      await WS.disconnectWalletConnectProvider(walletConnectProvider);
    } else {
      dispatch(
        setNotification({
          message: "Failed to add network",
          type: "error",
        })
      );
      dispatch(setProposedChain(null));
    }
  } else {
    dispatch(
      setNotification({
        message: "Connection failed",
        type: "error",
      })
    );
    dispatch(setProposedChain(null));
  }
};

export const initConnectWallet = (walletProps) => {
  const { dispatch } = walletProps;
  dispatch(setToggleWalletPopup(true));
};

export const connectWallet = async (walletProps) => {
  const { dispatch, proposedChain, connectionMethod, walletProviderRef, handleSetState, mainnet } = walletProps;
  if (connectionMethod === "metamask") {
    if (window?.ethereum !== undefined) {
      await WS.connectWithMetamask(walletProps);
      const ethereumProvider = new ethers.providers.Web3Provider(window.ethereum);
      dispatch(setConnector(ethereumProvider));
    } else {
      dispatch(setToggleWalletPopup(false));
      dispatch(
        setNotification({
          message: "You need to install metamask to continue",
          type: "error",
        })
      );
      dispatch(setClipboard("https://metamask.io/"));
    }
  } else if (connectionMethod === "walletConnect") {
    walletProviderRef.current = 2;
    if (proposedChain === 4160) {
      handleSetState({
        rpc: {
          4160: mainnet ? "https://node.algoexplorerapi.io" : "https://node.testnet.algoexplorerapi.io",
        },
      });
    } else {
      handleSetState({
        rpc: {
          [proposedChain]: chainIdToParams[proposedChain].rpcUrls[0],
        },
      });
    }
  }
};

export const disconnectWalletConnectProvider = async (walletConnectProvider) => {
  if (walletConnectProvider?.connected) {
    try {
      await walletConnectProvider.disconnect();
    } catch (error) {
      console.log("error disconneting: ", error);
    }
  }
};

export const updateAccount = async (walletProps) => {
  const { dispatch, walletConnectProvider, mainnet } = walletProps;
  const { ethereum } = window;
  let [accounts] = await ethereum.request({
    method: "eth_accounts", // eth_accounts should not allow metamask to popup on page load //eth_requestAccounts
  });
  const networkId = await ethereum.request({ method: "net_version" });
  await WS.disconnectWalletConnectProvider(walletConnectProvider);
  window.localStorage.removeItem("undefined_wallet_auth_key");
  window.localStorage.removeItem("nearWallet");
  const getEnv = supportedChains[networkId] ? mainnet === supportedChains[networkId].isMainnet : false;
  if (!getEnv) {
    WS.disconnectWallet(walletProps);
    dispatch(setSwitchWalletNotification(true));
    return;
  }
  dispatch(setSwitchWalletNotification(false));
  const isSupported = Object.keys(supportedChains).includes(networkId);
  if (!isSupported) {
    WS.disconnectWallet(walletProps);
    dispatch(setToggleWalletPopup(true));
  } else {
    dispatch(setToggleWalletPopup(false));
    if (!accounts) {
      [accounts] = await ethereum.request({
        method: "eth_requestAccounts",
      });
      if (!accounts) {
        WS.disconnectWallet(walletProps);
        dispatch(
          setNotification({
            message: "Please connect your site manually from your wallet extension.",
            type: "warning",
          })
        );
      }
    } else {
      dispatch(setChainId(Number(networkId)));
      dispatch(setAccount(accounts));
      dispatch(
        setNotification({
          message: `Your site is connected to ${supportedChains[networkId].label}`,
          type: "success",
        })
      );
    }
  }
};

export const disconnectWallet = async ({ walletConnectProvider, dispatch, history, pathname, handleSetState }) => {
  await WS.disconnectWalletConnectProvider(walletConnectProvider);
  dispatch(setProposedChain(null));
  dispatch(setChainId(null));
  if (localStorage.getItem("near_wallet") === "connected_to_near") {
    const nearLogout = await window?.selector?.wallet();
    nearLogout.signOut();
    window.localStorage.removeItem("near_wallet");
  }
  handleSetState({ toggleDropdown: false });
  if (window.localStorage.undefined_wallet_auth_key || window.localStorage.nearConnection) {
    window.localStorage.removeItem("undefined_wallet_auth_key");
    window.localStorage.removeItem("nearConnection");
  }
  if (pathname.includes("/profile")) {
    history.push("/marketplace");
  }
  dispatch(setAccount(null));
};
