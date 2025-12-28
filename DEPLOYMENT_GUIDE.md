# Hướng dẫn Deploy Frontend lên Render.com

Project này đã được cấu hình sẵn để deploy dễ dàng lên [Render.com](https://render.com) theo dạng **Static Site**.

## Cách 1: Tự động (Khuyên dùng - Blueprints)

File `render.yaml` đã được tạo sẵn trong project để tự động hóa cấu hình.

1.  Đẩy code của bạn lên **GitHub** hoặc **GitLab**.
2.  Đăng nhập vào Render.com dashboard.
3.  Chọn **New +** -> **Blueprint**.
4.  Kết nối với repository của bạn.
5.  Render sẽ tự động đọc file `render.yaml` và đề xuất cấu hình.
6.  Nhấn **Apply** để bắt đầu deploy.
7.  Sau khi service được tạo, vào tab **Environment** để cập nhật `VITE_API_BASE_URL` trỏ đến Backend thật của bạn (nếu cần thay đổi khác so với mặc định).

## Cách 2: Thủ công (Manual)

Nếu bạn không muốn dùng Blueprint:

1.  Đăng nhập Render, chọn **New +** -> **Static Site**.
2.  Kết nối repository.
3.  Điền các thông tin sau:
    - **Name**: `url-shortener-fe` (hoặc tên tùy thích)
    - **Main Branch**: `main` (hoặc branch bạn dùng)
    - **Root Directory**: (để trống)
    - **Build Command**: `npm install && npm run build`
    - **Publish Directory**: `dist`
4.  Kéo xuống phần **Environment Variables**, thêm:
    - `VITE_API_BASE_URL`: URL của Backend API (ví dụ: `https://api.your-backend.com`)
5.  Nhấn **Create Static Site**.

## Cấu hình SPA (Quan trọng)

Vì đây là ứng dụng React (Single Page Application), chúng ta cần chuyển hướng tất cả request về `index.html`.

- **Nếu dùng Cách 1**: `render.yaml` đã tự xử lý việc này.
- **Nếu dùng Cách 2**: Vào tab **Redirects/Rewrites** của service -> Add Rule:
  - **Source**: `/*`
  - **Destination**: `/index.html`
  - **Action**: `Rewrite`

## Kiểm tra

Sau khi deploy xong, Render sẽ cung cấp một URL (ví dụ: `https://url-shortener-fe.onrender.com`). Hãy truy cập để kiểm tra ứng dụng.
