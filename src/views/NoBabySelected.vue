<template>
  <div class="container mx-auto mt-10 text-center">
    <h2 class="text-2xl font-bold">No Baby Selected</h2>
    <label for="babies" class="block text-sm font-medium leading-6 text-gray-900"
      >Select a baby:</label
    >
    <div class="mt-4">
      <select
        id="babies"
        name="babies"
        v-model="selectedBabyId"
        @change="onBabySelected"
        class="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
      >
        <option disabled value="">Select a baby</option>
        <option v-for="baby in babies" :key="baby.id" :value="baby.id">{{ baby.name }}</option>
      </select>
    </div>
  </div>

  <div></div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBabyStore } from '@/stores/babyStore'

const router = useRouter()
const babyStore = useBabyStore()

const selectedBabyId = ref('')

// Fetch babies from the store's state
const babies = computed(() => babyStore.babies)

const onBabySelected = () => {
  const selectedBaby = babies.value.find((baby) => baby.id === selectedBabyId.value)
  if (selectedBaby) {
    babyStore.selectBaby(selectedBaby)
    router.push('/baby/:id/dashboard'.replace(':id', selectedBaby.id))
  }
}

onMounted(async () => {
  await babyStore.fetchBabies()
})
</script>
