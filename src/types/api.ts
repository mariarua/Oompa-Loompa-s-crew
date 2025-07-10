import type { MinimalOompaLoompa, OompaLoompa } from "./oompaLoompa";

export interface ApiResponse {
  current: number;
  total: number;
  results: OompaLoompa[];
}

export interface CacheInitData {
  allCharacters: MinimalOompaLoompa[];
  lastPage: number;
}

export interface PageLoadResult {
  data: MinimalOompaLoompa[];
  fromCache: boolean;
  page: number;
  total: number;
}

export interface DetailLoadResult {
  data: OompaLoompa;
  fromCache: boolean;
}
