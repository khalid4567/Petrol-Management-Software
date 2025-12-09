<template>
  <div class="grid grid-cols-1 lg:grid-cols-1 gap-6">
    <div class="lg:col-span-1 space-y-6">
      <Card>
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <button
                :class="['px-3 py-2 rounded-t-lg', activeTab === 'products' ? 'bg-white border-b-0 font-medium' : 'text-gray-600']"
                @click="activeTab = 'products'"
              >
                Products
              </button>
              <button
                :class="['px-3 py-2 rounded-t-lg', activeTab === 'categories' ? 'bg-white border-b-0 font-medium' : 'text-gray-600']"
                @click="activeTab = 'categories'"
              >
                Categories
              </button>
            </div>

            <div>
             
            </div>
          </div>
        </template>

        <div v-if="activeTab === 'products'">
          <div class="mb-4 flex justify-between items-center gap-20">
            <Input
              v-model="searchQuery" class="w-[300px]"
              placeholder="Search products..."
              :icon="Search"
            />
             <Button v-if="activeTab === 'products'" @click.stop="openAddProductModal" variant="secondary" size="sm">
                <Plus class="w-4 h-4 mr-2" />
                Add Product
              </Button>
          </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
  <div
    v-for="product in filteredProducts"
    :key="product.id"
    class="group relative bg-white border border-gray-100 rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all cursor-pointer overflow-hidden"
    @click="addToCart(product)"
  >

    <!-- Top Highlight Bar -->
    <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-primary-600 opacity-70"></div>

    <!-- Floating Buttons -->
    <div class="absolute top-3 right-3 flex items-center gap-2 z-10 opacity-0 group-hover:opacity-100 transition-all">
      <button
        @click.stop="openEditProductModal(product)"
        class="p-2 rounded-xl bg-white shadow hover:bg-gray-50 transition"
      >
        <Edit class="w-4 h-4 text-gray-700" />
      </button>
      <button
        @click.stop="removeProduct(product.id)"
        class="p-2 rounded-xl bg-white shadow hover:bg-gray-50 transition"
      >
        <Trash2 class="w-4 h-4 text-red-600" />
      </button>
    </div>

    <!-- Content -->
    <div class="flex flex-col gap-4">

      <!-- Name + Category -->
      <div>
        <h4 class="font-semibold text-gray-900 text-lg leading-snug line-clamp-1">
          {{ product.name }}
        </h4>
        <p class="text-xs text-gray-500 mt-0.5">
          {{ categoriesMap[product.category] || 'Uncategorized' }}
        </p>
      </div>

      <!-- Stock -->
      <div class="flex items-center justify-between">
        <span
          class="text-xs font-medium px-3 py-1 rounded-full"
          :class="product.stock < product.reorderLevel 
                  ? 'bg-red-100 text-red-700' 
                  : product.stock < product.reorderLevel * 1.5
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-green-100 text-green-700'"
        >
          Stock: {{ product.stock }}
        </span>
      </div>

      <!-- Price -->
      <p class="text-2xl font-bold text-primary-600 tracking-tight">
        ${{ product.price.toFixed(2) }}
      </p>
    </div>
  </div>
</div>


        </div>

        <div v-else>
          <CategoryManager />
        </div>
      </Card>
    </div>
    
    
  </div>
  
  <Modal v-model="showProductModal" title="Manage Product" size="md">
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Product name</label>
        <Input v-model="productForm.name" placeholder="e.g. Engine Oil 5W-30" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <Select
          v-model="productForm.category"
          :options="categoryOptions()"
          placeholder="Select category"
        />
      </div>

      <div class="grid grid-cols-3 gap-2">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Stock</label>
          <Input v-model.number="productForm.stock" placeholder="0" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Price</label>
          <Input v-model.number="productForm.price" placeholder="0.00" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Reorder level</label>
          <Input v-model.number="productForm.reorderLevel" placeholder="0" />
        </div>
      </div>
    </div>
    <template #footer>
      <div class="flex items-center justify-end gap-2">
        <Button @click="showProductModal = false" variant="ghost">Cancel</Button>
        <Button @click="saveProduct" variant="primary">Save</Button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useInventoryStore } from '@/stores/inventory'
