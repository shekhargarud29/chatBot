// import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BotTypingChild } from "./botTypingChild";
export const BotTypingParent = () => {
  const chatObj = useSelector((store) => store.cart.chatObj);

  // console.log(chatObj);
  return (
    <>
      {/* dynamic */}

      {chatObj !== null && chatObj !== undefined ? (
        Object.values(chatObj).map((value, index) => {
          // console.log(value);
          if (value?.answer && value?.option) {
            const { option, answer, link } = value;
            return (
              <div key={index}>
                <BotTypingChild option={option} answer={answer} link={link} />
              </div>
            );
          }
          if (value?.date) {
            const { date } = value;
            function formatDate(isoString) {
              const date = new Date(isoString);

              const options = {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              };

              return new Intl.DateTimeFormat("en-US", options).format(date);
            }
            // const isoString = "2024-12-22T14:22:29.239Z";
            const formattedDate = formatDate(date);
            // console.log(formattedDate);
            return (
              <div key={index}>
                {/* time */}
                <div className="d-flex p-2 justify-content-center">
                  <div className="">
                    <p
                      style={{ fontSize: "11px" }}
                      className="text-secondary m-0 fw-lighter"
                    >
                      {formattedDate}
                    </p>
                    <hr className="m-1"></hr>
                  </div>
                </div>
                {/* static */}
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
                  <div className="col-8">
                    <div className="d-flex py-1">
                      <small
                        className=" d-inline rounded-3 px-2 py-1 m-0 "
                        style={{ backgroundColor: "#f3f3f3" }}
                      >
                        Hi I am Pragati, I can help you with the queries
                      </small>
                    </div>

                    <div className="d-flex py-1">
                      <small
                        className=" d-inline m-0 py-1 px-2 rounded-3"
                        style={{ backgroundColor: "#f3f3f3" }}
                      >
                        Please select
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        })
      ) : (
        <></>
      )}
    </>
  );
};
