import { useEffect, useState } from "react";
export const BotTypingChild = ({ option, answer, link }) => {
  // console.log(option);
  // console.log(answer);
  const main = document.getElementById("main");
  useEffect(() => {
    if (main) {
      main.scroll({ top: main.scrollHeight });
    }
  });
  // auto scroll end

  const [loader, setLoader] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoader(false);
      if (main) {
        main.scroll({ top: main.scrollHeight });
      }
    }, 600);
    return () => clearTimeout(timer);
  });
  return (
    <>
      <div>
        {/* user */}
        <div className="d-flex py-1 pe-2 justify-content-end">
          <small className="bg-primary text-light d-inline m-0 py-1 px-2 rounded-3 fs-bolder">
            {option}
          </small>
        </div>
        {/* bot */}

        <div className="d-flex py-1 ">
          {/* logo */}
          <div className="col-2 chatbot-logo  align-content-end p-2  py-2">
            <img
              style={{ width: "100%" }}
              alt="chatbot-image"
              className=""
              src="https://s.cafebazaar.ir/images/icons/com.ai.photoeditor.fx-d46d301e-6921-4ace-8d11-18f7f524db71_512x512.png?x-img=v1/resize,h_256,w_256,lossless_false/optimize"
            ></img>
          </div>
          {/* chatbot-chat */}
          <div className="col-8 ">
            {loader ? (
              <div className=" py-1 mx-3" style={{ height: "40px" }}>
                {/* <span className="loader d-block"></span> */}
                <section className="dots-container">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </section>
              </div>
            ) : (
              <div className="d-flex py-1">
                <small
                  className=" d-inline text-start rounded-3 px-2 py-1 m-0 "
                  style={{
                    backgroundColor: "#f3f3f3",
                    // maxWidth: "100%",
                    // width: "100%",
                  }}
                >
                  {answer}
                  {link && link !== null && (
                    <>
                      <br></br>
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#007bff", marginLeft: "5px" }}
                      >
                        Click here
                      </a>
                    </>
                  )}
                </small>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
