# Hướng dẫn Deploy lên Vercel

## Các thay đổi đã thực hiện để chuẩn bị deploy

1. **Loại bỏ static export**: Đã xóa `output: 'export'` từ `next.config.mjs` vì Vercel tự động xử lý static generation.

2. **Tạo file cấu hình Vercel**: Đã tạo `vercel.json` với các cấu hình tối ưu cho deployment.

3. **Cập nhật package.json**: Đã thêm script `vercel-build` để Vercel có thể build project.

## Cách deploy lên Vercel

### Phương pháp 1: Sử dụng Vercel CLI

1. Cài đặt Vercel CLI:
```bash
npm i -g vercel
```

2. Đăng nhập vào Vercel:
```bash
vercel login
```

3. Deploy project:
```bash
vercel
```

4. Follow các prompts để cấu hình project.

### Phương pháp 2: Deploy qua GitHub

1. Push code lên GitHub repository.

2. Truy cập [vercel.com](https://vercel.com) và đăng nhập.

3. Click "New Project" và import repository từ GitHub.

4. Vercel sẽ tự động detect Next.js và cấu hình build settings.

5. Click "Deploy" để bắt đầu deployment.

## Cấu hình đã được tối ưu

- **Framework**: Next.js được detect tự động
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Node.js Runtime**: 18.x
- **Security Headers**: Đã thêm các headers bảo mật cơ bản

## Lưu ý quan trọng

- Project sử dụng client-side image processing, không cần server-side API routes
- Tất cả dependencies đều tương thích với Vercel
- Build đã được test thành công với `npm run build`

## Sau khi deploy

1. Vercel sẽ cung cấp URL production
2. Có thể cấu hình custom domain nếu cần
3. Automatic deployments khi push code mới lên GitHub (nếu sử dụng phương pháp 2)
