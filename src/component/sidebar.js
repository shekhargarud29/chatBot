import { BotTyping } from "./botTyping";
import { UserTyping } from "./userTyping";
import { useEffect, useState } from "react";
export const SideBar = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    console.log(open);
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
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "0%",
          height: "0%",
          background: "rgba(0, 0, 0, 0)",
          textAlign: "center",
          zIndex: 9999,
          cursor: "pointer",
        }}
      >
        <div
          className=""
          id="bmc-iframe"
          allow="payment"
          title="Buy Me a Coffee"
          style={{
            position: "fixed",
            margin: 0,
            border: 0,
            right: 18,
            bottom: 90,
            height: 550,
            opacity: 0,
            width: 350,

            maxWidth: 350,
            minHeight: 550,
            maxHeight: 550,
            borderRadius: 10,
            boxShadow: "rgba(13, 12, 34, 0.1) -6px 0px 30px",
            //   background:
            //     'url("https://cdn.buymeacoffee.com/assets/img/widget/loader.svg") center center / 64px no-repeat rgb(255, 255, 255)',
            zIndex: 9999,
            transition: "0.35s",
            transformOrigin: "right bottom",
            transform: "scale(0)",
            userSelect: "none",
          }}
        >
          <div className=" " style={{ backgroundColor: "rgb(245, 245, 245)" }}>
            <div className=" alogn rounded-3 chatbot-width chatbot-height">
              {/* top part */}
              <header className="d-flex p-2 justify-content-between">
                {/* left */}
                <div className="d-flex">
                  <div className="col-2 chatbot-logo p-1">
                    <img
                      style={{ width: "100%" }}
                      src="https://s.cafebazaar.ir/images/icons/com.ai.photoeditor.fx-d46d301e-6921-4ace-8d11-18f7f524db71_512x512.png?x-img=v1/resize,h_256,w_256,lossless_false/optimize"
                    ></img>
                  </div>
                  <div className="d-flex align-items-center p-1">
                    <h6 className="fw-bold m-0">Ask Bot</h6>
                  </div>
                </div>
                {/* right */}
                <div className="d-flex align-items-center">
                  <h5>
                    <i
                      onClick={() => {
                        console.log(open);

                        setOpen(!open);
                        //   handleOpen();
                      }}
                      className="fa-solid fa-xmark"
                    ></i>
                  </h5>
                </div>
              </header>
              <hr className="m-0"></hr>
              {/* middle part */}
              <main className="border p-2 chatbot-middle">
                {/* time */}
                <div className="d-flex p-3 justify-content-center">
                  <div className="">
                    <small className="text-secondary fw-lighter">
                      Nov 8, 3:16 PM
                    </small>
                    <hr className="m-1"></hr>
                  </div>
                </div>
                {/* chatbot typing */}
                <BotTyping />
                {/* user typing */}
                <UserTyping />
              </main>
            </div>
          </div>
        </div>
      </div>

      <div>
        {open ? (
          <>
            {" "}
            <div
              onClick={() => {
                console.log(open);

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
                background: "rgb(255, 129, 63)",
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
                console.log(open);

                setOpen(!open);
                //   handleOpen();
              }}
              id="bmc-wbtn"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 64,
                height: 64,
                background: "rgb(243, 69, 54)",
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
              <img
                src="https://cdn3d.iconscout.com/3d/premium/thumb/chatbot-3d-icon-download-in-png-blend-fbx-gltf-file-formats--communication-robotic-talk-online-blog-innovation-pack-appliances-icons-5627910.png?f=webp"
                alt="Buy Me A Coffee"
                style={{
                  height: 36,
                  width: 36,
                  margin: 0,
                  padding: 0,
                  zIndex: 999999,
                }}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};
