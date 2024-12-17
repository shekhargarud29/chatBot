import { useDispatch } from "react-redux";
import { addChat } from "../utils/cartSlice";
import { useEffect, useState } from "react";

export const BotOption = (chatBotData) => {
  const dispatch = useDispatch();
  const [currentOptions, setCurrentOptions] = useState();
  // console.log(chatBotData?.chatBotData.departments);

  let count = 1;

  useEffect(() => {
    setCurrentOptions(chatBotData?.chatBotData.departments || []);
  }, [chatBotData]);

  const handleOptionClick = (item, option) => {
    setCurrentOptions(item.sub_options);
    dispatch(addChat(item));
  };

  // if (count == 1) {
  //   setDynamic(departments);
  // }
  console.log(currentOptions);
  return currentOptions && currentOptions.length > 0 ? (
    <>
      <div
        style={{ height: "100%", overflow: "auto" }}
        className="d-flex flex-wrap justify-content-center"
      >
        {currentOptions &&
          currentOptions.length > 0 &&
          currentOptions.map((item, index) => {
            const { option } = item;
            // console.log(item);
            return (
              <div key={index}>
                <div
                  className="btn btn-outline-secondary p-1 mt-2 mx-2  rounded-5"
                  style={{ marginBottom: "1px !important" }}
                  onClick={() => {
                    // console.log(dynamicArr);
                    // setDynamicArr(department_name);
                    handleOptionClick(item, option);
                    count++;
                  }}
                >
                  <h6 className="m-0 " style={{ fontSize: "15px" }}>
                    {option}
                  </h6>
                </div>
              </div>
            );
          })}
      </div>
    </>
  ) : (
    <>
      <div>
        <h6 className="m-0">No {currentOptions} available</h6>
      </div>
    </>
  );
};
