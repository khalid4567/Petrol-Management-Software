<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <Card title="New Fuel Sale" class="lg:col-span-2">
      <form @submit.prevent="handleAddToCart" class="space-y-4">
        <Select
          v-model="saleForm.pumpId"
          label="Select Pump"
          :options="pumpOptions"
          placeholder="Choose a pump"
          required
        />
        
        <Select
          v-model="saleForm.fuelType"
          label="Fuel Type"
          :options="fuelTypeOptions"
          placeholder="Choose fuel type"
          required
        />
        
        <div class="grid grid-cols-2 gap-4">
          <Input
            v-model="saleForm.litres"
            type="number"
            label="Litres"
            placeholder="0.00"
            step="0.01"
            @input="calculateAmount"
          />
          
          <Input
            v-model="saleForm.amount"
            type="number"
            label="Amount ($)"
            placeholder="0.00"
            step="0.01"
            @input="calculateLitres"
          />
        </div>
        
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Price per Litre:</span>
            <span class="font-medium text-gray-900">${{ pricePerLitre.toFixed(2) }}</span>
          </div>
        </div>
        
        <Button type="submit" variant="primary" size="lg" full-width>
          <ShoppingCart class="w-5 h-5" />
          Add to Cart
        </Button>
      </form>
    </Card>
    
    <div class="space-y-6">
      <Card title="Cart">
        <div class="space-y-4">
          <div v-if="cart.length === 0" class="text-center py-8 text-gray-500">
            No items in cart
          </div>
          
          <div v-for="(item, index) in cart" :key="index" class="flex justify-between items-start border-b pb-3 last:border-b-0">
            <div class="flex-1">
              <p class="font-medium text-gray-900">{{ item.fuelType }}</p>
              <p class="text-sm text-gray-600">{{ item.pumpNumber }}</p>
              <p class="text-sm text-gray-600">{{ item.litres }}L × ${{ item.pricePerLitre }}</p>
            </div>
            <div class="text-right">
              <p class="font-medium text-gray-900">${{ item.totalAmount.toFixed(2) }}</p>
              <button @click="removeFromCart(index)" class="text-sm text-red-600 hover:text-red-700">
                Remove
              </button>
            </div>
          </div>
          
          <div v-if="cart.length > 0" class="border-t pt-4 space-y-3">
            <div class="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>${{ cartTotal.toFixed(2) }}</span>
            </div>
            
            <Button @click="showReceipt = true" variant="primary" size="lg" full-width>
              Complete Sale
            </Button>
          </div>
        </div>
      </Card>
    </div>
  </div>
  
  <Modal v-model="showReceipt" title="Receipt Preview" size="md">
    <div class="space-y-4">
      <div class="text-center border-b pb-4">
        <h3 class="font-bold text-xl">FuelFlow Station</h3>
        <p class="text-sm text-gray-600">123 Main Street</p>
        <p class="text-sm text-gray-600">{{ new Date().toLocaleString() }}</p>
      </div>
      
      <div class="space-y-2">
        <div v-for="(item, index) in cart" :key="index" class="flex justify-between text-sm">
          <span>{{ item.fuelType }} ({{ item.litres }}L)</span>
          <span>${{ item.totalAmount.toFixed(2) }}</span>
        </div>
      </div>
      
      <div class="border-t pt-4">
        <div class="flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span>${{ cartTotal.toFixed(2) }}</span>
        </div>
      </div>
    </div>
    
    <template #footer>
      <Button @click="completeSale" variant="primary">
        Print & Complete
      </Button>
      <Button @click="showReceipt = false" variant="secondary">
        Close
      </Button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePumpsStore } from '@/stores/pumps'
import { useSalesStore } from '@/stores/sales'
import { useToastStore } from '@/stores/toast'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'
import Select from '@/components/ui/Select.vue'
import Button from '@/components/ui/Button.vue'
import Modal from '@/components/ui/Modal.vue'
import { ShoppingCart } from 'lucide-vue-next'

const pumpsStore = usePumpsStore()
const salesStore = useSalesStore()
const toastStore = useToastStore()

const saleForm = ref({
  pumpId: '',
  fuelType: '',
  litres: '',
  amount: ''
})

const cart = ref<any[]>([])
const showReceipt = ref(false)

const fuelTypeOptions = [
  { label: 'Petrol 95', value: 'Petrol 95' },
  { label: 'Petrol 98', value: 'Petrol 98' },
  { label: 'Diesel', value: 'Diesel' },
  { label: 'Diesel Premium', value: 'Diesel Premium' }
]

const pumpOptions = computed(() => 
  pumpsStore.pumps
    .filter(p => p.status === 'Idle')
    .map(p => ({ label: `${p.number} - ${p.fuelType}`, value: p.id }))
)

const pricePerLitre = computed(() => {
  if (!saleForm.value.fuelType) return 0
  return salesStore.fuelPrices[saleForm.value.fuelType as keyof typeof salesStore.fuelPrices] || 0
})

const cartTotal = computed(() => 
  cart.value.reduce((sum, item) => sum + item.totalAmount, 0)
)

function calculateAmount() {
  const litres = parseFloat(saleForm.value.litres)
  if (!isNaN(litres) && pricePerLitre.value > 0) {
    saleForm.value.amount = (litres * pricePerLitre.value).toFixed(2)
  }
}

function calculateLitres() {
  const amount = parseFloat(saleForm.value.amount)
  if (!isNaN(amount) && pricePerLitre.value > 0) {
    saleForm.value.litres = (amount / pricePerLitre.value).toFixed(2)
  }
}

function handleAddToCart() {
  const pump = pumpsStore.pumps.find(p => p.id === saleForm.value.pumpId)
  if (!pump) return
  
  cart.value.push({
    pumpNumber: pump.number,
    fuelType: saleForm.value.fuelType,
    litres: parseFloat(saleForm.value.litres),
    pricePerLitre: pricePerLitre.value,
    totalAmount: parseFloat(saleForm.value.amount)
  })
  
  toastStore.success('Item added to cart')
  
  saleForm.value = {
    pumpId: '',
    fuelType: '',
    litres: '',
    amount: ''
  }
}

function removeFromCart(index: number) {
  cart.value.splice(index, 1)
  toastStore.info('Item removed from cart')
}

function completeSale() {
  cart.value.forEach(item => {
    salesStore.addFuelSale({
      pumpNumber: item.pumpNumber,
      fuelType: item.fuelType,
      litres: item.litres,
      pricePerLitre: item.pricePerLitre,
      totalAmount: item.totalAmount
    })
  })
  
  toastStore.success('Sale completed successfully!')
  cart.value = []
  showReceipt.value = false
}
</script>
