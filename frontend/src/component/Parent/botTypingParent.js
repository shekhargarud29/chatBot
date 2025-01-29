import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { BotTypingChild } from "../botTypingChild";
import "./botTypingParent.css";

export const BotTypingParent = () => {
  const chatObj = useSelector((store) => store.cart.chatObj);
  const [lastDisplayedDate, setLastDisplayedDate] = useState(null);
  const [showInitialMessage, setShowInitialMessage] = useState(true);
  const [isLongText, setIsLongText] = useState(false);

  // Predefined message
  const firstMessageText =
    "Hi I am Pragati, I can help you with various queries";
  const secondMessageText = "Please select the option ";

  useEffect(() => {
    const checkTextLength = () => {
      const characterThreshold = 30;
      const firstMessageLong = firstMessageText.length > characterThreshold;
      const secondMessageLong = secondMessageText.length > characterThreshold;
      setIsLongText(firstMessageLong || secondMessageLong);
    };
    checkTextLength();
  }, []);

  function formatDate(isoString) {
    const date = new Date(isoString);
    const options = { month: "short", day: "numeric", hour12: true };
    return new Intl.DateTimeFormat("en-IN", options).format(date);
  }

  function formatTime(isoString) {
    const date = new Date(isoString);
    const options = { hour: "numeric", minute: "numeric", hour12: true };
    return new Intl.DateTimeFormat("en-IN", options).format(date);
  }

  let displayedDates = new Set(); // Track displayed dates

  useEffect(() => {
    const storedDate = localStorage.getItem("lastChatDate");
    console.log(storedDate === formatDate(new Date().toISOString()));
    if (storedDate === formatDate(new Date().toISOString())) {
      setShowInitialMessage(true);
    }
  }, []);

  return (
    <>
      {chatObj !== null && chatObj !== undefined
        ? Object.values(chatObj).map((value, index) => {
            if (value?.date) {
              const { date } = value;
              const formattedDate = formatDate(date);
              const formattedTime = formatTime(date);

              // Show date only if it hasn't been displayed before
              const showDate = !displayedDates.has(formattedDate);
              displayedDates.add(formattedDate);

              // Store the last chat date in localStorage
              if (showDate) {
                localStorage.setItem("lastChatDate", formattedDate);
              }

              return (
                <div key={index}>
                  {/* Show date only if it's the first occurrence */}
                  {showDate && (
                    <div className="d-flex p-2 justify-content-center">
                      <div>
                        <p
                          style={{ fontSize: "11px" }}
                          className="text-secondary m-0 fw-lighter"
                        >
                          {formattedDate}
                        </p>
                        <hr className="m-1" />
                      </div>
                    </div>
                  )}
                  {/* Static bot message (only if the date is new) */}
                  {showInitialMessage && showDate && (
                    <div className="d-flex py-1">
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
                      <div className="col-9 position-relative text-start">
                        {/* First message */}
                        <div className="d-flex py-1 position-relative">
                          <div
                            className="left-message px-2 py-1 m-0"
                            style={{
                              display: "flex",
                              flexDirection: isLongText ? "column" : "row",
                              gap: "4px",
                              width: "100%",
                            }}
                          >
                            <small
                              style={{
                                flex: isLongText ? "none" : 1,
                                overflowWrap: "break-word",
                                whiteSpace: "normal",
                              }}
                            >
                              {firstMessageText}
                            </small>
                            <div
                              className="d-flex justify-content-end"
                              style={{
                                marginTop: isLongText ? "-5px" : "-9px",
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

                        {/* Second message */}
                        <div className="d-flex py-1">
                          <div
                            className="py-1 d-flex align-items-end m-0 py-1 px-2 rounded-3"
                            style={{
                              overflowWrap: "break-word",
                              whiteSpace: "normal",
                              backgroundColor: "#d3effd",
                              borderRadius: "10px 10px 10px 2px",
                              flexDirection: isLongText ? "column" : "row", // Switch layout based on text length
                              gap: "8px",
                              maxWidth: "100%",
                            }}
                          >
                            <small
                              className=""
                              style={{
                                maxWidth: "100%",
                                overflowWrap: "break-word",
                                whiteSpace: "normal",
                                textAlign: "left",
                              }}
                            >
                              {secondMessageText}
                            </small>
                            <div
                              className="d-flex justify-content-end"
                              style={{
                                marginTop: isLongText ? "-7px" : "0", // Adjust spacing for column layout
                                flexShrink: 0,
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
                    </div>
                  )}
                </div>
              );
            } else if (value?.answer && value?.option) {
              const { option, answer, link } = value;
              return (
                <div key={index}>
                  <BotTypingChild option={option} answer={answer} link={link} />
                </div>
              );
            }
          })
        : null}
    </>
  );
};
