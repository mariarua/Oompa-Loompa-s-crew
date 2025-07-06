import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

interface OompaLoompa {
  id: number;
  first_name: string;
  last_name: string;
  gender: string;
  profession: string;
  image: string;
  email: string;
  age: number;
  country: string;
  height: number;
  favorite: {
    color: string;
    food: string;
    random_string: string;
    song: string;
  };
}

interface ApiResponse {
  current: number;
  total: number;
  results: OompaLoompa[];
}

interface OompaLoompaState {
  data: OompaLoompa[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  lastFetch: number | null;
  filter?: string;
}

export const fetchOompaLoompas = createAsyncThunk<ApiResponse, number>(
  "oompaLoompas/fetchOompaLoompas",
  async (page: number = 1) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const response = await fetch(`${baseUrl}/oompa-loompas?page=${page}`);

    if (!response.ok) {
      throw new Error("Failed to fetch Oompa Loompas");
    }

    return await response.json();
  }
);

const initialState: OompaLoompaState = {
  data: [],
  loading: false,
  error: null,
  currentPage: 1,
  lastFetch: null,
};

const oompaLoompaSlice = createSlice({
  name: "oompaLoompas",
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<string>) => {
      state.filter = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOompaLoompas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOompaLoompas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch data";
      })
      .addCase(fetchOompaLoompas.fulfilled, (state, action) => {
        state.loading = false;

        const newData = action.payload.results.filter(
          (newItem) =>
            !state.data.some((existingItem) => existingItem.id === newItem.id)
        );

        state.data = [...state.data, ...newData];
        state.lastFetch = Date.now();

        if (newData.length > 0) {
          state.currentPage = action.payload.current + 1;
        }
      });
  },
});

export const { setFilter, clearError } = oompaLoompaSlice.actions;
export default oompaLoompaSlice.reducer;

export type { OompaLoompa, OompaLoompaState };
