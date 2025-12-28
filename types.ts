// 1. Request Payload cho API Create
export interface CreateLinkRequest {
  original_url: string;
}

// 2. Response cho API Create
export interface CreateLinkResponse {
  short_code: string;
}

// 3. Object Link đầy đủ (Dùng cho API Stats & List)
export interface LinkItem {
  url: string;           // URL gốc
  short_code: string;    // Mã rút gọn
  clicks: number;   // Số lượt click
  created_at: string;    // Thời gian tạo (ISO String)
  expires_at?: string | null;
}

// 4. Response cho API List (Pagination)
export interface ListLinksResponse {
  data: LinkItem[];
  page: number;
  limit: number;
}

export interface ApiError {
  error: string;
}