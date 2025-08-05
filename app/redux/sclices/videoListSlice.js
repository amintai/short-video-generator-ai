import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  details: {}
};

export const videoListSlice = createSlice({
  name: 'videos',
  initialState,
  reducers: {
    videLists: (state, param) => {
      const { payload } = param;

      state.details = payload
    }
  },
});

// Export actions
export const { videLists } = videoListSlice.actions;

// Export reducer
export default videoListSlice.reducer;