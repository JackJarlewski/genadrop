import React, { useReducer, createContext } from "react";
import { genReducer, INITIAL_STATE } from "./gen.reducer";

export const GenContext = createContext();

const GenContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(genReducer, INITIAL_STATE);

  const {
    layers,
    preview,
    mintAmount,
    nftLayers,
    combinations,
    isLoading,
    mintInfo,
    currentDnaLayers,
    collectionName,
    outputFormat,
    connector,
    chainId,
    proposedChain,
    account,
    rule,
    isRule,
    collections,
    algoCollections,
    auroraCollections,
    polygonCollections,
    celoCollections,
    singleAuroraNfts,
    singleAlgoNfts,
    singleCeloNfts,
    singlePolygonNfts,
    graphCollections,
    singleNfts,
    notification,
    switchWalletNotification,
    clipboardMessage,
    loaderMessage,
    collectionDescription,
    didMount,
    mainnet,
    prompt,
    promptAsset,
    promptLayer,
    promptRules,
    toggleWalletPopup,
    activeCollection,
    imageQuality,
    zip,
    connectFromMint,
  } = state;

  return (
    <GenContext.Provider
      value={{
        layers,
        preview,
        mintAmount,
        nftLayers,
        combinations,
        isLoading,
        mintInfo,
        currentDnaLayers,
        collectionName,
        outputFormat,
        connector,
        chainId,
        proposedChain,
        account,
        graphCollections,
        rule,
        isRule,
        singleCeloNfts,
        collections,
        notification,
        switchWalletNotification,
        clipboardMessage,
        loaderMessage,
        collectionDescription,
        didMount,
        mainnet,
        singleNfts,
        prompt,
        promptAsset,
        promptLayer,
        promptRules,
        algoCollections,
        auroraCollections,
        polygonCollections,
        celoCollections,
        singleAuroraNfts,
        singleAlgoNfts,
        singlePolygonNfts,
        toggleWalletPopup,
        activeCollection,
        imageQuality,
        zip,
        connectFromMint,
        dispatch,
      }}
    >
      {children}
    </GenContext.Provider>
  );
};

export default GenContextProvider;
