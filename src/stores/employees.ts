import { defineStore } from "pinia"
import { ref } from "vue"

export interface Employee {
  id: string
  name: string
  employeeId: string
  email: string
  contactNumber: string
  role: "Manager" | "Supervisor" | "Attendant" | "Cashier"
  department: string
  shift: "Morning" | "Afternoon" | "Night" | "Flexible"
  status: "Active" | "Inactive" | "On Leave"
  joinDate: string
  monthlySalary: number
  bankAccount?: string
  emergencyContact?: string
  address?: string
  createdAt: string
}

export interface Expense {
  id: string
  employeeId: string
  employeeName: string
  date: string
  category: "Food" | "Transport" | "Medical" | "Uniform" | "Other"
  amount: number
  description: string
  status: "Pending" | "Approved" | "Rejected" | "Paid"
  approvedBy?: string
  createdAt: string
}

export interface Payment {
  id: string
  employeeId: string
  employeeName: string
  date: string
  type: "Salary" | "Bonus" | "Expense Reimbursement" | "Advance"
  amount: number
  month?: string
  description?: string
  paymentMethod: "Cash" | "Bank Transfer" | "Cheque"
  referenceNumber?: string
  status: "Pending" | "Completed" | "Failed"
  createdAt: string
}

export const useEmployeesStore = defineStore("employees", () => {
  const employees = ref<Employee[]>([
    {
      id: "1",
      name: "John Doe",
      employeeId: "EMP001",
      email: "john.doe@petrolpump.com",
      contactNumber: "+91 9876543210",
      role: "Manager",
      department: "Operations",
      shift: "Morning",
      status: "Active",
      joinDate: "2023-01-15",
      monthlySalary: 45000,
      bankAccount: "HDFC Bank - 12345678901234",
      emergencyContact: "+91 9876543200",
      address: "123 Main Street, Mumbai, Maharashtra",
      createdAt: "2023-01-15T10:00:00",
    },
    {
      id: "2",
      name: "Jane Smith",
      employeeId: "EMP002",
      email: "jane.smith@petrolpump.com",
      contactNumber: "+91 9876543211",
      role: "Supervisor",
      department: "Fuel Sales",
      shift: "Afternoon",
      status: "Active",
      joinDate: "2023-02-20",
      monthlySalary: 35000,
      bankAccount: "ICICI Bank - 98765432109876",
      emergencyContact: "+91 9876543201",
      address: "456 Park Avenue, Mumbai, Maharashtra",
      createdAt: "2023-02-20T10:00:00",
    },
    {
      id: "3",
      name: "Mike Johnson",
      employeeId: "EMP003",
      email: "mike.johnson@petrolpump.com",
      contactNumber: "+91 9876543212",
      role: "Attendant",
      department: "Fuel Sales",
      shift: "Morning",
      status: "Active",
      joinDate: "2023-03-10",
      monthlySalary: 22000,
      bankAccount: "SBI - 11223344556677",
      emergencyContact: "+91 9876543202",
      address: "789 Lake Road, Mumbai, Maharashtra",
      createdAt: "2023-03-10T10:00:00",
    },
    {
      id: "4",
      name: "Sarah Williams",
      employeeId: "EMP004",
      email: "sarah.williams@petrolpump.com",
      contactNumber: "+91 9876543213",
      role: "Attendant",
      department: "Fuel Sales",
      shift: "Night",
      status: "Active",
      joinDate: "2023-04-05",
      monthlySalary: 22000,
      bankAccount: "Axis Bank - 55667788990011",
      emergencyContact: "+91 9876543203",
      address: "321 Garden Street, Mumbai, Maharashtra",
      createdAt: "2023-04-05T10:00:00",
    },
    {
      id: "5",
      name: "David Brown",
      employeeId: "EMP005",
      email: "david.brown@petrolpump.com",
      contactNumber: "+91 9876543214",
      role: "Cashier",
      department: "Retail Store",
      shift: "Afternoon",
      status: "On Leave",
      joinDate: "2023-05-12",
      monthlySalary: 25000,
      bankAccount: "PNB - 99887766554433",
      emergencyContact: "+91 9876543204",
      address: "654 Hill View, Mumbai, Maharashtra",
      createdAt: "2023-05-12T10:00:00",
    },
  ])

  const expenses = ref<Expense[]>([
    {
      id: "1",
      employeeId: "1",
      employeeName: "John Doe",
      date: "2024-12-01",
      category: "Transport",
      amount: 500,
      description: "Fuel for company errands",
      status: "Paid",
      approvedBy: "Admin",
      createdAt: "2024-12-01T10:00:00",
    },
    {
      id: "2",
      employeeId: "3",
      employeeName: "Mike Johnson",
      date: "2024-12-02",
      category: "Uniform",
      amount: 1200,
      description: "New uniform purchase",
      status: "Approved",
      approvedBy: "John Doe",
      createdAt: "2024-12-02T11:00:00",
    },
  ])

  const payments = ref<Payment[]>([
    {
      id: "1",
      employeeId: "1",
      employeeName: "John Doe",
      date: "2024-11-30",
      type: "Salary",
      amount: 45000,
      month: "November 2024",
      paymentMethod: "Bank Transfer",
      referenceNumber: "TXN123456789",
      status: "Completed",
      createdAt: "2024-11-30T10:00:00",
    },
    {
      id: "2",
      employeeId: "1",
      employeeName: "John Doe",
      date: "2024-12-01",
      type: "Expense Reimbursement",
      amount: 500,
      description: "Transport expense reimbursement",
      paymentMethod: "Cash",
      status: "Completed",
      createdAt: "2024-12-01T15:00:00",
    },
    {
      id: "3",
      employeeId: "3",
      employeeName: "Mike Johnson",
      date: "2024-11-30",
      type: "Salary",
      amount: 22000,
      month: "November 2024",
      paymentMethod: "Bank Transfer",
      referenceNumber: "TXN123456790",
      status: "Completed",
      createdAt: "2024-11-30T10:00:00",
    },
  ])

  function addEmployee(employee: Omit<Employee, "id" | "createdAt">) {
    const newEmployee: Employee = {
      ...employee,
      id: String(employees.value.length + 1),
      createdAt: new Date().toISOString(),
    }
    employees.value.unshift(newEmployee)
    return newEmployee
  }

  function updateEmployee(id: string, updatedEmployee: Partial<Employee>) {
    const index = employees.value.findIndex((e) => e.id === id)
    if (index !== -1) {
      employees.value[index] = {
        ...employees.value[index],
        ...updatedEmployee,
      }
      return employees.value[index]
    }
    return null
  }

  function deleteEmployee(id: string) {
    const index = employees.value.findIndex((e) => e.id === id)
    if (index !== -1) {
      employees.value.splice(index, 1)
      return true
    }
    return false
  }

  function getEmployeeById(id: string) {
    return employees.value.find((e) => e.id === id)
  }

  function getActiveEmployees() {
    return employees.value.filter((e) => e.status === "Active")
  }

  function getEmployeesByShift(shift: string) {
    return employees.value.filter((e) => e.shift === shift && e.status === "Active")
  }

  function addExpense(expense: Omit<Expense, "id" | "createdAt">) {
    const newExpense: Expense = {
      ...expense,
      id: String(expenses.value.length + 1),
      createdAt: new Date().toISOString(),
    }
    expenses.value.unshift(newExpense)
    return newExpense
  }

  function updateExpense(id: string, updatedExpense: Partial<Expense>) {
    const index = expenses.value.findIndex((e) => e.id === id)
    if (index !== -1) {
      expenses.value[index] = {
        ...expenses.value[index],
        ...updatedExpense,
      }
      return expenses.value[index]
    }
    return null
  }

  function deleteExpense(id: string) {
    const index = expenses.value.findIndex((e) => e.id === id)
    if (index !== -1) {
      expenses.value.splice(index, 1)
      return true
    }
    return false
  }

  function getExpensesByEmployee(employeeId: string) {
    return expenses.value.filter((e) => e.employeeId === employeeId)
  }

  function addPayment(payment: Omit<Payment, "id" | "createdAt">) {
    const newPayment: Payment = {
      ...payment,
      id: String(payments.value.length + 1),
      createdAt: new Date().toISOString(),
    }
    payments.value.unshift(newPayment)
    return newPayment
  }

  function updatePayment(id: string, updatedPayment: Partial<Payment>) {
    const index = payments.value.findIndex((p) => p.id === id)
    if (index !== -1) {
      payments.value[index] = {
        ...payments.value[index],
        ...updatedPayment,
      }
      return payments.value[index]
    }
    return null
  }

  function deletePayment(id: string) {
    const index = payments.value.findIndex((p) => p.id === id)
    if (index !== -1) {
      payments.value.splice(index, 1)
      return true
    }
    return false
  }

  function getPaymentsByEmployee(employeeId: string) {
    return payments.value.filter((p) => p.employeeId === employeeId)
  }

  return {
    employees,
    expenses,
    payments,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeById,
    getActiveEmployees,
    getEmployeesByShift,
    addExpense,
    updateExpense,
    deleteExpense,
    getExpensesByEmployee,
    addPayment,
    updatePayment,
    deletePayment,
    getPaymentsByEmployee,
  }
})
