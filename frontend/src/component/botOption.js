import { useDispatch } from "react-redux";
import { addChat } from "../utils/cartSlice";
import { useEffect, useState } from "react";

export const BotOption = (chatBotData) => {
  const dispatch = useDispatch();
  const [currentOptions, setCurrentOptions] = useState();
  const [homeOptions, setHomeOptions] = useState();
  const [backOption, setBackOption] = useState([]);
  // console.log(chatBotData?.chatBotData.departments);
  // const [date, setDate] = useState(new Date());
  // console.log(date);
  // let count = 1;
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoader(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [loader]);

  useEffect(() => {
    setCurrentOptions(chatBotData?.chatBotData.departments || []);
  }, [chatBotData]);

  const handleOptionClick = (item, option) => {
    if (option === "Home") {
      setCurrentOptions(chatBotData?.chatBotData.departments);
      setBackOption([]);
      dispatch(addChat(item));
      setLoader(true);
    } else {
      setBackOption((prev) => [...prev, currentOptions]);
      setCurrentOptions(item.sub_options);
      dispatch(addChat(item));
      setLoader(true);
    }
  };

  const handleBackOption = () => {
    if (backOption.length > 0) {
      setCurrentOptions(backOption[backOption.length - 1]);
      setBackOption((prev) => prev.slice(0, -1));
      setLoader(true);
    }
  };

  return loader ? (
    <>
      <div></div>
    </>
  ) : (
    <>
      {currentOptions && currentOptions.length > 0 ? (
        <>
          <div
            style={{ height: "100%", overflow: "auto" }}
            className="d-flex flex-wrap justify-content-center"
          >
            {currentOptions &&
              currentOptions.length > 0 &&
              currentOptions
                .filter((item) => item?.isVisible !== false)
                .map((item, index) => {
                  const { option } = item;
                  // console.log(item);
                  return (
                    <div key={index}>
                      <div
                        className="btn btn-outline-secondary p-1 mt-2 mx-2  rounded-5"
                        style={{ marginBottom: "1px !important" }}
                        onClick={() => {
                          handleOptionClick(item, option);
                          // count++;
                        }}
                      >
                        <h6 className="m-0 " style={{ fontSize: "15px" }}>
                          {option}
                        </h6>
                      </div>
                    </div>
                  );
                })}
            {backOption.length > 0 ? (
              <>
                <div
                  className="btn btn-outline-secondary p-1 mt-2 mx-2  rounded-5"
                  style={{ marginBottom: "1px !important" }}
                  onClick={() => {
                    handleBackOption();
                    // count++;
                  }}
                >
                  <h6 className="m-0 " style={{ fontSize: "15px" }}>
                    Back
                  </h6>
                </div>
              </>
            ) : null}
          </div>
        </>
      ) : (
        <>
          <div>
            <h6 className="m-0">
              <div
                className="btn btn-outline-secondary p-1 mt-2 mx-2  rounded-5"
                style={{ marginBottom: "1px !important" }}
                onClick={() => {
                  const reset = {
                    option: "Home",
                    answer: "Hi I am Pragati, I can help you with the queries",
                  };
                  handleOptionClick(reset, reset.option);
                  // count++;
                }}
              >
                <h6 className="m-0 " style={{ fontSize: "15px" }}>
                  Home
                </h6>
              </div>
            </h6>
          </div>
        </>
      )}
    </>
  );
};
