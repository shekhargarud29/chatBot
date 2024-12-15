import { useDispatch } from "react-redux";
import { addChat } from "../utils/cartSlice";
import { useState } from "react";
export const BotOption = (chatBotData) => {
  const dispatch = useDispatch();
  console.log(chatBotData?.chatBotData);
  console.log(chatBotData?.chatBotData?.departments);
  console.log(departments);
  const { dynamic, setDynamic } = useState();
  let count = 1;
  if (count == 1) {
    const { departments } = chatBotData?.chatBotData;
    setDynamic(departments);
  }

  return (
    <>
      <div style={{ height: "100%", overflow: "auto" }}>
        {departments &&
          departments.length > 0 &&
          departments.map((department, index) => {
            const { department_name } = department;

            console.log(department_name);
            return (
              <div key={index}>
                <div
                  className="btn btn-outline-secondary p-2 m-2 mx-2 mb-0 rounded-5"
                  style={{ margin: ".3rem" }}
                  onClick={() => {
                    dispatch(addChat(department));
                    count++;
                  }}
                >
                  <h6 className="m-0 ">{department_name}</h6>
                </div>
              </div>
            );
          })}
        {/* <div
          className="btn btn-outline-secondary p-2 m-2 mx-2 mb-0"
          style={{ margin: ".3rem" }}
        >
          <h6 className="m-0 ">Education</h6>
        </div>
        <div
          className="btn btn-outline-secondary p-2 m-2 mx-2 mb-0"
          style={{ margin: ".3rem" }}
        >
          <h6 className="m-0 ">Education</h6>
        </div> */}
      </div>
    </>
  );
};
