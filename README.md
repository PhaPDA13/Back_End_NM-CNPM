# Backend - Hệ thống Quản lý Đại lý

Backend API cho hệ thống quản lý đại lý, xây dựng bằng Node.js, Express và PostgreSQL.

## 📋 Mục lục

- [Giới thiệu](#giới-thiệu)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt](#cài-đặt)
- [Cấu hình](#cấu-hình)
- [Chạy ứng dụng](#chạy-ứng-dụng)
- [API Documentation](#api-documentation)
- [Nhóm phát triển](#nhóm-phát-triển)

## 🎯 Giới thiệu

Hệ thống Backend cung cấp các API RESTful để quản lý đại lý, bao gồm các chức năng:

- Quản lý thông tin đại lý
- Xác thực và phân quyền người dùng
- Quản lý giao dịch và báo cáo
- Tích hợp với cơ sở dữ liệu PostgreSQL

## 🛠 Công nghệ sử dụng

- **Runtime**: Node.js
- **Framework**: Express.js v5.2.1
- **Database**: PostgreSQL
- **Authentication**: bcrypt v6.0.0
- **Environment Variables**: dotenv v17.2.3
- **CORS**: cors v2.8.5
- **Database Driver**: pg v8.16.3

## 📁 Cấu trúc dự án

```
Backend_CNPM/
├── src/
│   ├── app.js              # Khởi tạo Express app
│   ├── server.js           # Entry point của ứng dụng
│   ├── config/             # Các file cấu hình
│   │   └── cors.js         # Cấu hình CORS
│   ├── constants/          # Các hằng số dùng chung
│   ├── controllers/        # Controllers xử lý business logic
│   ├── loaders/            # Khởi tạo các service
│   │   ├── express.js      # Cấu hình Express middleware
│   │   ├── index.js        # Tổng hợp tất cả loaders
│   │   ├── logger.js       # Cấu hình logging
│   │   └── postgres.js     # Kết nối PostgreSQL
│   ├── middlewares/        # Custom middlewares
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── services/           # Business logic layer
│   ├── utils/              # Utility functions
│   └── validations/        # Input validation schemas
├── .env.example            # Template cho environment variables
├── .gitignore              # Git ignore rules
├── package.json            # Dependencies và scripts
└── README.md               # Documentation

```

## 💻 Yêu cầu hệ thống

- Node.js >= 18.0.0
- PostgreSQL >= 14.0
- npm hoặc yarn

## 🚀 Cài đặt

### 1. Clone repository

```bash
git clone https://github.com/hcmus-phat/Back_End_NM-CNPM.git
cd Backend_CNPM
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Tạo file .env

```bash
cp .env.example .env
```

## ⚙️ Cấu hình

Chỉnh sửa file `.env` với các thông tin sau:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# JWT Configuration (nếu có)
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

### Cấu hình CORS

Mặc định, CORS được cấu hình cho phép request từ:

- `http://localhost:5173` (Vite dev server)

Để thêm origin khác, chỉnh sửa file [src/config/cors.js](src/config/cors.js):

```javascript
const whitelist = [
  "http://localhost:5173",
  "http://localhost:3001", // Thêm origin mới
];
```

## 🏃 Chạy ứng dụng

### Development mode (với hot reload)

```bash
npm run dev
```

Server sẽ chạy tại `http://localhost:3000` và tự động restart khi có thay đổi code.

### Production mode

```bash
npm start
```

## 📡 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Endpoints chính

API endpoints sẽ được cập nhật khi các routes được implement:

```
GET    /api/agents         # Lấy danh sách đại lý
POST   /api/agents         # Tạo đại lý mới
GET    /api/agents/:id     # Lấy thông tin đại lý
PUT    /api/agents/:id     # Cập nhật đại lý
DELETE /api/agents/:id     # Xóa đại lý
```

### Response Format

Successful Response:

```json
{
  "success": true,
  "data": {},
  "message": "Success message"
}
```

Error Response:

```json
{
  "success": false,
  "error": "Error message",
  "details": {}
}
```

## 🗄️ Database

### Kết nối PostgreSQL

Database được kết nối tự động khi khởi động server thông qua loader. Cấu hình kết nối tại [src/loaders/postgres.js](src/loaders/postgres.js).

### Migration

Hướng dẫn chạy migration sẽ được cập nhật.

## 🔒 Security

- Passwords được mã hóa bằng bcrypt
- CORS được cấu hình với whitelist
- Environment variables được quản lý qua dotenv
- SSL/TLS được bật cho PostgreSQL connection

## 🧪 Testing

```bash
npm test
```

_Lưu ý: Test suite đang được phát triển_

## 📝 Code Style

Project sử dụng ES6+ modules với cú pháp:

- `import/export` thay vì `require/module.exports`
- Arrow functions
- Async/await
- Destructuring

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 👥 Nhóm phát triển

**Group 04** - HCMUS

- GitHub: [hcmus-phat](https://github.com/hcmus-phat)

## 📄 License

ISC License

## 🐛 Bug Reports

Nếu phát hiện lỗi, vui lòng tạo issue tại [GitHub Issues](https://github.com/hcmus-phat/Back_End_NM-CNPM/issues)

---

Made with ❤️ by Group 04
