// import { BotTyping } from "./botTyping";
import { SideBar } from "./sidebar";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addDate } from "../utils/cartSlice";

export const Body = () => {
  const dispatch = useDispatch();
  const [date, setDate] = useState(new Date());
  useEffect(() => {
    console.log(date);

    dispatch(addDate({ date: date.toISOString() }));
  });
  return (
    <>
      <SideBar />
    </>
  );
};
