import { createSlice } from "@reduxjs/toolkit";
import { useEffect } from "react";

const getHistory = () => {
  const data = JSON.parse(localStorage.getItem("chatObj"));
  // console.log(data);
  return data || null;
};
const afterDelete = {
  chatObj: {
    // Default welcome messages
    0: {
      date: new Date().toISOString(),
      answer: "Hi I am Pragati, I can help you with the queries",
    },
    1: {
      answer: "Please select",
    },
  },
};

const initialChatState = {
  chatObj: getHistory() !== null ? getHistory() : {},
  count: getHistory() !== null ? Object.keys(getHistory()).length + 1 : 1,
  // countDate: 1,
  link: null,
  dateObj: [],
  resetTrigger: false,
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
    deleteAllChats: (state) => {
      state.chatObj = { ...afterDelete.chatObj }; // Reset chat object
      state.count = 1; // Reset count
      state.link = null; // Reset link
      state.dateObj = []; // Reset date object (if applicable)
      localStorage.removeItem("chatObj"); // Remove from localStorage
      state.resetTrigger = !state.resetTrigger; // Toggle reset state
    },

    addChat: (state, action) => {
      state.count++;
      const time = new Date().toISOString();
      // console.log(action.payload);
      const { option, answer } = action.payload;
      state.link = null;
      if (action.payload?.link) {
        state.link = action.payload?.link;
      }
      //  ? (state.link = action.payload?.link) : null;
      state.chatObj[state.count] = {
        time: time,
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

      // console.log(date);
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

export const { deleteAllChats, addChat, addDate } = cartSlice?.actions;
export default cartSlice.reducer;
