import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  initializeFromCache,
  loadOompaLoompasPage,
} from "../store/slices/oompaLoompaSlice";
import type { RootState } from "../store/index";
import type { CacheInitData } from "../types";

export const useHomePageData = () => {
  const dispatch = useAppDispatch();
  const { data, loading, hasMore, totalPages } = useAppSelector(
    (state: RootState) => state.oompaLoompas
  );

  useEffect(() => {
    const initializeData = async () => {
      const result = await dispatch(initializeFromCache());
      const cacheData = result.payload as CacheInitData;
      if (!cacheData?.allCharacters?.length) {
        dispatch(loadOompaLoompasPage(1));
      }
    };
    if (data.length === 0 && !loading) {
      initializeData();
    }
  }, [dispatch, data.length, loading]);

  return {
    data,
    loading,
    hasMore,
    totalPages,
    isInitialLoading: loading && data.length === 0,
  } as const;
};
