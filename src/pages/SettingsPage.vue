<template>
  <div class="space-y-6">
    <Card title="Company Information">
      <form class="space-y-4">
        <Input
          v-model="companyInfo.name"
          label="Company Name"
          placeholder="Enter company name"
        />
        
        <Input
          v-model="companyInfo.address"
          label="Address"
          placeholder="Enter address"
        />
        
        <div class="grid grid-cols-2 gap-4">
          <Input
            v-model="companyInfo.phone"
            label="Phone"
            placeholder="Enter phone number"
          />
          
          <Input
            v-model="companyInfo.email"
            type="email"
            label="Email"
            placeholder="Enter email"
          />
        </div>
        
        <Button type="submit" variant="primary">
          Save Changes
        </Button>
      </form>
    </Card>
    
    <Card title="Fuel Pricing">
      <div class="space-y-4">
        <div v-for="(price, fuelType) in fuelPrices" :key="fuelType" class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p class="font-medium text-gray-900">{{ fuelType }}</p>
            <p class="text-sm text-gray-600">Price per litre</p>
          </div>
          <div class="flex items-center gap-3">
            <Input
              v-model="fuelPrices[fuelType]"
              type="number"
              step="0.01"
              class="w-32"
            />
            <Button size="sm" variant="primary">Update</Button>
          </div>
        </div>
      </div>
    </Card>
    
    <Card title="User Management">
      <div class="space-y-4">
        <div class="flex justify-end">
          <Button variant="primary">
            <Plus class="w-4 h-4" />
            Add User
          </Button>
        </div>
        
        <Table :columns="userColumns">
          <tr v-for="user in users" :key="user.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <Badge :variant="user.role === 'Admin' ? 'info' : 'default'">
                {{ user.role }}
              </Badge>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <Badge :variant="user.status === 'Active' ? 'success' : 'danger'">
                {{ user.status }}
              </Badge>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <button class="text-primary-600 hover:text-primary-700 mr-3">Edit</button>
              <button class="text-red-600 hover:text-red-700">Delete</button>
            </td>
          </tr>
        </Table>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Card from '@/components/ui/Card.vue'
import Table from '@/components/ui/Table.vue'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import { Plus } from 'lucide-vue-next'

const companyInfo = ref({
  name: 'FuelFlow Station',
  address: '123 Main Street, City, State 12345',
  phone: '+1 234 567 8900',
  email: 'info@fuelflow.com'
})

const fuelPrices = ref({
  'Petrol 95': '1.45',
  'Petrol 98': '1.65',
  'Diesel': '1.35',
  'Diesel Premium': '1.55'
})

const userColumns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions' }
]

const users = ref([
  { id: '1', name: 'John Doe', email: 'john@petrolpump.com', role: 'Admin', status: 'Active' },
  { id: '2', name: 'Jane Smith', email: 'jane@petrolpump.com', role: 'Manager', status: 'Active' },
  { id: '3', name: 'Mike Johnson', email: 'mike@petrolpump.com', role: 'Attendant', status: 'Active' },
  { id: '4', name: 'Sarah Williams', email: 'sarah@petrolpump.com', role: 'Attendant', status: 'Inactive' }
])
</script>
