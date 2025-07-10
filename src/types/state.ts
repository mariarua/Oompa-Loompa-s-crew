import type { OompaLoompa, MinimalOompaLoompa } from "./oompaLoompa";

export interface OompaLoompaState {
  data: MinimalOompaLoompa[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  filter?: string;
  loadingDetailId: number | null;
  detailsCache: Record<number, OompaLoompa>;
  lastFetch: number | null;
}
