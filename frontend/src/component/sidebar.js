import { BotTyping, BotTypingParent } from "./botTypingParent";
import { UserTyping } from "./botTypingChild";
import { BotOption } from "./botOption";
import { useEffect, useState } from "react";
import { MongoDoc } from "../hooks/useMongoDoc";
import { Shimmer } from "./shimmer";
export const SideBar = () => {
  const [open, setOpen] = useState(false);
  // const [hasPlayed, setHasPlayed] = useState(false);
  const chatBotObject = MongoDoc();
  console.log(chatBotObject);
  useEffect(() => {
    // console.log(open);
    if (open) {
      //   document.getElementById("bmc-iframe").style.minHeight = "550px";
      document.getElementById("bmc-iframe").style.height = "550px";
      //   document.getElementById("bmc-iframe").style.maxHeight = "550px";
      //   document.getElementById("bmc-iframe").style.maxWidth = "420px";
      document.getElementById("bmc-iframe").style.opacity = "1";
      document.getElementById("bmc-iframe").style.transform = "scale(1)";
    } else {
      //   document.getElementById("bmc-iframe").style.minHeight = "0px";
      document.getElementById("bmc-iframe").style.height = "0px";
      //   document.getElementById("bmc-iframe").style.maxHeight = "0px";
      //   document.getElementById("bmc-iframe").style.maxWidth = "0px";
      document.getElementById("bmc-iframe").style.opacity = "0";

      document.getElementById("bmc-iframe").style.transform = "scale(0)";
    }
  }, [open]);

  return (
    <>
      {/* main sidebar */}
      <div
        style={{
          position: "fixed",

          top: 0,
          left: 0,
          width: "0%",
          height: "0%",
          background: "rgba(0, 0, 0, 0)",
          textAlign: "center",
          zIndex: 999,
          // cursor: "pointer",
        }}
      >
        <div
          className="m-0"
          id="bmc-iframe"
          title="chat with me"
          style={{
            position: "fixed",
            margin: 0,
            border: 0,
            right: 18,
            bottom: 90,
            height: 550,
            opacity: 0,
            width: 360,
            // border: "1px solid black",
            maxWidth: 360,
            minHeight: 550,
            maxHeight: 550,
            borderRadius: 10,
            boxShadow: "rgba(13, 12, 34, 0.1) -6px 0px 30px",
            zIndex: 9999,
            transition: "0.35s",
            transformOrigin: "right bottom",
            transform: "scale(0)",
            userSelect: "none",
          }}
        >
          <div className=" ">
            <div className=" alogn rounded-3 chatbot-width chatbot-height ">
              {chatBotObject?.loading ? (
                <div
                  className=" d-flex justify-content-center align-items-center"
                  style={{ height: "550px" }}
                >
                  <span className="sidebarLoader m-auto"></span>
                </div>
              ) : (
                <>
                  {" "}
                  {/* top part */}
                  <header className="d-flex p-1 py-2 border-bottom justify-content-between">
                    {/* left */}
                    <div className="d-flex">
                      <div className="col-2 chatbot-logo px-2">
                        <img
                          style={{ width: "100%" }}
                          alt="chatbot-image"
                          src="https://s.cafebazaar.ir/images/icons/com.ai.photoeditor.fx-d46d301e-6921-4ace-8d11-18f7f524db71_512x512.png?x-img=v1/resize,h_256,w_256,lossless_false/optimize"
                        ></img>
                      </div>
                      <div className="d-flex align-items-center p-1">
                        <h6 className="fw-bold m-0">Ask Bot</h6>
                      </div>
                    </div>
                    {/* right */}
                    <div className="d-flex px-2 align-items-center" id="cross">
                      <h4 className="m-0">
                        <i
                          style={{ transition: "0.35s" }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = "rotate(180deg)";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = "rotate(0deg)";
                          }}
                          onClick={() => {
                            // console.log(open);

                            setOpen(!open);
                            //   handleOpen();
                          }}
                          className="fa-solid fa-xmark"
                        ></i>
                      </h4>
                    </div>
                  </header>
                  {/* main part */}
                  <div
                    className="d-flex flex-column justify-content-between   "
                    style={{ height: "488.875px" }}
                  >
                    {chatBotObject?.error !== null &&
                    chatBotObject?.chatBotData.length === 0 ? (
                      <>
                        <div>
                          <h4>Sorry we are having server issues</h4>
                          <h4>{chatBotObject?.error}</h4>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* middle part */}
                        <main
                          className=" m-2 me-0 chatbot-middle"
                          id="main"
                          style={{ overflow: "auto" }}
                        >
                          {/* time */}
                          {/* <div className="d-flex p-2 justify-content-center">
                            <div className="">
                              <p
                                style={{ fontSize: "11px" }}
                                className="text-secondary m-0 fw-lighter"
                              >
                                Nov 8, 3:16 PM
                              </p>
                              <hr className="m-1"></hr>
                            </div>
                          </div> */}

                          {/* chatbot typing */}
                          <BotTypingParent
                          // chatBotData={chatBotObject?.chatBotData}
                          />
                          {/* user typing */}
                          {/* <UserTyping /> */}
                        </main>
                        {/* bottom part */}
                        <footer
                          className="border-top chatbot-bottom pt-1"
                          style={{ maxHeight: "130px" }}
                        >
                          <BotOption chatBotData={chatBotObject?.chatBotData} />
                        </footer>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* logo were we will click */}
      <div>
        {open ? (
          <>
            {" "}
            <div
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.04)";
                // e.target.style.backgroundColor = "rgb(220, 50, 50)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
                // e.target.style.backgroundColor = "rgb(243, 69, 54)";
              }}
              onClick={() => {
                // console.log(open);

                setOpen(!open);
                //   handleOpen();
              }}
              className="logo"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 64,
                height: 64,
                background: "rgb(70, 130, 180)",
                color: "white",
                borderRadius: 32,
                position: "fixed",
                right: 18,
                bottom: 18,
                boxShadow: "rgba(0, 0, 0, 0.15) 0px 4px 8px",
                zIndex: 9999,
                cursor: "pointer",
                fontWeight: 600,
                transition: "0.25s",
                transform: "scale(1)",
              }}
            >
              <svg
                style={{ width: 16, height: 16 }}
                width={16}
                height={10}
                viewBox="0 0 16 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.1133 0L8 6.11331L1.88669 0L0 1.88663L8 9.88663L16 1.88663L14.1133 0Z"
                  fill="white"
                />
              </svg>
            </div>
          </>
        ) : (
          <>
            <div
              onClick={() => {
                setOpen(!open);
              }}
              onMouseEnter={(e) => {
                e.stopPropagation();
                const video = document.getElementById("chatbotVideo");
                const image = document.getElementById("chatbotImage");
                const play = video.play();
                if (play !== undefined) {
                  // e.target.style.transform = "scale(1.1)";

                  // Play the video and hide the image
                  video.style.display = "block";
                  image.style.display = "none";
                  // video.play();

                  // Mark video as played
                  // setHasPlayed(true);
                  // console.log(hasPlayed);
                }
              }}
              // onMouseLeave={(e) => {
              //   // const video = document.getElementById("chatbotVideo");
              //   // const image = document.getElementById("chatbotImage");
              //   // console.log(hasPlayed);
              //   // e.target.style.transform = "scale(1)";
              //   // Pause and hide the video
              //   // const play = video.pause();
              //   // if (hasPlayed) {
              //   //   video.style.display = "none";
              //   //   image.style.display = "block";
              //   //   setHasPlayed(false);
              //   //   video.pause();
              //   //   console.log(hasPlayed);
              //   // }
              // }}
              id="bmc-wbtn"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 64,
                height: 64,
                border: "1px solid rgb(106, 176, 200)",
                // background: "rgb(106, 176, 200)",
                color: "white",
                borderRadius: 32,
                position: "fixed",
                right: 18,
                bottom: 18,
                boxShadow: "rgba(0, 0, 0, 0.15) 0px 4px 8px",
                zIndex: 9999,
                cursor: "pointer",
                fontWeight: 600,
                transition: "0.25s",
                transform: "scale(1)",
              }}
            >
              {/* Static Image */}
              <img
                id="chatbotImage"
                src="https://cdn-icons-png.flaticon.com/512/11184/11184177.png"
                alt="Chat with me"
                style={{
                  height: 41,
                  width: 41,
                  margin: 0,
                  padding: 0,
                  zIndex: 999999,
                }}
              />

              {/* Hover Video */}
              <video
                id="chatbotVideo"
                width={56.5}
                height={56.5}
                preload="none"
                style={{
                  display: "none",
                  borderRadius: "50%",
                  background: "transparent",
                  paddingBottom: ".2px",
                }}
                muted
                playsInline
                onEnded={() => {
                  document.getElementById("chatbotVideo").style.display =
                    "none";
                  document.getElementById("chatbotImage").style.display =
                    "block";
                }}
              >
                <source
                  src="https://cdn-icons-mp4.flaticon.com/512/11184/11184177.mp4"
                  type="video/mp4"
                />
              </video>
            </div>
          </>
        )}
      </div>
    </>
  );
};
