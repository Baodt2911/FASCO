# FASCO ![Badge](https://img.shields.io/badge/Version-1.0.0-blue) ![License](https://img.shields.io/badge/License-ISC-green)

---

<p align="center">
  <b>Hệ thống quản lý bán hàng thời trang hiện đại</b><br>
  <i>Quản lý sản phẩm, đơn hàng, deals, mã giảm giá, tài khoản khách hàng và nhiều hơn nữa!</i>
</p>

---

## 📑 Mục lục

- [Giới thiệu](#giới-thiệu)
- [Ảnh demo](#ảnh-demo)
- [Tính năng chính](#tính-năng-chính)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Cài đặt & Chạy dự án](#cài-đặt--chạy-dự-án)
- [Liên hệ & Bản quyền](#liên-hệ--bản-quyền)

---

## 🚀 Giới thiệu

FASCO là hệ thống quản lý bán hàng thời trang, hỗ trợ quản lý sản phẩm, đơn hàng, deals, mã giảm giá, tài khoản khách hàng và nhiều tính năng khác dành cho cả người dùng và quản trị viên.

---

## 🖼️ Ảnh demo

|        Trang chủ / Dashboard        |              Trang sản phẩm               |            Trang đơn hàng             |
| :---------------------------------: | :---------------------------------------: | :-----------------------------------: |
| ![Demo Home](path/to/home-demo.png) | ![Demo Product](![image](https://github.com/user-attachments/assets/17009f0f-88ea-4bb1-8490-686fb0612470)
) | ![Demo Order](path/to/order-demo.png) |

---

## ✨ Tính năng chính

- **Quản lý sản phẩm:** Thêm, sửa, xóa, tìm kiếm, lọc sản phẩm theo loại, giá, hãng, giới tính...
- **Quản lý đơn hàng:** Theo dõi trạng thái, tìm kiếm, xác nhận, xử lý, giao hàng, hoàn thành, hủy đơn...
- **Deals khuyến mãi:** Tạo, chỉnh sửa, áp dụng cho sản phẩm, giới hạn số lượng, thời gian...
- **Mã giảm giá:** Tạo, chỉnh sửa, giới hạn sử dụng, thời gian hiệu lực...
- **Tài khoản người dùng:** Đăng ký, đăng nhập, quên mật khẩu, đổi mật khẩu, quản lý địa chỉ giao hàng...
- **Thống kê doanh thu, số lượng đơn hàng theo ngày/tháng.**
- **Dashboard trực quan cho quản trị viên.**

---

## 🛠️ Công nghệ sử dụng

| Backend                 | Frontend               |
| ----------------------- | ---------------------- |
| Node.js, Express.js     | HTML, CSS, JavaScript  |
| MongoDB (Mongoose)      | TailwindCSS, Bootstrap |
| Firebase Admin SDK      |                        |
| Socket.io, Multer       |                        |
| JWT, Nodemailer         |                        |
| ...và các thư viện khác |                        |

---

## 📁 Cấu trúc thư mục

<details>
<summary>Bấm để xem chi tiết</summary>

```text
FASCO/
  client/           # Frontend: giao diện người dùng, tài nguyên tĩnh
    public/pages/   # Các trang HTML chính
    src/js/        # Các file JS xử lý logic giao diện
    src/css/       # File CSS, Tailwind
    src/images/    # Ảnh sản phẩm
    src/icons/     # Icon giao diện
    src/logo/      # Logo, hình thức thanh toán
  server/           # Backend: API, xử lý nghiệp vụ
    controllers/   # Xử lý logic cho từng nghiệp vụ
    models/        # Định nghĩa schema MongoDB
    routes/        # Định nghĩa các route API
    services/      # Xử lý logic nghiệp vụ chuyên sâu
    middleware/    # Xử lý trung gian (auth, upload...)
    config/        # Cấu hình kết nối DB, firebase...
    sockets/       # Xử lý realtime
    views/         # Giao diện dashboard admin
    utils/         # Tiện ích chung
```

</details>

---

## ⚡ Cài đặt & Chạy dự án

### Yêu cầu

- Node.js >= 16
- Yarn hoặc npm
- MongoDB (local/cloud)
- Tài khoản Firebase (nếu dùng OTP/email)

### Cài đặt

```bash
# Backend
cd server
yarn install
# hoặc npm install

# Frontend
cd ../client
yarn install
# hoặc npm install
```

### Chạy dự án

```bash
# Backend
cd server
yarn start
# hoặc npm start

# Frontend (dùng live server hoặc mở file HTML trong browser)
# Nếu dùng Tailwind, build CSS:
yarn tailwindcss
# hoặc npm run tailwindcss
```

### Cấu hình môi trường

- Tạo file `.env` trong thư mục `server/` với các biến môi trường cần thiết (ví dụ: MONGODB*URI, FIREBASE*\*, JWT_SECRET...)

---

## 📬 Liên hệ & Bản quyền

- **Tác giả:** Baodt2911
- **Email:** ....
- **License:** ISC
