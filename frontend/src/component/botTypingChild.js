import { useEffect, useState } from "react";
export const BotTypingChild = ({ option, answer, link, formattedTime }) => {
  const [isLongOption, setIsLongOption] = useState(false);
  const [isLongAnswer, setIsLongAnswer] = useState(false);

  const main = document.getElementById("main");
  useEffect(() => {
    if (main) {
      main.scroll({ top: main.scrollHeight });
    }
  });
  useEffect(() => {
    const checkTextLength = (option, answer) => {
      const characterThreshold = 30;
      const textAnswer = answer.length > characterThreshold;
      const textOption = option.length > characterThreshold;
      setIsLongAnswer(textAnswer);
      setIsLongOption(textOption);
    };
    checkTextLength(option, answer);
  }, []);
  console.log(formattedTime);
  // function formatTime(isoString) {
  //   const date = new Date(isoString);
  //   const options = { hour: "numeric", minute: "numeric", hour12: true };
  //   return new Intl.DateTimeFormat("en-IN", options).format(date);
  // }
  // const formattedTime = formatTime(new Date().toISOString());

  // console.log("formattedTime", formattedTime);

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
        <div>
          <div
            className="d-flex py-1 position-relative justify-content-end"
            style={{ width: "340px" }}
          >
            {/* User logo */}
            <div
              className="right-message  py-1 pe-2 justify-content-end"
              style={{
                display: "flex",
                flexDirection: isLongOption ? "column" : "row",
                gap: "4px",
                width: "100%",
              }}
            >
              <small
                style={{
                  flex: isLongOption ? "none" : 1,
                  overflowWrap: "break-word",
                  whiteSpace: "normal",
                }}
              >
                {option}
              </small>
              <div
                className="d-flex justify-content-end"
                style={{
                  marginTop: isLongOption ? "-5px" : "-9px",
                  alignSelf: "flex-end",
                }}
              >
                <span className="ms-2 text-muted" style={{ fontSize: "12px" }}>
                  {formattedTime}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* bot */}

        <div className="d-flex py-1 ">
          {/* Bot logo */}
          <div
            className="col-1 chatbot-logo  p-1 "
            style={{ width: "12.333333%" }}
          >
            <img
              className="rounded-circle"
              style={{ width: "100%" }}
              alt="chatbot-image"
              src="https://s.cafebazaar.ir/images/icons/com.ai.photoeditor.fx-d46d301e-6921-4ace-8d11-18f7f524db71_512x512.png?x-img=v1/resize,h_256,w_256,lossless_false/optimize"
            />
          </div>
          {/* Bot chat content */}
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
              <div className="text-start d-flex">
                <div className=" py-1 position-relative">
                  <div
                    className="left-message px-2 py-1 m-0"
                    style={{
                      display: "flex",
                      flexDirection: isLongAnswer ? "column" : "row",
                      gap: "4px",
                      width: "100%",
                    }}
                  >
                    <small
                      // className=" d-inline text-start rounded-3 px-2 py-1 m-0 "
                      style={{
                        overflowWrap: "break-word",
                        whiteSpace: "normal",
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
                    <div
                      className="d-flex justify-content-end"
                      style={{
                        marginTop: isLongAnswer ? "-5px" : "-9px",
                        alignSelf: "flex-end",
                      }}
                    >
                      <span
                        className="ms-2 text-muted"
                        style={{ fontSize: "12px" }}
                      >
                        {formattedTime}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
