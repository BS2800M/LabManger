<template>
  <el-select-v2
    v-model="innerValue"
    filterable
    :options="lotOptions"
    :placeholder="placeholder"
    :disabled="disabled || !reagentId"
    :clearable="clearable"
    v-bind="$attrs"
    @change="handleChange"
  />
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { api_lot_showall } from '@/api/lot'

const props = defineProps({
  modelValue: {
    type: [Number, String],
    default: null,
  },
  reagentId: {
    type: [Number, String],
    default: null,
  },
  placeholder: {
    type: String,
    default: '选择批号',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  autoSelectFirst: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:modelValue', 'change', 'selected-change', 'options-loaded'])

const lotOptions = ref([])
const optionsLoaded = ref(false)

const innerValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  },
})

function emitSelectedByValue(value) {
  if (!optionsLoaded.value) return
  const selected = lotOptions.value.find((item) => item.value === value) ?? null
  emit('selected-change', selected)
}

function emitValueChange(value) {
  emit('update:modelValue', value)
  emit('change', value)
  emitSelectedByValue(value)
}

function handleChange(value) {
  emit('change', value)
  emitSelectedByValue(value)
}

async function loadOptionsByReagent(reagentId) {
  optionsLoaded.value = false
  if (!reagentId) {
    optionsLoaded.value = true
    lotOptions.value = []
    emit('options-loaded', lotOptions.value)
    if (props.modelValue != null) emitValueChange(null)
    else emitSelectedByValue(null)
    return
  }

  const data = await api_lot_showall(reagentId)
  const rows = Array.isArray(data?.data) ? data.data : []
  optionsLoaded.value = true
  lotOptions.value = rows.map((item) => ({
    label: item.name,
    value: item.id,
    name: item.name,
  }))
  emit('options-loaded', lotOptions.value)

  if (lotOptions.value.length === 0) {
    if (props.modelValue != null) emitValueChange(null)
    else emitSelectedByValue(null)
    return
  }

  const hasCurrent = lotOptions.value.some((item) => item.value === props.modelValue)
  if (hasCurrent) {
    emitSelectedByValue(props.modelValue)
    return
  }

  if (props.autoSelectFirst) {
    emitValueChange(lotOptions.value[0].value)
    return
  }

  if (props.modelValue != null) emitValueChange(null)
  else emitSelectedByValue(null)
}

watch(
  () => props.reagentId,
  async (reagentId) => {
    await loadOptionsByReagent(reagentId)
  },
  { immediate: true }
)

watch(
  () => props.modelValue,
  (value) => {
    emitSelectedByValue(value)
  }
)
</script>
