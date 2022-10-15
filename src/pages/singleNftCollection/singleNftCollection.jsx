import React, { useContext, useEffect, useState, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import classes from "./singleNftCollection.module.css";
import { ReactComponent as SearchIcon } from "../../assets/icon-search.svg";
import NotFound from "../../components/not-found/notFound";
import { GenContext } from "../../gen-state/gen.context";
import SingleNftCard from "../../components/Marketplace/SingleNftCard/SingleNftCard";
import PageControl from "../../components/Marketplace/Page-Control/PageControl";
import ChainDropdown from "../../components/Marketplace/Chain-dropdown/chainDropdown";
import {
  filterBy,
  getCollectionsByChain,
  getCollectionsBySearch,
  rangeBy,
  shuffle,
  sortBy,
} from "../Marketplace/Marketplace-script";

import FilterDropdown from "../../components/Marketplace/Filter-dropdown/FilterDropdown";
import Search from "../../components/Search/Search";
import {
  parseAlgoSingle,
  parseAuroraSingle,
  parseCeloSingle,
  parseNearSingle,
  parsePolygonSingle,
} from "../../renderless/fetch-data/fetchData-script";

const SingleNftCollection = () => {
  const {
    singleAlgoNfts,
    singleAuroraNfts,
    singlePolygonNfts,
    singleCeloNfts,
    singleNearNfts,
    mainnet,
    singleAvaxNfts,
    account,
    searchContainer,
  } = useContext(GenContext);
  const singleAlgoNftsArr = Object.values(singleAlgoNfts);

  const mountRef = useRef(null);
  const [state, setState] = useState({
    collections: [],
    filteredCollection: [],
    currentPage: 1,
    paginate: {},
    currentPageValue: 1,

    notFound: false,
    searchChain: "",
  });

  const { collections, paginate, currentPage, currentPageValue, searchChain, filteredCollection, notFound } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const handlePrev = () => {
    if (currentPage <= 1) return;
    handleSetState({ currentPage: currentPage - 1 });
  };

  const handleNext = () => {
    if (currentPage >= Object.keys(paginate).length) return;
    handleSetState({ currentPage: currentPage + 1 });
  };

  const handleGoto = () => {
    if (currentPageValue < 1 || currentPageValue > Object.keys(paginate).length) return;
    handleSetState({ currentPage: Number(currentPageValue) });
    document.documentElement.scrollTop = 0;
  };

  const handleChainChange = (chain) => {
    const result = getCollectionsByChain({ collections, chain, mainnet });
    handleSetState({ filteredCollection: result, searchChain: chain });
  };

  const handleFilter = ({ type, value }) => {
    if (type === "status") {
      const result = filterBy({ collections, value, account });
      handleSetState({ filteredCollection: result });
    } else if (type === "sort") {
      const result = sortBy({ collections, value });
      handleSetState({ filteredCollection: result });
    } else if (type === "range") {
      const result = rangeBy({ collections, value });
      handleSetState({ filteredCollection: result });
    }
  };

  useEffect(() => {
    let collections = [
      ...(singleAlgoNftsArr || []),
      ...(singleAuroraNfts || []),
      ...(singlePolygonNfts || []),
      ...(singleCeloNfts || []),
      ...(singleNearNfts || []),
      ...(singleAvaxNfts || []),
    ];
    collections = shuffle(collections);
    handleSetState({ collections, filteredCollection: [...collections] });

  }, [singleAlgoNfts, singleAuroraNfts, singleCeloNfts, singlePolygonNfts, singleNearNfts]);


  useEffect(() => {
    const countPerPage = 20;
    const numberOfPages = Math.ceil(filteredCollection.length / countPerPage);
    let startIndex = 0;
    let endIndex = startIndex + countPerPage;
    const paginate = {};
    for (let i = 1; i <= numberOfPages; i += 1) {
      paginate[i] = filteredCollection.slice(startIndex, endIndex);
      startIndex = endIndex;
      endIndex = startIndex + countPerPage;
    }
    handleSetState({ paginate });
  }, [filteredCollection]);

  useEffect(() => {
    if (mountRef.current > 2) {
      handleSetState({ notFound: !Object.keys(paginate).length });
    }
    mountRef.current += 1;
  }, [paginate]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.heading}>
        <div className={classes.title}>
          <h1>{searchChain === "All chains" ? "1 of 1s" : searchChain}</h1>
          <p>View all listed 1 of 1s {`(${filteredCollection.length} Listed)`}</p>
        </div>
        <div className={classes.searchAndFilter}>
          <Search type={"1of1"} searchPlaceholder="Search By 1 of 1s and Users" />

          <div className={classes.filter}>
            <div className={classes.chainDesktop}>
              <ChainDropdown onChainFilter={handleChainChange} />
            </div>
            <FilterDropdown handleFilter={handleFilter} />
          </div>
        </div>
        <div className={classes.chainMobile}>
          <ChainDropdown onChainFilter={handleChainChange} />
        </div>
      </div>
      <div className={classes.wrapper}>
        {Object.keys(paginate).length ? (
          <div className={classes.nfts}>
            {paginate[currentPage].map((nft, idx) => (
              <SingleNftCard key={idx} nft={nft} />
            ))}
          </div>
        ) : !notFound ? (
          <div className={classes.nfts}>
            {[...new Array(8)]
              .map((_, idx) => idx)
              .map((id) => (
                <div className={classes.loader} key={id}>
                  <Skeleton count={1} height={200} />
                  <br />
                  <Skeleton count={1} height={40} />
                </div>
              ))}
          </div>
        ) : (
          <NotFound />
        )}
      </div>
      {Object.keys(paginate).length ? (
        <PageControl controProps={{ handleNext, handlePrev, handleGoto, ...state, handleSetState }} />
      ) : null}
    </div>
  );
};

export default SingleNftCollection;
