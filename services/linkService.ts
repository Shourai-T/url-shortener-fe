import { API_BASE_URL } from '../constants';
import { CreateLinkRequest, CreateLinkResponse, LinkItem, ListLinksResponse, ApiError } from '../types';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' })) as ApiError;
    throw new Error(errorData.error || `HTTP Error: ${response.status}`);
  }
  return response.json();
}

export const linkService = {
  createLink: async (payload: CreateLinkRequest): Promise<CreateLinkResponse> => {
    const response = await fetch(`${API_BASE_URL}/shorten`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return handleResponse<CreateLinkResponse>(response);
  },

  getLinks: async (page: number = 1, limit: number = 10): Promise<ListLinksResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/links?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse<ListLinksResponse>(response);
  },

  getLinkStats: async (code: string): Promise<LinkItem> => {
    const response = await fetch(`${API_BASE_URL}/api/stats/${code}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse<LinkItem>(response);
  },
  deleteLink: async (code: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/links/${code}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' })) as ApiError;
        throw new Error(errorData.error || `HTTP Error: ${response.status}`);
    }
  }
};