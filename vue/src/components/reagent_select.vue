<template>
  <el-select-v2
    v-model="innerValue"
    filterable
    :options="reagentOptions"
    :placeholder="placeholder"
    :disabled="disabled"
    :clearable="clearable"
    v-bind="$attrs"
    @change="handleChange"
  />
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { api_reagent_showall } from '@/api/reagent'

const props = defineProps({
  modelValue: {
    type: [Number, String],
    default: null,
  },
  refreshTrigger: {
    type: [Number, String],
    default: 0,
  },
  placeholder: {
    type: String,
    default: '选择试剂',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'change', 'selected-change', 'options-loaded'])

const reagentOptions = ref([])
const optionsLoaded = ref(false)

const innerValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  },
})

function emitSelectedByValue(value) {
  if (!optionsLoaded.value) return
  const selected = reagentOptions.value.find((item) => item.value === value) ?? null
  emit('selected-change', selected)
}

function handleChange(value) {
  emit('change', value)
  emitSelectedByValue(value)
}

async function loadOptions() {
  optionsLoaded.value = false
  const data = await api_reagent_showall()
  const rows = Array.isArray(data?.data) ? data.data : []
  reagentOptions.value = rows.map((item) => ({
    label: item.name,
    value: item.id,
    name: item.name,
  }))
  optionsLoaded.value = true
  emit('options-loaded', reagentOptions.value)
  emitSelectedByValue(props.modelValue)
}

watch(
  () => props.modelValue,
  (value) => {
    emitSelectedByValue(value)
  }
)

watch(
  () => props.refreshTrigger,
  async () => {
    await loadOptions()
  }
)

onMounted(async () => {
  await loadOptions()
})
</script>
