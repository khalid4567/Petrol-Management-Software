import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router"
import MainLayout from "@/layouts/MainLayout.vue"
import LoginPage from "@/pages/LoginPage.vue"
import DashboardPage from "@/pages/DashboardPage.vue"
import PumpManagementPage from "@/pages/PumpManagementPage.vue"
import FuelSalePage from "@/pages/FuelSalePage.vue"
import RetailStorePage from "@/pages/RetailStorePage.vue"
import ShiftManagementPage from "@/pages/ShiftManagementPage.vue"
import InventoryPage from "@/pages/InventoryPage.vue"
import DeliveriesPage from "@/pages/DeliveriesPage.vue"
import ReportsPage from "@/pages/ReportsPage.vue"
import SettingsPage from "@/pages/SettingsPage.vue"
import SalesManagementPage from "@/pages/SalesManagementPage.vue"
import CustomerManagementPage from "@/pages/CustomerManagementPage.vue"
import CustomerDetailPage from '@/pages/CustomerDetailPage.vue'
import EmployeeManagementPage from "@/pages/EmployeeManagementPage.vue"
import ShiftSchedulePage from "@/pages/ShiftSchedulePage.vue"
import EmployeeDetailPage from "@/pages/EmployeeDetailPage.vue"

const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
  },
  {
    path: "/",
    component: MainLayout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: DashboardPage,
      },
      {
        path: "pumps",
        name: "PumpManagement",
        component: PumpManagementPage,
      },
      {
        path: "fuel-sale",
        name: "FuelSale",
        component: FuelSalePage,
      },
      {
        path: "retail-store",
        name: "RetailStore",
        component: RetailStorePage,
      },
      {
        path: "shift",
        name: "ShiftManagement",
        component: ShiftManagementPage,
      },
      {
        path: "shift-schedule",
        name: "ShiftSchedule",
        component: ShiftSchedulePage,
      },
      {
        path: "inventory",
        name: "Inventory",
        component: InventoryPage,
      },
      {
        path: "deliveries",
        name: "Deliveries",
        component: DeliveriesPage,
      },
      {
        path: "reports",
        name: "Reports",
        component: ReportsPage,
      },
      {
        path: "settings",
        name: "Settings",
        component: SettingsPage,
      },
      {
        path: "sales-management",
        name: "SalesManagement",
        component: SalesManagementPage,
      },
      {
        path: "customers",
        name: "CustomerManagement",
        component: CustomerManagementPage,
      },
      {
        path: "customers/:id",
        name: "CustomerDetail",
        component: CustomerDetailPage,
      },
      {
        path: "employees",
        name: "EmployeeManagement",
        component: EmployeeManagementPage,
      },
      {
        path: "employees/:id",
        name: "EmployeeDetail",
        component: EmployeeDetailPage,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
