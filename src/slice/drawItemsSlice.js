const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  rectangle: [],
};

const drawItems = createSlice({
  name: "drawItems",
  initialState,
  reducers: {
    addRectangle(state, action) {
      state.rectangle.push(action.payload);
    },
  },
});

export const { addRectangle } = drawItems.actions;

export default drawItems.reducer;
