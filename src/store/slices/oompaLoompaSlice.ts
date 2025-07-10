import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type {
  OompaLoompaState,
  CacheInitData,
  PageLoadResult,
  DetailLoadResult,
} from "../../types";
import { oompaDB } from "../../utils/oompaLoompaDB";
import { oompaLoompaApi } from "../../services/api";
import {
  extractMinimalData,
  validateCharacterDetail,
  removeDuplicates,
} from "../../utils/dataTransforms";
import { MESSAGES } from "../../utils/constants";

export const initializeFromCache = createAsyncThunk<CacheInitData>(
  "oompaLoompas/initializeFromCache",
  async () => {
    try {
      console.log(MESSAGES.CACHE_INIT);
      const { allCharacters, lastPage } = await oompaDB.getAllCachedPages();
      return { allCharacters: allCharacters || [], lastPage: lastPage || 0 };
    } catch (error) {
      console.error(MESSAGES.CACHE_ERROR, error);
      return { allCharacters: [], lastPage: 0 };
    }
  }
);

export const loadOompaLoompasPage = createAsyncThunk<PageLoadResult, number>(
  "oompaLoompas/loadPage",
  async (page: number) => {
    console.log(`📄 Loading page ${page}...`);

    const cachedData = await oompaDB.getPage(page);

    if (cachedData) {
      console.log(`${MESSAGES.CACHE_FOUND} Page ${page}`);
      const total = ((await oompaDB.getMetadata("totalPages")) as number) || 1;
      return { data: cachedData, fromCache: true, page, total };
    }

    console.log(`${MESSAGES.API_FETCH} Page ${page}`);
    const apiData = await oompaLoompaApi.getPage(page);
    const minimalData = extractMinimalData(apiData.results);

    await Promise.all([
      oompaDB.savePage(page, minimalData),
      oompaDB.saveMetadata("totalPages", apiData.total),
      oompaDB.saveMetadata("lastUpdate", Date.now()),
    ]);

    return { data: minimalData, fromCache: false, page, total: apiData.total };
  }
);

export const loadOompaLoompaDetail = createAsyncThunk<DetailLoadResult, number>(
  "oompaLoompas/loadDetail",
  async (id: number) => {
    console.log(`👤 Loading detail for character ${id}...`);

    if (!id || isNaN(id)) {
      throw new Error(`Invalid character ID: ${id}`);
    }

    try {
      const cachedDetail = await oompaDB.getCharacterDetail(id);
      if (cachedDetail) {
        console.log(`${MESSAGES.CACHE_FOUND} Detail ${id}`);
        return { data: cachedDetail, fromCache: true };
      }
    } catch (error) {
      console.warn(`⚠️ Cache error for ${id}:`, error);
    }

    console.log(`${MESSAGES.API_FETCH} Detail ${id}`);
    const detail = await oompaLoompaApi.getDetail(id);

    if (!validateCharacterDetail(detail)) {
      console.error(MESSAGES.API_ERROR, detail);
      throw new Error("Invalid API response: missing required fields");
    }

    try {
      await oompaDB.saveCharacterDetail(detail);
      console.log(`${MESSAGES.CACHE_SAVED} Character ${id}`);
    } catch (error) {
      console.warn(`Cache save failed for ${id}:`, error);
    }

    return { data: detail, fromCache: false };
  }
);

const initialState: OompaLoompaState = {
  data: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  hasMore: true,
  loadingDetailId: null,
  detailsCache: {},
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
    clearCache: (state) => {
      Object.assign(state, {
        data: [],
        currentPage: 1,
        hasMore: true,
        detailsCache: {},
        lastFetch: null,
      });
      oompaDB.clearAllData().catch(console.error);
    },
    resetPagination: (state) => {
      state.currentPage = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeFromCache.fulfilled, (state, action) => {
        const { allCharacters, lastPage } = action.payload;
        if (allCharacters?.length > 0) {
          console.log(
            `🗃️ Initialized ${allCharacters.length} characters from cache!`
          );
          state.data = allCharacters;
          state.currentPage = lastPage + 1;
          state.lastFetch = Date.now();
          state.hasMore = true;
        }
      })
      .addCase(loadOompaLoompasPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadOompaLoompasPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch data";
      })
      .addCase(loadOompaLoompasPage.fulfilled, (state, action) => {
        const { data, page, total } = action.payload;

        state.loading = false;
        state.totalPages = total;

        const newData = removeDuplicates(state.data, data);
        if (newData.length > 0) {
          state.data.push(...newData);
          state.lastFetch = Date.now();
        }

        state.currentPage = page + 1;
        state.hasMore = page < total && data.length > 0;

        console.log(
          `📊 Page ${page}: +${newData.length} new, ${state.data.length} total, has more: ${state.hasMore}`
        );
      })
      .addCase(loadOompaLoompaDetail.pending, (state, action) => {
        state.loadingDetailId = action.meta.arg;
      })
      .addCase(loadOompaLoompaDetail.rejected, (state) => {
        state.loadingDetailId = null;
        state.error = "Failed to fetch character detail";
      })
      .addCase(loadOompaLoompaDetail.fulfilled, (state, action) => {
        state.loadingDetailId = null;
        state.detailsCache[action.payload.data.id] = action.payload.data;
      });
  },
});

export const { setFilter, clearError, clearCache, resetPagination } =
  oompaLoompaSlice.actions;

export const selectFilteredOompaLoompas = (state: {
  oompaLoompas: OompaLoompaState;
}) => {
  const { data, filter } = state.oompaLoompas;

  if (!filter?.trim()) return data;

  const searchTerm = filter.toLowerCase().trim();
  return data.filter((character) => {
    const fullName =
      `${character.first_name} ${character.last_name}`.toLowerCase();
    return (
      fullName.includes(searchTerm) ||
      character.profession.toLowerCase().includes(searchTerm)
    );
  });
};

export default oompaLoompaSlice.reducer;
