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
      const { department_name, answer } = action.payload;
      state.chatObj[state.count] = {
        department_name: department_name,
        answer: answer,
      };
      console.log(state.chatObj);
      state.count++;
    },
  },
});

export const { addChat } = cartSlice?.actions;
export default cartSlice.reducer;
