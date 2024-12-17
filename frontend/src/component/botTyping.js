import { useSelector } from "react-redux";
export const BotTyping = (chatBotData) => {
  const chatObj = useSelector((store) => store.cart.chatObj);
  console.log(chatObj);
  return (
    <>
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
        <div className="col-9 ">
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
              Hi I am Pragati
            </small>
          </div>
        </div>
      </div>
      {/* dynamic */}
      {Object.values(chatObj).map((value, index) => {
        console.log(value);
        const { option, answer } = value;
        return (
          <div key={index}>
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
              <div className="col-9 ">
                <div className="d-flex py-1">
                  <small
                    className=" d-inline rounded-3 px-2 py-1 m-0 "
                    style={{ backgroundColor: "#f3f3f3" }}
                  >
                    {answer}
                  </small>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};
