<template>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900"></h3>
        <div>
          <Button @click="openAdd" variant="secondary" size="sm">
            Add Category
          </Button>
        </div>
      </div>
    

    <div class="p-4">
  <div class="space-y-3">

    <div
      v-for="c in inventoryStore.categories"
      :key="c.id"
      class="group flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary-300 transition-all"
    >
      <!-- Category Name -->
      <div class="text-sm font-medium text-gray-800">
        {{ c.name }}
      </div>

      <!-- Buttons -->
      <div class="flex items-center gap-3 opacity-80 group-hover:opacity-100 transition">
        <button
          @click="startEdit(c)"
          class="text-gray-600 hover:text-primary-600 font-medium text-sm"
        >
          Edit
        </button>

        <div class="w-px h-4 bg-gray-300"></div>

        <button
          @click="confirmDelete(c.id, c.name)"
          class="text-red-600 hover:text-red-700 font-medium text-sm"
        >
          Delete
        </button>
      </div>
    </div>

  </div>
</div>

  

  <Modal v-model="showCategoryModal" :title=" editing ? 'Edit Category' : 'Add Category' " size="sm">
    <div class="p-2">
      <label class="block text-sm font-medium text-gray-700 mb-1">Category name</label>
      <Input v-model="form.name" placeholder="e.g. Oil" />
    </div>
    <template #footer>
      <div class="flex items-center justify-end gap-2">
        <Button @click="showCategoryModal = false" variant="ghost">Cancel</Button>
        <Button @click="save" variant="secondary">{{ editing ? 'Update' : 'Add' }}</Button>
      </div>
    </template>
  </Modal>

  <ConfirmationAlert
    v-model="showConfirm"
    :title="confirmTitle"
    :message="confirmMessage"
    confirmText="Delete"
    cancelText="Cancel"
    @confirm="onDeleteConfirmed"
  />
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'
import { useInventoryStore } from '@/stores/inventory'
import { useToastStore } from '@/stores/toast'
import Modal from '@/components/ui/Modal.vue'
import ConfirmationAlert from '@/components/ui/ConfirmationAlert.vue'

const inventoryStore = useInventoryStore()
const toastStore = useToastStore()

const form = reactive({ id: '', name: '' })
const editing = ref(false)
const showCategoryModal = ref(false)
const showConfirm = ref(false)
const pendingDeleteId = ref('')
const confirmTitle = ref('')
const confirmMessage = ref('')

function reset() {
  editing.value = false
  form.id = ''
  form.name = ''
}

function startEdit(c: any) {
  editing.value = true
  form.id = c.id
  form.name = c.name
  showCategoryModal.value = true
}

function save() {
  if (!form.name || !form.name.trim()) {
    toastStore.error('Category name required')
    return
  }
  if (editing.value && form.id) {
    inventoryStore.updateCategory(form.id, form.name.trim())
    toastStore.success('Category updated')
  } else {
    inventoryStore.addCategory(form.name.trim())
    toastStore.success('Category added')
  }
  reset()
  showCategoryModal.value = false
}

function deleteCategory(id: string) {
  inventoryStore.deleteCategory(id)
  toastStore.info('Category removed')
}

function openAdd() {
  editing.value = false
  form.id = ''
  form.name = ''
  showCategoryModal.value = true
}

function confirmDelete(id: string, name: string) {
  pendingDeleteId.value = id
  confirmTitle.value = 'Delete category'
  confirmMessage.value = `Delete category "${name}"? This will remove the category from any products.`
  showConfirm.value = true
}

function onDeleteConfirmed() {
  if (pendingDeleteId.value) {
    inventoryStore.deleteCategory(pendingDeleteId.value)
    toastStore.info('Category removed')
    pendingDeleteId.value = ''
  }
}

// nothing extra to expose; template can access `inventoryStore` directly
</script>
