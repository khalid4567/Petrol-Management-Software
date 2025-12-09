<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Pump Status</h2>
        <p class="text-gray-600">Monitor and manage all fuel pumps</p>
      </div>
      <Button variant="primary">
        <RefreshCw class="w-4 h-4" />
        Refresh Status
      </Button>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card v-for="pump in pumps" :key="pump.id" :hover="true">
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ pump.number }}</h3>
              <p class="text-sm text-gray-600">{{ pump.fuelType }}</p>
            </div>
            <Badge :variant="getStatusVariant(pump.status)">
              {{ pump.status }}
            </Badge>
          </div>
          
          <div v-if="pump.currentTransaction" class="bg-gray-50 rounded-lg p-3 space-y-1">
            <p class="text-sm font-medium text-gray-900">Active Transaction</p>
            <p class="text-xs text-gray-600">Litres: {{ pump.currentTransaction.litres }}L</p>
            <p class="text-xs text-gray-600">Amount: ${{ pump.currentTransaction.amount.toFixed(2) }}</p>
          </div>
          
          <div class="border-t pt-3">
            <p class="text-sm text-gray-600">Today's Sales</p>
            <p class="text-xl font-bold text-gray-900">${{ pump.totalSalesToday.toFixed(2) }}</p>
          </div>
          
          <div class="flex gap-2">
            <Button size="sm" variant="secondary" full-width>
              <Settings class="w-4 h-4" />
              Configure
            </Button>
            <Button size="sm" variant="ghost" full-width>
              <Activity class="w-4 h-4" />
              Logs
            </Button>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePumpsStore } from '@/stores/pumps'
import Card from '@/components/ui/Card.vue'
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'
import { RefreshCw, Settings, Activity } from 'lucide-vue-next'

const pumpsStore = usePumpsStore()
const pumps = computed(() => pumpsStore.pumps)

function getStatusVariant(status: string) {
  const variants: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
    'Idle': 'success',
    'Dispensing': 'info',
    'Fault': 'danger',
    'Maintenance': 'warning'
  }
  return variants[status] || 'default'
}
</script>
