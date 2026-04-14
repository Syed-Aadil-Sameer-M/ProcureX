# 🌐 ProcureX Frontend

[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4.4.5-646CFF)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green)](https://nodejs.org/)
[![NPM](https://img.shields.io/badge/NPM-8+-red)](https://www.npmjs.com/)

This is the frontend application for the **ProcureX** procurement management system, built with **React** and **Vite**.

---

## 📋 Getting Started

### Prerequisites
- 🟢 Node.js 16+
- 📦 npm

### Running the Application
1. Navigate to the frontend directory
2. Run `npm install`
3. Run `npm run dev`

The application will start on **http://localhost:5173**.

---

## 🏗️ Project Structure

The frontend follows a **component-based architecture** with the following structure:

```
Frontend/
├── public/
│   └── index.html                 # HTML template
├── src/
│   ├── assets/                    # Static assets (images, styles)
│   ├── pages/                     # Page-level components
│   │   ├── Login.jsx              # Authentication page
│   │   ├── Dashboard.jsx          # Main dashboard
│   │   ├── Requests.jsx           # Procurement requests
│   │   ├── Inventory.jsx          # Inventory management
│   │   └── Logs.jsx               # System logs
│   ├── components/                # Reusable UI components
│   │   ├── Navbar.jsx             # Navigation bar
│   │   ├── Sidebar.jsx            # Side navigation
│   │   ├── Table.jsx              # Data table component
│   │   └── Notification.jsx       # Alert notifications
│   ├── services/                  # API communication
│   │   ├── api.js                 # Axios configuration
│   │   ├── authService.js         # Authentication API
│   │   └── requestService.js      # Request management API
│   ├── context/                   # React Context providers
│   │   └── AuthContext.jsx        # Authentication state
│   ├── hooks/                     # Custom React hooks
│   ├── utils/                     # Utility functions
│   ├── App.jsx                    # Main application component
│   └── main.jsx                   # Application entry point
├── .env                           # Environment variables
├── package.json                   # NPM configuration
├── vite.config.js                 # Vite configuration
└── README.md                      # This file
```

### 📦 Key Directories

- **`public/`**: Static assets served directly
- **`src/pages/`**: Page components (routes)
- **`src/components/`**: Reusable UI components
- **`src/services/`**: API services and HTTP clients
- **`src/context/`**: React context providers for state management
- **`src/hooks/`**: Custom hooks for shared logic
- **`src/utils/`**: Helper functions and utilities

---

## ⚙️ Configuration

### Environment Variables (`.env`)
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### Package.json Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Dependencies
- ⚛️ **React 18.2.0**: UI framework with hooks
- 🚀 **Vite 4.4.5**: Fast build tool and dev server
- 🌐 **Axios 1.4.0**: HTTP client for API calls
- 🔧 **ESLint**: Code linting and quality

---

## 🚀 Development

### Installation
```bash
cd Frontend
npm install
```

### Development Server
```bash
npm run dev
```
Opens at `http://localhost:5173`

### Production Build
```bash
npm run build
npm run preview
```

---

## 🔗 API Integration

The frontend communicates with the backend via REST APIs:

- **Base URL**: Configured in `.env`
- **Authentication**: JWT-based login/logout
- **Services**: Centralized in `src/services/`
- **HTTP Client**: Axios with interceptors

---

## 🧩 Components

### Pages
- **Login**: User authentication
- **Dashboard**: Overview and statistics
- **Requests**: Procurement request management
- **Inventory**: Stock and inventory tracking
- **Logs**: System activity logs

### Reusable Components
- **Navbar**: Top navigation
- **Sidebar**: Side menu
- **Table**: Data display tables
- **Notification**: Toast messages

---

## 🎨 Styling

- **CSS Modules**: Scoped styling (recommended)
- **Global Styles**: In `src/assets/`
- **Component Styles**: Colocated with components

---

## 🧪 Testing

Run tests with:
```bash
npm test
```

*Note: Testing setup can be added with Jest and React Testing Library*

---

## 🤝 Contributing

1. Follow the component structure
2. Use functional components with hooks
3. Add TypeScript types (future migration)
4. Follow ESLint rules
5. Update this README for structural changes

---

*Built with ❤️ using React & Vite for ProcureX*
