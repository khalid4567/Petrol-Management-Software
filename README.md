# Petrol Pump Management System

A comprehensive static front-end web application for managing petrol pump operations, built with Vue 3, TypeScript, Composition API, Tailwind CSS, and Vite.

## Features

### Pages & Functionality

- **Login Page** - User authentication interface (UI only, no backend)
- **Dashboard** - Overview with sales stats, active pumps, alerts, and charts
- **Pump Management** - Real-time pump status monitoring with status cards
- **Fuel Sale (POS)** - Point of sale for fuel transactions with cart and receipt preview
- **Retail Store POS** - Product management with cart and checkout
- **Shift Management** - Start/close shift with opening/closing cash tracking
- **Inventory** - Fuel tank levels and product stock management
- **Deliveries** - Track incoming fuel deliveries
- **Reports** - Sales reports with filters and export functionality
- **Settings** - Company info, fuel pricing, and user management

### UI Components

- **Reusable Components**: Button, Card, Table, Modal, Input, Select, Badge, Toast
- **Layout Components**: Sidebar navigation with icons, Header with user dropdown
- **Charts**: Sales overview and fuel distribution charts using Chart.js
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Professional Theme**: Consistent spacing, shadows, rounded corners

### State Management

- **Pinia Stores**: Organized state management with mock data
  - Auth store (user authentication)
  - Pumps store (pump status and data)
  - Inventory store (fuel tanks and products)
  - Sales store (fuel and retail transactions)
  - Toast store (notification system)

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe development
- **Vite** - Next-generation build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Pinia** - State management
- **Vue Router** - Client-side routing
- **Chart.js + Vue-ChartJS** - Data visualization
- **Lucide Vue** - Icon library

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone or download the project**

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Start development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open in browser**
   
   Navigate to `http://localhost:5173`

### Build for Production

\`\`\`bash
npm run build
\`\`\`

The built files will be in the `dist` directory.

### Preview Production Build

\`\`\`bash
npm run preview
\`\`\`

## Project Structure

\`\`\`
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.vue
│   │   └── Header.vue
│   └── ui/
│       ├── Button.vue
│       ├── Card.vue
│       ├── Table.vue
│       ├── Modal.vue
│       ├── Input.vue
│       ├── Select.vue
│       ├── Badge.vue
│       └── Toast.vue
├── layouts/
│   └── MainLayout.vue
├── pages/
│   ├── LoginPage.vue
│   ├── DashboardPage.vue
│   ├── PumpManagementPage.vue
│   ├── FuelSalePage.vue
│   ├── RetailStorePage.vue
│   ├── ShiftManagementPage.vue
│   ├── InventoryPage.vue
│   ├── DeliveriesPage.vue
│   ├── ReportsPage.vue
│   └── SettingsPage.vue
├── stores/
│   ├── auth.ts
│   ├── pumps.ts
│   ├── inventory.ts
│   ├── sales.ts
│   └── toast.ts
├── router/
│   └── index.ts
├── App.vue
├── main.ts
└── style.css
\`\`\`

## Usage Guide

### Login
- Default credentials shown on login page (no actual authentication)
- Click "Sign In" to access the dashboard

### Dashboard
- View key metrics: total sales, active pumps, alerts, transactions
- Charts show sales trends and fuel type distribution
- Recent transactions table shows latest activity

### Pump Management
- Monitor all pump statuses (Idle, Dispensing, Fault, Maintenance)
- View current transactions and daily sales per pump
- Access pump configuration and logs

### Fuel Sale (POS)
- Select pump and fuel type
- Enter litres or amount (auto-calculates the other)
- Add multiple items to cart
- Complete sale and view receipt preview

### Retail Store POS
- Browse products with search functionality
- Click products to add to cart
- Adjust quantities in cart
- Checkout with automatic tax calculation

### Shift Management
- Start shift with opening cash and attendant details
- Monitor shift activity and sales
- Close shift with cash reconciliation

### Inventory
- View fuel tank levels with visual indicators
- Monitor product stock levels
- Low stock warnings with badges
- Search and filter products

### Deliveries
- Track incoming fuel deliveries
- View delivery status (Delivered, Scheduled, Pending)
- Delivery details including quantity and cost

### Reports
- Filter sales by date range, pump, and fuel type
- View detailed transaction reports
- Export functionality (UI only)
- Summary statistics with period comparisons

### Settings
- Update company information
- Manage fuel pricing per type
- User management with roles and status

## Customization

### Colors
Edit `tailwind.config.js` to modify the primary color scheme.

### Mock Data
Update stores in `src/stores/` to modify dummy data.

### Add New Pages
1. Create page component in `src/pages/`
2. Add route in `src/router/index.ts`
3. Add menu item in `src/components/layout/Sidebar.vue`

## Notes

- This is a **static front-end only** - no backend or real authentication
- All data is mock/dummy data stored in Pinia stores
- No data persistence - refresh will reset all data
- Designed for demonstration and UI/UX purposes

## License

MIT License - feel free to use for any purpose.
