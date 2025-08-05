import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  details: {}
};

export const userDetailsSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    userDetails: (state, param) => {
      const { payload } = param;

      state.details = payload
    }
  },
});

// Export actions
export const { userDetails } = userDetailsSlice.actions;

// Export reducer
export default userDetailsSlice.reducer;