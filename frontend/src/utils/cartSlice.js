import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    chatObj: {},
    count: 1,
  },
  reducers: {
    addChat: (state, action) => {
      console.log(action.payload);
      const { option, answer } = action.payload;
      state.chatObj[state.count] = {
        option: option,
        answer: answer,
      };
      console.log(state.chatObj);
      state.count++;
    },
  },
});

export const { addChat } = cartSlice?.actions;
export default cartSlice.reducer;
