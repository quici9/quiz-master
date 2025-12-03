# 👥 User Guide - Quiz Practice System

**Hướng dẫn sử dụng hệ thống thi thử trực tuyến**

---

## 📋 Mục lục

1. [Giới thiệu](#giới-thiệu)
2. [Đăng ký tài khoản](#đăng-ký-tài-khoản)
3. [Đăng nhập](#đăng-nhập)
4. [Duyệt và chọn đề thi](#duyệt-và-chọn-đề-thi)
5. [Làm bài thi](#làm-bài-thi)
6. [Xem kết quả](#xem-kết-quả)
7. [Lịch sử thi](#lịch-sử-thi)
8. [Quản lý tài khoản](#quản-lý-tài-khoản)
9. [Hướng dẫn dành cho Admin](#hướng-dẫn-dành-cho-admin)
10. [Câu hỏi thường gặp](#câu-hỏi-thường-gặp)

---

## 🎯 Giới thiệu

Quiz Practice System là hệ thống thi thử trực tuyến cho phép bạn:
- Luyện tập với các bộ đề thi
- Nhận kết quả ngay lập tức
- Xem lại chi tiết câu trả lời
- Theo dõi lịch sử thi của mình

### Yêu cầu hệ thống
- **Trình duyệt:** Chrome, Firefox, Safari, Edge (phiên bản mới nhất)
- **Kết nối:** Mạng nội bộ (intranet)
- **Thiết bị:** Desktop, laptop, tablet, hoặc smartphone

---

## 📝 Đăng ký tài khoản

### Bước 1: Truy cập trang đăng ký
1. Mở trình duyệt
2. Truy cập: `http://<địa-chỉ-server>:3000`
3. Click vào **"Register"** hoặc **"Đăng ký"**

### Bước 2: Điền thông tin
- **Email:** Địa chỉ email của bạn (dùng để đăng nhập)
- **Password:** Mật khẩu (tối thiểu 8 ký tự)
- **Full Name:** Họ và tên (không bắt buộc)

### Bước 3: Xác nhận
- Click **"Register"**
- Nếu thành công, bạn sẽ tự động đăng nhập

### ⚠️ Lưu ý:
- Email phải là duy nhất (không được trùng với tài khoản khác)
- Mật khẩu nên có ít nhất 8 ký tự, bao gồm chữ và số
- Ghi nhớ mật khẩu của bạn (hệ thống không hỗ trợ quên mật khẩu tự động)

---

## 🔐 Đăng nhập

### Bước 1: Truy cập trang đăng nhập
1. Truy cập: `http://<địa-chỉ-server>:3000/login`
2. Hoặc click **"Login"** từ trang chủ

### Bước 2: Nhập thông tin
- **Email:** Email bạn đã đăng ký
- **Password:** Mật khẩu của bạn

### Bước 3: Đăng nhập
- Click **"Login"**
- Nếu thành công, bạn sẽ được chuyển đến trang Dashboard

### ❌ Nếu gặp lỗi:
- **"Invalid credentials"**: Email hoặc mật khẩu không đúng
- **"Too many requests"**: Bạn đã thử đăng nhập quá nhiều lần, chờ 1 phút

---

## 📚 Duyệt và chọn đề thi

### Xem danh sách đề thi

1. Sau khi đăng nhập, click **"Quizzes"** hoặc **"Danh sách đề"**
2. Bạn sẽ thấy danh sách các đề thi có sẵn

### Thông tin mỗi đề thi:
- **Tên đề:** Tiêu đề của bộ đề
- **Mô tả:** Nội dung, phạm vi kiến thức
- **Số câu hỏi:** Tổng số câu trong đề

### Tìm kiếm đề thi:
- Sử dụng thanh tìm kiếm ở đầu trang
- Nhập từ khóa liên quan đến tên đề hoặc nội dung

### Xem chi tiết đề thi:
1. Click vào một đề thi trong danh sách
2. Bạn sẽ thấy:
   - Thông tin chi tiết
   - Số lần bạn đã thi đề này
   - Điểm trung bình (nếu có)
3. Click **"Start Quiz"** để bắt đầu làm bài

---

## ✍️ Làm bài thi

### Bắt đầu làm bài

1. Click **"Start Quiz"** từ trang chi tiết đề thi
2. Hệ thống sẽ tải câu hỏi và bắt đầu bài thi

### Giao diện làm bài

```
┌─────────────────────────────────────────┐
│ Câu 15/50                    [Progress] │
├─────────────────────────────────────────┤
│                                         │
│ Câu hỏi: Nội dung câu hỏi ở đây?       │
│                                         │
│ ○ A. Đáp án A                           │
│ ● B. Đáp án B  ← Đáp án bạn chọn       │
│ ○ C. Đáp án C                           │
│ ○ D. Đáp án D                           │
│                                         │
├─────────────────────────────────────────┤
│ [← Previous]        [Next →]            │
└─────────────────────────────────────────┘
```

### Trả lời câu hỏi:
1. Đọc câu hỏi
2. Click vào đáp án bạn cho là đúng
3. Đáp án được chọn sẽ được highlight (đổi màu)

### Di chuyển giữa các câu:
- **Next (Tiếp):** Chuyển sang câu kế tiếp
- **Previous (Trước):** Quay lại câu trước đó
- Bạn có thể di chuyển tự do, không nhất thiết phải làm theo thứ tự

### Thanh tiến độ:
- Hiển thị ở đầu trang
- Cho biết bạn đang ở câu bao nhiêu
- Hiển thị % hoàn thành

### ⚠️ Lưu ý quan trọng:
- Câu trả lời được **tự động lưu** khi bạn chọn
- Nếu tắt trình duyệt giữa chừng, bài làm sẽ **mất**
- Hãy hoàn thành bài thi trong một lần ngồi

---

## 🎯 Nộp bài

### Khi nào nộp bài?
- Khi bạn đã trả lời xong tất cả câu hỏi
- Hoặc khi bạn muốn kết thúc bài thi sớm

### Cách nộp bài:
1. Ở câu cuối cùng, nút **"Next"** sẽ đổi thành **"Submit"**
2. Click **"Submit Quiz"**
3. Hệ thống sẽ hiển thị popup xác nhận:
   ```
   Are you sure you want to submit?
   
   [Cancel]  [Submit]
   ```
4. Click **"Submit"** để xác nhận

### Sau khi nộp:
- Hệ thống sẽ chấm điểm ngay lập tức
- Bạn sẽ được chuyển đến trang kết quả

---

## 📊 Xem kết quả

### Trang kết quả hiển thị:

```
┌──────────────────────────────────┐
│      Quiz Results                │
│                                  │
│         84%                      │
│    42 / 50 correct               │
│                                  │
└──────────────────────────────────┘
```

### Thông tin chi tiết:
1. **Điểm số:** Phần trăm câu đúng (84%)
2. **Số câu đúng:** 42 câu đúng / 50 câu
3. **Thời gian:** Tổng thời gian làm bài (nếu có)

### Xem lại từng câu:

Cuộn xuống để thấy chi tiết từng câu:

**Câu trả lời đúng:**
```
✅ Câu 1: Nội dung câu hỏi?
Your answer: B. Đáp án B (Correct!)
```

**Câu trả lời sai:**
```
❌ Câu 2: Nội dung câu hỏi?
Your answer: A. Đáp án A (Wrong)
Correct answer: C. Đáp án C
```

### Các nút chức năng:
- **Take Another Quiz:** Làm đề khác
- **View History:** Xem lịch sử thi
- **Retake Quiz:** Làm lại đề này (nếu muốn)

---

## 📅 Lịch sử thi

### Truy cập lịch sử:
1. Click vào **"History"** hoặc **"Lịch sử"** trên menu
2. Bạn sẽ thấy danh sách tất cả lần thi của mình

### Thông tin hiển thị:
```
┌────────────────────────────────────────────┐
│ AI & Machine Learning Quiz                 │
│ Score: 84% (42/50)                         │
│ Date: 2024-12-03 14:30                     │
│ Time spent: 35 minutes                     │
│ [View Details]                             │
└────────────────────────────────────────────┘
```

### Xem chi tiết lần thi cũ:
1. Click **"View Details"** trên bất kỳ lần thi nào
2. Bạn sẽ thấy:
   - Điểm số
   - Từng câu hỏi
   - Câu trả lời của bạn
   - Đáp án đúng

### Lọc và sắp xếp:
- Lọc theo đề thi cụ thể
- Sắp xếp theo ngày thi (mới nhất trước)
- Phân trang nếu có nhiều lần thi

---

## 👤 Quản lý tài khoản

### Xem thông tin cá nhân:
1. Click vào tên bạn ở góc phải trên cùng
2. Chọn **"Profile"** hoặc **"Thông tin cá nhân"**

### Cập nhật thông tin:
- **Full Name:** Đổi tên hiển thị
- **Email:** Không thể thay đổi

### Đổi mật khẩu:
1. Vào **"Profile"** → **"Change Password"**
2. Nhập:
   - **Current Password:** Mật khẩu hiện tại
   - **New Password:** Mật khẩu mới
   - **Confirm Password:** Nhập lại mật khẩu mới
3. Click **"Update Password"**

### Đăng xuất:
- Click vào tên bạn ở góc phải
- Chọn **"Logout"** hoặc **"Đăng xuất"**

---

## 🔧 Hướng dẫn dành cho Admin

### Quyền Admin:
- Upload đề thi mới
- Quản lý đề thi (xem, xóa)
- Xem thống kê
- Tất cả quyền của User thường

### Upload đề thi mới:

#### Bước 1: Chuẩn bị file Word
- Format file: `.docx` (không phải `.doc`)
- Định dạng nội dung theo hướng dẫn (xem **WORD_FORMAT_EXAMPLE.md**)

#### Bước 2: Truy cập trang Upload
1. Đăng nhập với tài khoản Admin
2. Click **"Admin"** trên menu
3. Chọn **"Upload Quiz"**

#### Bước 3: Điền thông tin
```
┌──────────────────────────────────┐
│ Upload Quiz                      │
│                                  │
│ Quiz Title: [_____________]      │
│                                  │
│ Description: [_____________]     │
│              [_____________]     │
│                                  │
│ Quiz File: [Choose File]         │
│                                  │
│ [Upload Quiz]                    │
└──────────────────────────────────┘
```

- **Quiz Title:** Tên đề thi (bắt buộc)
- **Description:** Mô tả ngắn về đề thi
- **Quiz File:** Chọn file .docx

#### Bước 4: Upload
1. Click **"Upload Quiz"**
2. Đợi hệ thống xử lý (có thể mất vài giây)
3. Nếu thành công, bạn sẽ thấy thông báo:
   ```
   Quiz uploaded successfully!
   48 questions imported
   ```

#### Bước 5: Kiểm tra
- Truy cập danh sách đề thi
- Tìm đề mới vừa upload
- Thử làm vài câu để kiểm tra

### Quản lý đề thi:

#### Xem danh sách:
1. Click **"Admin"** → **"Manage Quizzes"**
2. Bạn sẽ thấy bảng với tất cả đề thi

#### Xóa đề thi:
1. Tìm đề muốn xóa trong bảng
2. Click **"Delete"**
3. Xác nhận trong popup
4. ⚠️ **Cảnh báo:** Xóa đề sẽ xóa luôn:
   - Tất cả câu hỏi
   - Tất cả lịch sử thi của đề đó
   - Hành động này **không thể hoàn tác**

#### Xem thống kê:
- **Total Attempts:** Tổng số lượt thi
- **Average Score:** Điểm trung bình

### ⚠️ Lưu ý cho Admin:
- Luôn kiểm tra file Word trước khi upload
- Backup database thường xuyên
- Không xóa đề thi khi còn người đang thi
- Thông báo trước cho user khi xóa đề quan trọng

---

## ❓ Câu hỏi thường gặp

### 1. Tôi quên mật khẩu, làm sao?
**Trả lời:** Hiện tại hệ thống chưa có chức năng reset mật khẩu tự động. Vui lòng liên hệ Admin để được hỗ trợ.

---

### 2. Tôi có thể làm lại đề thi không?
**Trả lời:** Có! Bạn có thể làm lại đề thi bao nhiêu lần tùy thích. Mỗi lần làm sẽ được lưu riêng trong lịch sử.

---

### 3. Có giới hạn thời gian làm bài không?
**Trả lời:** Hiện tại không có giới hạn thời gian. Bạn có thể làm bài với tốc độ của riêng mình.

---

### 4. Tôi có thể tạm dừng và tiếp tục sau không?
**Trả lời:** Không. Bạn phải hoàn thành bài thi trong một lần ngồi. Nếu tắt trình duyệt, bài làm sẽ bị mất.

---

### 5. Làm sao để xem đáp án đúng?
**Trả lời:** Sau khi nộp bài, cuộn xuống trang kết quả. Bạn sẽ thấy chi tiết từng câu với đáp án đúng được highlight.

---

### 6. Tôi chọn nhầm đáp án, làm sao đổi?
**Trả lời:** 
- Nếu chưa sang câu khác: Click vào đáp án đúng
- Nếu đã sang câu khác: Click **"Previous"** quay lại và chọn lại

---

### 7. Hệ thống có chấm điểm tự động không?
**Trả lời:** Có! Điểm được tính ngay sau khi bạn nộp bài. Không cần đợi Admin chấm.

---

### 8. Tôi có thể xem lịch sử thi của người khác không?
**Trả lời:** Không. Mỗi người chỉ thấy được lịch sử thi của chính mình.

---

### 9. Làm sao biết câu nào tôi chưa trả lời?
**Trả lời:** Hiện tại hệ thống cho phép nộp bài ngay cả khi chưa trả lời hết. Câu không trả lời sẽ được tính là sai.

---

### 10. Hệ thống có hoạt động trên điện thoại không?
**Trả lời:** Có! Giao diện được thiết kế responsive, hoạt động tốt trên điện thoại và tablet.

---

## 📱 Sử dụng trên thiết bị di động

### Trình duyệt được khuyến nghị:
- **Android:** Chrome, Firefox
- **iOS:** Safari, Chrome

### Tips cho mobile:
1. Xoay ngang màn hình để có nhiều không gian hơn
2. Zoom in/out nếu chữ quá nhỏ
3. Đảm bảo kết nối mạng ổn định
4. Tránh nhận cuộc gọi/tin nhắn khi đang thi

---

## 🔒 Bảo mật và quyền riêng tư

### Dữ liệu của bạn:
- **Email:** Chỉ Admin có thể xem
- **Mật khẩu:** Được mã hóa, không ai xem được (kể cả Admin)
- **Lịch sử thi:** Chỉ bạn và Admin có thể xem
- **Kết quả:** Không được công khai, chỉ bạn thấy

### An toàn:
- Không chia sẻ mật khẩu với người khác
- Đăng xuất sau khi sử dụng trên máy tính chung
- Thay đổi mật khẩu định kỳ

---

## 🆘 Hỗ trợ

### Khi gặp vấn đề:

1. **Kiểm tra kết nối mạng**
2. **Refresh trang** (F5 hoặc Ctrl+R)
3. **Xóa cache trình duyệt**
4. **Thử trình duyệt khác**
5. **Liên hệ Admin**

### Thông tin cần cung cấp khi báo lỗi:
- Mô tả vấn đề
- Lúc nào xảy ra (ngày, giờ)
- Bạn đang làm gì khi lỗi xảy ra
- Thông báo lỗi (nếu có)
- Screenshot (nếu có thể)

---

## 📞 Liên hệ

**Technical Support:**
- Email: [admin-email]
- Phone: [admin-phone]

**System Administrator:**
- Name: [admin-name]
- Email: [admin-email]

---

## 📚 Tài liệu tham khảo

- **SYSTEM_DESIGN.md:** Kiến trúc hệ thống (dành cho Developer)
- **WORD_FORMAT_EXAMPLE.md:** Hướng dẫn format file Word (dành cho Admin)
- **README.md:** Tổng quan dự án

---

## 🎓 Tips để thi tốt

1. **Đọc kỹ câu hỏi** trước khi chọn đáp án
2. **Sử dụng Previous/Next** để xem lại câu khó
3. **Không vội vàng** - không có giới hạn thời gian
4. **Học từ lịch sử** - xem lại các lần thi trước
5. **Thực hành nhiều lần** - làm lại đề để cải thiện điểm

---

**Chúc bạn thi tốt! 🎉**

---

**Version:** 2.0  
**Last Updated:** December 2024  
**Language:** Tiếng Việt & English
