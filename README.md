# App Test - Expo Router App 👋

Ứng dụng React Native được xây dựng với Expo Router, có tính năng đăng nhập và navigation drawer.

---

## 📁 Cấu trúc thư mục

```
app-test/
├── app/                      # Thư mục routing chính (file-based routing)
│   ├── _layout.tsx           # Root layout - cấu hình navigation gốc
│   ├── index.tsx             # Entry point - điều hướng dựa trên auth state
│   ├── modal.tsx             # Màn hình modal
│   ├── (auth)/               # Group màn hình xác thực (chưa đăng nhập)
│   │   ├── _layout.tsx       # Layout cho auth screens
│   │   └── login.tsx         # Màn hình đăng nhập
│   ├── (home)/             # Group màn hình chính (đã đăng nhập)
│   │   ├── _layout.tsx       # Layout Drawer navigation + menu sidebar
│   │   ├── index.tsx         # Trang chủ (Home)
│   │   ├── profile.tsx       # Trang hồ sơ cá nhân
│   │   └── settings.tsx      # Trang cài đặt
│   └── (tabs)/               # Group tabs (không sử dụng)
│
├── components/               # Các component tái sử dụng
│   ├── external-link.tsx     # Component link external
│   ├── haptic-tab.tsx        # Tab với haptic feedback
│   ├── hello-wave.tsx        # Component animation vẫy tay
│   ├── parallax-scroll-view.tsx  # ScrollView với hiệu ứng parallax
│   ├── themed-text.tsx       # Text component theo theme
│   ├── themed-view.tsx       # View component theo theme
│   └── ui/                   # UI components
│       ├── collapsible.tsx   # Component thu gọn/mở rộng
│       ├── icon-symbol.tsx   # Icon component (Android/Web)
│       └── icon-symbol.ios.tsx  # Icon component (iOS)
│
├── constants/                # Các hằng số
│   └── theme.ts              # Cấu hình theme (màu sắc, fonts...)
│
├── contexts/                 # React Context providers
│   └── AuthContext.tsx       # Context quản lý authentication
│
├── hooks/                    # Custom React hooks
│   ├── use-color-scheme.ts   # Hook lấy color scheme (dark/light)
│   ├── use-color-scheme.web.ts  # Hook color scheme cho web
│   └── use-theme-color.ts    # Hook lấy màu theo theme
│
├── assets/                   # Tài nguyên tĩnh
│   └── images/               # Hình ảnh (icons, splash, logo...)
│
├── scripts/                  # Scripts tiện ích
│   └── reset-project.js      # Script reset project về trạng thái ban đầu
│
├── app.json                  # Cấu hình Expo app
├── package.json              # Dependencies và scripts
├── tsconfig.json             # Cấu hình TypeScript
└── eslint.config.js          # Cấu hình ESLint
```

---

## 📄 Chi tiết từng file

### 🗂️ **App Directory (Routing)**

| File | Mô tả |
|------|-------|
| `app/_layout.tsx` | **Root Layout** - Wrap toàn bộ app với `GestureHandlerRootView`, `AuthProvider`, `ThemeProvider`. Định nghĩa Stack navigator cho các routes chính. |
| `app/index.tsx` | **Entry Point** - Kiểm tra `isLoggedIn` và redirect đến `/(home)` hoặc `/(auth)/login`. |
| `app/modal.tsx` | Màn hình modal (chưa sử dụng). |

### 🔐 **Auth Group** `(auth)/`

| File | Mô tả |
|------|-------|
| `(auth)/_layout.tsx` | Layout cho auth screens - Stack navigator không header. |
| `(auth)/login.tsx` | **Màn hình Đăng nhập** - Form nhập email/password, gradient background, social login buttons. Redirect về drawer khi đăng nhập thành công. |

### 📱 **Drawer Group** `(home)/`

| File | Mô tả |
|------|-------|
| `(home)/_layout.tsx` | **Drawer Layout** - Custom sidebar menu với profile user, menu items, stats card, logout button. Hamburger menu button trong header. |
| `(home)/index.tsx` | **Trang chủ** - Welcome section, quick action cards, hoạt động gần đây. |
| `(home)/profile.tsx` | **Hồ sơ cá nhân** - Avatar, thông tin user, cài đặt tài khoản. |
| `(home)/settings.tsx` | **Cài đặt** - Toggle switches (dark mode, notifications, biometric), cài đặt app, hỗ trợ. |

### 🧩 **Contexts**

