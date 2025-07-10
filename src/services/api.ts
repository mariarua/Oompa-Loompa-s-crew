import type { ApiResponse, OompaLoompa } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
    super(message);
    this.name = "ApiError";
  }
}

const createApiUrl = (endpoint: string) => `${API_BASE_URL}${endpoint}`;

const fetchWithErrorHandling = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new ApiError(
      `HTTP ${response.status}: Failed to fetch data`,
      response.status
    );
  }

  return response.json();
};

export const oompaLoompaApi = {
  async getPage(page: number): Promise<ApiResponse> {
    return fetchWithErrorHandling<ApiResponse>(
      createApiUrl(`/oompa-loompas?page=${page}`)
    );
  },

  async getDetail(id: number): Promise<OompaLoompa> {
    const detail = await fetchWithErrorHandling<Omit<OompaLoompa, "id">>(
      createApiUrl(`/oompa-loompas/${id}`)
    );

    return { ...detail, id };
  },
};

export { ApiError };
