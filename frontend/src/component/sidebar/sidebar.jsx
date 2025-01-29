import { BotTypingParent } from "../Parent/botTypingParent";
import { deleteAllChats } from "../../utils/cartSlice";
import { BotOption } from "../botOption";
import { useEffect, useState, useRef } from "react";
import { MongoDoc } from "../../hooks/useMongoDoc";
import { useDispatch } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import "./Sidebar.css"; // Import the new CSS file

export const SideBar = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const chatBotObject = MongoDoc();
  console.log(chatBotObject);

  const iframeRef = useRef(null);

  useEffect(() => {
    if (iframeRef.current) {
      if (open) {
        iframeRef.current.style.height = "550px";
        iframeRef.current.style.opacity = "1";
        iframeRef.current.style.transform = "scale(1)";
      } else {
        iframeRef.current.style.height = "0px";
        iframeRef.current.style.opacity = "0";
        iframeRef.current.style.transform = "scale(0)";
      }
    }
  }, [open]);

  return (
    <>
      <div className="sidebar-container">
        <div className="m-0 bmc-iframe" ref={iframeRef} title="chat with me">
          <div className="chatbot-width chatbot-height">
            {chatBotObject?.loading ? (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "550px" }}
              >
                <span className="sidebarLoader m-auto"></span>
              </div>
            ) : (
              <>
                {/* Top part */}
                <header className="d-flex justify-content-between align-items-center p-2 border-bottom">
                  <div className="d-flex align-items-center">
                    <div className="chatbot-logo position-relative me-3">
                      <img
                        className="rounded-circle"
                        style={{ width: "45px", height: "45px" }}
                        alt="chatbot-image"
                        src="https://s.cafebazaar.ir/images/icons/com.ai.photoeditor.fx-d46d301e-6921-4ace-8d11-18f7f524db71_512x512.png?x-img=v1/resize,h_256,w_256,lossless_false/optimize"
                      />
                      <span className="online-indicator"></span>
                    </div>
                    <h6 className="fw-bold m-0">Ask Bot</h6>
                  </div>

                  <div className="header-right d-flex align-items-center">
                    <button
                      className="btn p-1 d-flex align-items-center"
                      onClick={() => dispatch(deleteAllChats())}
                    >
                      <i className="fa-regular fa-trash-can"></i>
                    </button>
                    <button
                      className="btn p-1 d-flex align-items-center close-button ms-3"
                      onClick={() => setOpen(!open)}
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                </header>
                {/* Main part */}
                <div
                  className="d-flex flex-column justify-content-between"
                  style={{ height: "488.875px" }}
                >
                  {chatBotObject?.error ? (
                    <div>
                      <h4>Sorry we are having server issues</h4>
                      <h4>{chatBotObject?.error?.message}</h4>
                    </div>
                  ) : (
                    <>
                      <main className="m-2 me-0 chatbot-middle" id="main">
                        <BotTypingParent />
                      </main>
                      <footer className="border-top chatbot-bottom pt-1">
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

      <div>
        {open ? (
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setOpen(!open)}
                className="logo"
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
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
          <div className="bmc-wbtn">
            <AnimatePresence>
              {!open && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="btn btn-primary position-fixed bottom-4 end-4 rounded-circle d-flex align-items-center justify-content-center shadow"
                  style={{ width: "64px", height: "64px", zIndex: 1050 }}
                  onClick={() => setOpen(true)}
                >
                  <MessageCircle size={32} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </>
  );
};
