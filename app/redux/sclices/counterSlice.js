import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  details: {}
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    userDetails: (state, param) => {
      const { payload } = param;

      state.details = payload
    }
  },
});

// Export actions
export const { userDetails } = counterSlice.actions;

// Export reducer
export default counterSlice.reducer;