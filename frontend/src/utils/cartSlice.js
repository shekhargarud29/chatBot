import { createSlice } from "@reduxjs/toolkit";
import { useEffect } from "react";

const getHistory = () => {
  const data = JSON.parse(localStorage.getItem("chatObj"));
  console.log(data);
  return data || null;
};

const initialChatState = {
  chatObj: getHistory() !== null ? getHistory() : {},
  count: getHistory() !== null ? Object.keys(getHistory()).length + 1 : 1,
  // countDate: 1,
  link: null,
  dateObj: [],
};
// console.log(initialChatState.count);
const cartSlice = createSlice({
  name: "cart",
  // initialState: {
  //   chatObj: {},
  //   count: 1,
  //   link: null,
  // },
  initialState: initialChatState,
  reducers: {
    addChat: (state, action) => {
      state.count++;
      // console.log(action.payload);
      const { option, answer } = action.payload;
      state.link = null;
      if (action.payload?.link) {
        state.link = action.payload?.link;
      }
      //  ? (state.link = action.payload?.link) : null;
      state.chatObj[state.count] = {
        option: option,
        answer: answer,
        link: state.link,
      };
      // console.log(state.chatObj);

      localStorage.setItem("chatObj", JSON.stringify(state.chatObj));
    },
    addDate: (state, action) => {
      // state.date = action.payload;

      const { date } = action.payload;

      console.log(date);
      // console.log(state.count);
      state.chatObj[state.count] = {
        date,
      };
      localStorage.setItem("chatObj", JSON.stringify(state.chatObj));
      // state.count++;

      // console.log(date);
      // console.log(state.chatObj);
      // console.log(state.count);
    },
  },
});

export const { addChat, addDate } = cartSlice?.actions;
export default cartSlice.reducer;
