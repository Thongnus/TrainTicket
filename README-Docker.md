# Docker Setup for Train Ticket System

Hệ thống bao gồm 2 ứng dụng:
- **User App** (Train Ticket): Port 3000
- **Admin App**: Port 3001

## Cấu trúc thư mục
```
TrainTicket/          # User app (port 3000)
├── Dockerfile        # Production
├── Dockerfile.dev    # Development
├── docker-compose.yml
├── docker-compose.dev.yml
└── ...

../admin/             # Admin app (port 3001)
├── Dockerfile        # Production
├── Dockerfile.dev    # Development
└── ...
```

## Cách sử dụng

### Production Environment

1. **Chạy cả 2 ứng dụng:**
```bash
docker-compose up --build
```

2. **Chạy ở background:**
```bash
docker-compose up -d --build
```

3. **Dừng:**
```bash
docker-compose down
```

### Development Environment

1. **Chạy cả 2 ứng dụng với hot reload:**
```bash
docker-compose -f docker-compose.dev.yml up --build
```

2. **Chạy ở background:**
```bash
docker-compose -f docker-compose.dev.yml up -d --build
```

3. **Dừng:**
```bash
docker-compose -f docker-compose.dev.yml down
```

### Chạy riêng lẻ

#### User App (Train Ticket)
```bash
# Production
docker build -t train-ticket-app .
docker run -p 3000:3000 train-ticket-app

# Development
docker build -f Dockerfile.dev -t train-ticket-app-dev .
docker run -p 3000:3000 -v $(pwd):/app train-ticket-app-dev
```

#### Admin App
```bash
# Từ thư mục admin
cd ../admin

# Production
docker build -t admin-app .
docker run -p 3001:3001 admin-app

# Development
docker build -f Dockerfile.dev -t admin-app-dev .
docker run -p 3001:3001 -v $(pwd):/app admin-app-dev
```

## Truy cập ứng dụng

- **User App**: http://localhost:3000
- **Admin App**: http://localhost:3001

## Biến môi trường

### User App
- `NEXT_PUBLIC_API_URL`: URL của API backend
- `NEXT_PUBLIC_ADMIN_URL`: URL của admin app

### Admin App
- `PORT`: Port để chạy ứng dụng (mặc định: 3001)
- `HOSTNAME`: Hostname (mặc định: 0.0.0.0)

## Lưu ý

1. **Đường dẫn admin**: Trong `docker-compose.yml`, đường dẫn đến admin app được set là `../admin`. Hãy điều chỉnh nếu cần thiết.

2. **Volume mounting**: Trong development mode, source code được mount vào container để hỗ trợ hot reload.

3. **Networks**: Cả 2 ứng dụng được kết nối qua network `train-network` để có thể giao tiếp với nhau.

4. **Health checks**: Cả 2 ứng dụng đều có health check để đảm bảo hoạt động ổn định.

## Troubleshooting

### Port đã được sử dụng
```bash
# Kiểm tra port đang sử dụng
netstat -tulpn | grep :3000
netstat -tulpn | grep :3001

# Dừng container cũ
docker-compose down
```

### Build lỗi
```bash
# Xóa cache và build lại
docker-compose build --no-cache
```

### Permission issues
```bash
# Chạy với sudo (Linux/Mac)
sudo docker-compose up --build
``` 