import { useSalesStore } from '@/stores/sales'
import { useToastStore } from '@/stores/toast'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'
import Select from '@/components/ui/Select.vue'
import CategoryManager from '@/components/CategoryManager.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import Modal from '@/components/ui/Modal.vue'
import { Search, Plus, Minus, Trash2, CreditCard } from 'lucide-vue-next'
import { Edit } from 'lucide-vue-next'

const inventoryStore = useInventoryStore()
const salesStore = useSalesStore()
const toastStore = useToastStore()

const searchQuery = ref('')
const cart = ref<any[]>([])
const showProductModal = ref(false)
const isEditing = ref(false)
const productForm = reactive({ id: '', name: '', category: '', stock: 0, price: 0, reorderLevel: 0 })
const activeTab = ref<'products' | 'categories'>('products')

const categoriesMap = computed(() => {
  const map: Record<string, string> = {}
  inventoryStore.categories.forEach((c: any) => (map[c.id] = c.name))
  return map
})

const filteredProducts = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return inventoryStore.products
  return inventoryStore.products.filter(p => {
    const catName = categoriesMap.value[p.category] || ''
    return (
      p.name.toLowerCase().includes(q) ||
      catName.toLowerCase().includes(q)
    )
  })
})

const subtotal = computed(() => 
  cart.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
)

const tax = computed(() => subtotal.value * 0.1)
const total = computed(() => subtotal.value + tax.value)

function addToCart(product: any) {
  const existing = cart.value.find(item => item.productId === product.id)
  if (existing) {
    existing.quantity++
  } else {
    cart.value.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    })
  }
  toastStore.success(`${product.name} added to cart`)
}

function categoryOptions() {
  return inventoryStore.categories.map((c: any) => ({ label: c.name, value: c.id }))
}

function increaseQuantity(productId: string) {
  const item = cart.value.find(i => i.productId === productId)
  if (item) item.quantity++
}

function decreaseQuantity(productId: string) {
  const item = cart.value.find(i => i.productId === productId)
  if (item && item.quantity > 1) {
    item.quantity--
  }
}

function removeFromCart(productId: string) {
  cart.value = cart.value.filter(item => item.productId !== productId)
  toastStore.info('Item removed from cart')
}

function checkout() {
  // check stock availability
  for (const item of cart.value) {
    const p = inventoryStore.getProductById(item.productId)
    if (!p) {
      toastStore.error(`Product ${item.name} not found in inventory`)
      return
    }
    if (p.stock < item.quantity) {
      toastStore.error(`${item.name} has insufficient stock`)
      return
    }
  }

  // deduct stock
  for (const item of cart.value) {
    inventoryStore.adjustStock(item.productId, -item.quantity)
  }

  salesStore.addRetailSale({ items: cart.value, totalAmount: total.value })
  toastStore.success('Checkout completed successfully!')
  cart.value = []
}

function openAddProductModal() {
  isEditing.value = false
  productForm.id = ''
  productForm.name = ''
  productForm.category = ''
  productForm.stock = 0
  productForm.price = 0
  productForm.reorderLevel = 0
  showProductModal.value = true
}

function openEditProductModal(p: any) {
  isEditing.value = true
  productForm.id = p.id
  productForm.name = p.name
  productForm.category = p.category
  productForm.stock = p.stock
  productForm.price = p.price
  productForm.reorderLevel = p.reorderLevel
  showProductModal.value = true
}


function saveProduct() {
  if (!productForm.name || !productForm.category) {
    toastStore.error('Name and category are required')
    return
  }

  if (isEditing.value && productForm.id) {
    inventoryStore.updateProduct(productForm.id, {
      name: productForm.name,
      category: productForm.category,
      stock: productForm.stock,
      price: productForm.price,
      reorderLevel: productForm.reorderLevel,
    })
    toastStore.success('Product updated')
  } else {
    inventoryStore.addProduct({
      name: productForm.name,
      category: productForm.category,
      stock: productForm.stock,
      price: productForm.price,
      reorderLevel: productForm.reorderLevel,
    })
    toastStore.success('Product added')
  }

  showProductModal.value = false
}

function removeProduct(id: string) {
  inventoryStore.deleteProduct(id)
  toastStore.info('Product removed')
}
</script>
