import React, { useContext, useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import classes from "./preview.module.css";
import { GenContext } from "../../gen-state/gen.context";
import {
  addDescription,
  deleteAsset,
  setNotification,
  setLoader,
  setZip,
  setMintAmount,
  setMintInfo,
  setPrompt,
  promptDeleteAsset,
} from "../../gen-state/gen.actions";
import {
  addGif,
  addToCollection,
  generateGif,
  handleCollectionDescription,
  handleCollectionName,
  handleDeleteAndReplace,
  handleFormatChange,
} from "./preview-script";
import TextEditor from "./text-editor";
import { handleDownload } from "../../utils/index2";
import arrowIconLeft from "../../assets/icon-arrow-left.svg";
import { ReactComponent as CloseIcon } from "../../assets/icon-close.svg";
import { ReactComponent as CheckIcon } from "../../assets/check-solid.svg";
import { ReactComponent as PlayIcon } from "../../assets/icon-play.svg";
import warnIcon from "../../assets/icon-warn.svg";
import CaretDown from "../../assets/icon-caret-down.svg";
import CaretUP from "../../assets/icon-caret-up.svg";
import GenadropToolTip from "../../components/Genadrop-Tooltip/GenadropTooltip";

const Preview = () => {
  const {
    nftLayers,
    currentDnaLayers,
    dispatch,
    combinations,
    mintAmount,
    mintInfo,
    collectionName,
    collectionDescription,
    outputFormat,
    rule,
    layers,
    promptAsset,
    imageQuality,
  } = useContext(GenContext);

  const [state, setState] = useState({
    currentPage: 1,
    paginate: {},
    currentPageValue: 1,
    enableAllDescription: true,
    duration: "",
    gifShow: null,
    toggleGuide: false,
    gifs: [],
    gifImages: [],
    editorAction: { index: "", id: "" },
  });

  const {
    currentPage,
    paginate,
    currentPageValue,
    enableAllDescription,
    gifShow,
    gifs,
    gifImages,
    duration,
    toggleGuide,
  } = state;

  const ipfsRef = useRef(null);
  const arweaveRef = useRef(null);
  const history = useHistory();
  const canvas = document.createElement("canvas");

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const previewProps = {
    nftLayers,
    currentDnaLayers,
    dispatch,
    combinations,
    mintAmount,
    mintInfo,
    collectionName,
    collectionDescription,
    outputFormat,
    rule,
    layers,
    promptAsset,
    imageQuality,
    enableAllDescription,
    gifShow,
    gifs,
    gifImages,
    duration,
    toggleGuide,
    canvas,
    ipfsRef,
    arweaveRef,
    handleSetState,
  };

  const handleDelete = (val) => {
    dispatch(setPrompt(promptDeleteAsset(val)));
  };

  const handleDescription = (input) => {
    dispatch(addDescription({ id: input.id, description: input.value }));
  };

  const handlePrev = () => {
    if (currentPage <= 1) return;
    handleSetState({ currentPage: currentPage - 1 });
    document.documentElement.scrollTop = 0;
  };

  const handleNext = () => {
    if (currentPage >= Object.keys(paginate).length) return;
    handleSetState({ currentPage: currentPage + 1 });
    document.documentElement.scrollTop = 0;
  };

  const handleGoto = () => {
    if (currentPageValue < 1 || currentPageValue > Object.keys(paginate).length) return;
    handleSetState({ currentPage: Number(currentPageValue) });
    document.documentElement.scrollTop = 0;
  };

  useEffect(() => {
    dispatch(setMintInfo(""));
  }, [dispatch, mintAmount]);

  useEffect(() => {
    const countPerPage = 20;
    const numberOfPages = Math.ceil(nftLayers.length / countPerPage);
    let startIndex = 0;
    let endIndex = startIndex + countPerPage;
    const paginateObj = {};
    for (let i = 1; i <= numberOfPages; i += 1) {
      paginateObj[i] = nftLayers.slice(startIndex, endIndex);
      startIndex = endIndex;
      endIndex = startIndex + countPerPage;
    }
    handleSetState({ paginate: paginateObj });
  }, [nftLayers]);

  useEffect(() => {
    if (promptAsset) {
      dispatch(deleteAsset(promptAsset));
      dispatch(setMintAmount(mintAmount - 1));
      dispatch(promptDeleteAsset(null));
    }
  }, [promptAsset]);

  return (
    <div className={classes.wrapper}>
      <div className={classes.backBtnWrapper}>
        <div onClick={() => history.goBack()} className={classes.backBtn}>
          <img src={arrowIconLeft} alt="" />
        </div>
      </div>
      <div className={classes.container}>
        <aside className={`${classes.sidebar} ${gifShow && classes.sidebarActive}`}>
          <div className={classes.collectionDetail}>
            <div className={classes.tab}>
              <h3>Collection Name </h3>
            </div>
            <div className={classes.wrapper}>
              <TextEditor
                placeholder={collectionName || ""}
                submitHandler={(value) => handleCollectionName({ ...previewProps, value })}
                invert
              />
            </div>

            <div className={classes.tab}>
              <h3>Collection Description </h3>
              <div
                onClick={() =>
                  handleSetState({
                    enableAllDescription: !enableAllDescription,
                  })
                }
                className={`${classes.toggleContainer}  ${enableAllDescription && classes.active}`}
              >
                <div className={`${classes.toggle} ${enableAllDescription && classes.active}`} />
              </div>
            </div>
            <textarea
              name="description"
              value={collectionDescription}
              rows="4"
              placeholder="description"
              onChange={(event) => handleCollectionDescription({ ...previewProps, event })}
            />
          </div>
          <div className={classes.actionContainer}>
            <div className={classes.foramtWrapper}>
              <h3>Use Format</h3>
              <label htmlFor="ipfs" onClick={() => handleFormatChange({ ...previewProps, val: "ipfs" })}>
                <input
                  ref={ipfsRef}
                  type="radio"
                  name="format"
                  value="ipfs"
                  defaultChecked
                  className={`${classes.radioBtn} ${outputFormat === "ipfs" && classes.clicked}`}
                />
                <p>IPFS</p>
                <div className={classes.tooltip} />
                <GenadropToolTip
                  fill="white"
                  content="IPFS is a peer-to-peer (p2p) storage network for storing and sharing data."
                />
              </label>
              <label htmlFor="arweave" onClick={() => handleFormatChange({ ...previewProps, val: "arweave" })}>
                <input
                  ref={arweaveRef}
                  type="radio"
                  name="format"
                  value="arweave"
                  className={`${classes.radioBtn} ${outputFormat === "arweave" && classes.clicked}`}
                />
                <p>Arweave</p>
              </label>
            </div>
            <div className={classes.btnWrapper}>
              {!gifShow && (
                <button onClick={() => handleSetState({ gifShow: true })} className={classes.gifButton} type="button">
                  Genrate GIF
                </button>
              )}
            </div>

            {gifShow && (
              <div className={classes.durationWrapper}>
                <div className={classes.durationField}>
                  <div className={classes.durationLabel}>
                    <p>Duration in Seconds</p>
                    <div className={classes.playTut}>
                      <PlayIcon />
                      <p>Watch how to make GIF</p>
                    </div>
                  </div>
                  <div className={classes.durationInput}>
                    <input
                      onChange={(e) => handleSetState({ duration: e.target.valueAsNumber })}
                      placeholder="set duration"
                      value={duration}
                      type="number"
                    />
                    <div className={classes.numberCounter}>
                      <p style={{ opacity: isNaN(duration) || duration === "" ? 0 : 1 }}>Sec</p>
                      <div className={classes.verticalLine} />
                      <div className={classes.inputArrows}>
                        <img
                          onClick={() =>
                            handleSetState({
                              duration: duration ? duration + 1 : 1,
                            })
                          }
                          src={CaretUP}
                          alt="count-up"
                        />
                        <img
                          onClick={() =>
                            handleSetState({
                              duration: duration ? (duration - 1 <= 0 ? 0 : duration - 1) : 0,
                            })
                          }
                          src={CaretDown}
                          alt="count-down"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className={classes.mintButtonWrapper}>
                  <button type="button" onClick={() => handleSetState({ gifShow: null })} className={classes.cancelBtn}>
                    Cancel
                  </button>
                  <button type="button" onClick={() => generateGif({ ...previewProps })} className={classes.mintBtn}>
                    <CheckIcon /> Done
                  </button>
                </div>
              </div>
            )}
            <div className={classes.btnWrapper}>
              <button
                type="button"
                onClick={() => {
                  handleDownload({
                    window,
                    dispatch,
                    setLoader,
                    setZip,
                    setNotification,
                    value: nftLayers,
                    name: collectionName,
                    outputFormat,
                  });
                }}
              >
                Download zip
              </button>
            </div>
          </div>
        </aside>

        <main className={classes.main}>
          <div className={classes.detailsView}>
            {(gifShow || gifs.length > 0) && (
              <div
                onClick={() => (gifs.length > 0 ? handleSetState({ toggleGuide: true }) : "")}
                className={`${classes.detailGif} ${classes.detail}`}
              >
                <p>GIF</p>
                <span>{gifs.length}</span>
              </div>
            )}
            <div className={classes.detail}>
              <span>Number of Generative Arts</span>
              <span>{nftLayers.length}</span>
            </div>
            <div className={classes.detail}>
              {mintInfo ? <img src={warnIcon} alt="" /> : null}
              <span>Unused Combinations</span>
              <span>{combinations - mintAmount - rule.length}</span>
            </div>
          </div>

          <div className={classes.preview}>
            {Object.keys(paginate).length
              ? paginate[currentPage].map((asset, index) => {
                  const { image, id, name, description } = asset;
                  return (
                    <div
                      key={id}
                      className={`${classes.card} ${
                        gifImages.filter((e) => e.id === id).length > 0 ? classes.cardActive : ""
                      }`}
                    >
                      <img className={classes.asset} src={image} alt="" />
                      <div className={classes.cardBody}>
                        <div className={classes.textWrapper}>
                          <TextEditor
                            placeholder={name}
                            submitHandler={(value) => handleRename({ ...previewProps, value, id, index })}
                          />
                        </div>
                        <textarea
                          name="description"
                          value={description}
                          cols="30"
                          rows="3"
                          placeholder="description"
                          onChange={(e) =>
                            handleDescription({
                              value: e.target.value,
                              id,
                              index,
                            })
                          }
                        />
                        <div className={classes.buttonContainer}>
                          <button
                            type="button"
                            className={classes.nftDonwload}
                            onClick={() =>
                              handleDownload({
                                window,
                                dispatch,
                                setLoader,
                                setZip,
                                setNotification,
                                value: [asset],
                                name: asset.name,
                                outputFormat,
                                single: true,
                              })
                            }
                          >
                            Download
                          </button>
                          {image.split(",")[0] !== "data:image/gif;base64" && (
                            <button
                              type="button"
                              onClick={() => handleDeleteAndReplace({ ...previewProps, id, index, currentPage })}
                            >
                              Generate New
                            </button>
                          )}
                        </div>
                      </div>
                      {!gifShow && (
                        <div onClick={() => handleDelete(id)} className={classes.iconClose}>
                          <CloseIcon className={classes.closeIcon} />
                        </div>
                      )}
                      {gifShow && (
                        <div
                          onClick={() => addGif({ ...previewProps, asset })}
                          className={`${classes.iconClose} ${
                            gifImages.filter((e) => e.id === id).length > 0 ? classes.cheked : ""
                          }`}
                        >
                          <CheckIcon fill={gifImages.filter((e) => e.id === id).length > 0 ? "#ffffff" : "#D1D4D8"} />
                        </div>
                      )}
                    </div>
                  );
                })
              : null}
          </div>
          {gifShow && gifImages.length > 0 && (
            <div className={classes.galleryGif}>
              <div className={classes.galleryGifLine} />
              <div className={classes.galleryGifInfo}>
                <p>Select arts from collection</p>
              </div>
              <div className={classes.galleryGifslides}>
                {gifImages.map((img) => (
                  <div>
                    {gifShow && (
                      <div onClick={() => addGif({ ...previewProps, asset: img })} className={classes.iconClose}>
                        <CloseIcon className={classes.closeIcon} />
                      </div>
                    )}
                    <img src={img.image} alt="gifIMG" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
      <div className={classes.paginate}>
        <div onClick={handlePrev} className={classes.pageControl}>
          prev
        </div>
        <div className={classes.pageCount}>
          {currentPage} of {Object.keys(paginate).length}
        </div>
        <div onClick={handleNext} className={classes.pageControl}>
          next
        </div>
        <div onClick={handleGoto} className={classes.pageControl}>
          goto
        </div>
        <input
          type="number"
          value={currentPageValue}
          onChange={(event) => handleSetState({ currentPageValue: event.target.value })}
        />
      </div>

      <div
        onClick={() => handleSetState({ toggleGuide: false })}
        className={`${classes.modelContainer} ${toggleGuide && classes.modelActive}`}
      >
        <div className={classes.guideContainer}>
          <CloseIcon className={classes.closeIcon} onClick={() => handleSetState({ toggleGuide: false })} />
          <div className={`${classes.imgContainer}`}>
            <div className={`${classes.preview} ${classes.modelPreview}`}>
              {gifs.length > 0
                ? gifs.map((asset, index) => {
                    const { image, id, name, description } = asset;
                    return (
                      <div key={id} className={classes.card}>
                        <img className={classes.asset} src={image} alt="" />
                        <div className={classes.cardBody}>
                          <div className={classes.textWrapper}>
                            <TextEditor
                              placeholder={name}
                              submitHandler={(value) => handleRename({ ...previewProps, value, id, index })}
                            />
                          </div>
                          <textarea
                            name="description"
                            value={description}
                            cols="30"
                            rows="3"
                            placeholder="description"
                            onChange={(e) =>
                              handleDescription({
                                value: e.target.value,
                                id,
                                index,
                              })
                            }
                          />
                          <div className={classes.buttonContainer}>
                            <button
                              type="button"
                              onClick={() =>
                                handleDownload({
                                  window,
                                  dispatch,
                                  setLoader,
                                  setZip,
                                  setNotification,
                                  value: [asset],
                                  name: asset.name,
                                  outputFormat,
                                  single: true,
                                })
                              }
                            >
                              Download
                            </button>
                            <button type="button" onClick={() => addToCollection({ ...previewProps, gif: asset })}>
                              Add to {collectionName || "collection"}
                            </button>
                          </div>
                        </div>
                        <div
                          onClick={() =>
                            handleSetState({
                              gifs: gifs.filter((gif) => gif.id !== id),
                            })
                          }
                          className={classes.iconClose}
                        >
                          <CloseIcon className={classes.closeIcon} />
                        </div>
                      </div>
                    );
                  })
                : ""}
            </div>
            <div className={classes.gifAllBtn}>
              <p
                onClick={() =>
                  handleSetState({
                    toggleGuide: false,
                    gifs: [],
                  })
                }
              >
                Delete all
              </p>
              <div
                onClick={() =>
                  gifs.length > 1 ? addAllGifs({ ...previewProps }) : addToCollection({ ...previewProps, gif: gifs[0] })
                }
              >
                Add all to {collectionName || "collection"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