| File | Mô tả |
|------|-------|
| `contexts/AuthContext.tsx` | **Auth Context** - Quản lý state đăng nhập (`isLoggedIn`, `user`). Cung cấp functions `login()` và `logout()`. Fake authentication (chấp nhận mọi email/password). |

### 🎣 **Hooks**

| File | Mô tả |
|------|-------|
| `hooks/use-color-scheme.ts` | Hook trả về color scheme hiện tại (dark/light). |
| `hooks/use-color-scheme.web.ts` | Version cho web platform. |
| `hooks/use-theme-color.ts` | Hook trả về màu theo theme và key. |

### 🎨 **Constants**

| File | Mô tả |
|------|-------|
| `constants/theme.ts` | Định nghĩa màu sắc cho light/dark theme. |

---

## 🔄 Luồng hoạt động (Flow)

```
┌─────────────────────────────────────────────────────────────┐
│                        App Start                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    app/_layout.tsx                           │
│  - GestureHandlerRootView (wrap gesture)                    │
│  - AuthProvider (cung cấp auth context)                     │
│  - ThemeProvider (cung cấp theme)                           │
│  - Stack Navigator                                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     app/index.tsx                            │
│  - Kiểm tra isLoggedIn từ AuthContext                       │
│  - Redirect đến route phù hợp                               │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              │                               │
              ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────┐
│   isLoggedIn = false    │     │   isLoggedIn = true     │
│                         │     │                         │
│  → /(auth)/login        │     │  → /(home)            │
│                         │     │                         │
│  Màn hình đăng nhập     │     │  Drawer Navigation      │
│  - Nhập email/password  │     │  - Home                 │
│  - Bấm đăng nhập        │     │  - Profile              │
│  - Gọi login()          │     │  - Settings             │
└─────────────────────────┘     └─────────────────────────┘
              │                               │
              │    Đăng nhập thành công       │
              └───────────────►───────────────┘
                                              │
                              ┌───────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Logout Flow                             │
│  - Bấm nút "Đăng xuất" trong drawer                         │
│  - Gọi logout() → set isLoggedIn = false                    │
│  - router.replace('/(auth)/login')                          │
│  - Quay về màn hình login                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Theme & Design

### Màu sắc chính
| Màu | Hex | Sử dụng |
|-----|-----|---------|
| Primary | `#e94560` | Buttons, highlights, accents |
| Secondary | `#ff6b6b` | Gradients |
| Background Dark | `#1a1a2e` | Main background |
| Background Medium | `#16213e` | Cards, containers |
| Background Light | `#0f3460` | Sections |
| Text Primary | `#ffffff` | Tiêu đề, text chính |
| Text Secondary | `#9ca3af` | Mô tả, placeholder |
| Success | `#22c55e` | Online indicator |
| Danger | `#dc2626` | Logout, delete |

### Gradient được sử dụng
- **Background**: `['#1a1a2e', '#16213e', '#0f3460']`
- **Primary Button/Avatar**: `['#e94560', '#ff6b6b']`
- **Danger Button**: `['#dc2626', '#ef4444']`

---

## 🚀 Bắt đầu

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Chạy app

```bash
npx expo start
```

### 3. Mở app trên thiết bị
- **Android**: Quét QR code bằng Expo Go
- **iOS**: Quét QR code bằng Camera hoặc Expo Go
- **Web**: Nhấn `w` trong terminal

---

## 📦 Dependencies chính

| Package | Mô tả |
|---------|-------|
| `expo` | Framework Expo |
| `expo-router` | File-based routing |
| `@react-navigation/drawer` | Drawer navigation |
| `react-native-gesture-handler` | Gesture handling |
| `react-native-reanimated` | Animations |
| `expo-linear-gradient` | Gradient components |

---

## 🔒 Authentication

Hiện tại sử dụng **fake authentication**:
- Chấp nhận bất kỳ email/password nào (không rỗng)
- State được lưu trong memory (mất khi reload app)

### Để tích hợp API thật:
1. Sửa function `login()` trong `contexts/AuthContext.tsx`
2. Thêm API call và xử lý response
3. Có thể thêm AsyncStorage để persist login state

---

## 📝 Ghi chú

- App sử dụng **Expo Router v3** với file-based routing
- Theme mặc định là **Dark mode**
- Drawer có thể mở bằng **hamburger icon** hoặc **vuốt từ trái**
- Tất cả screens đã có giao diện gradient đẹp mắt

---

## 📚 Tài liệu tham khảo

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [React Navigation Drawer](https://reactnavigation.org/docs/drawer-navigator/)
