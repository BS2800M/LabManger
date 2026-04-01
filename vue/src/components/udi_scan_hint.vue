<template>
  <el-popover
    placement="bottom-start"
    trigger="hover"
    :width="popoverWidth"
    popper-class="udi-hint-popper"
  >
    <template #reference>
      <span class="udi-hint-trigger">{{ triggerText }}</span>
    </template>
    <div class="udi-hint-content">
      <svg
        class="scan-hint-icon datamatrix-hint-icon"
        viewBox="0 0 300 132"
        role="img"
        aria-label="Scan DataMatrix code with UDI fields"
      >
        <rect x="1" y="1" width="298" height="130" rx="10" fill="none" stroke="currentColor" stroke-opacity="0.22" />
        <path d="M10 26H290M10 116H290" stroke="currentColor" stroke-opacity="0.2" stroke-width="1.2" />

        <g transform="translate(12 36)">
          <rect x="0" y="0" width="56" height="56" fill="none" stroke="currentColor" stroke-opacity="0.75" stroke-width="1.2" />
          <g fill="currentColor">
            <rect x="0" y="0" width="4" height="56" />
            <rect x="0" y="52" width="56" height="4" />

            <rect x="4" y="0" width="4" height="4" />
            <rect x="12" y="0" width="4" height="4" />
            <rect x="20" y="0" width="4" height="4" />
            <rect x="28" y="0" width="4" height="4" />
            <rect x="36" y="0" width="4" height="4" />
            <rect x="44" y="0" width="4" height="4" />

            <rect x="48" y="4" width="4" height="4" />
            <rect x="48" y="12" width="4" height="4" />
            <rect x="48" y="20" width="4" height="4" />
            <rect x="48" y="28" width="4" height="4" />
            <rect x="48" y="36" width="4" height="4" />
            <rect x="48" y="44" width="4" height="4" />
            <rect x="48" y="52" width="4" height="4" />

            <rect x="6" y="6" width="4" height="4" />
            <rect x="14" y="6" width="4" height="4" />
            <rect x="22" y="6" width="4" height="4" />
            <rect x="30" y="6" width="4" height="4" />
            <rect x="38" y="6" width="4" height="4" />

            <rect x="10" y="12" width="4" height="4" />
            <rect x="18" y="12" width="4" height="4" />
            <rect x="26" y="12" width="4" height="4" />
            <rect x="34" y="12" width="4" height="4" />
            <rect x="42" y="12" width="4" height="4" />

            <rect x="6" y="18" width="4" height="4" />
            <rect x="14" y="18" width="4" height="4" />
            <rect x="22" y="18" width="4" height="4" />
            <rect x="38" y="18" width="4" height="4" />

            <rect x="10" y="24" width="4" height="4" />
            <rect x="18" y="24" width="4" height="4" />
            <rect x="30" y="24" width="4" height="4" />
            <rect x="42" y="24" width="4" height="4" />

            <rect x="6" y="30" width="4" height="4" />
            <rect x="14" y="30" width="4" height="4" />
            <rect x="26" y="30" width="4" height="4" />
            <rect x="34" y="30" width="4" height="4" />
            <rect x="42" y="30" width="4" height="4" />

            <rect x="10" y="36" width="4" height="4" />
            <rect x="22" y="36" width="4" height="4" />
            <rect x="30" y="36" width="4" height="4" />
            <rect x="38" y="36" width="4" height="4" />

            <rect x="6" y="42" width="4" height="4" />
            <rect x="18" y="42" width="4" height="4" />
            <rect x="26" y="42" width="4" height="4" />
            <rect x="34" y="42" width="4" height="4" />
            <rect x="42" y="42" width="4" height="4" />
          </g>
        </g>

        <g fill="currentColor" font-family="Consolas, 'Courier New', monospace">
          <text x="82" y="46" font-size="9">(01)06974323017530</text>
          <text x="82" y="58" font-size="9">(10)C20250917</text>
          <text x="82" y="70" font-size="9">(11)250801</text>
          <text x="82" y="82" font-size="9">(17)270801</text>
          <text x="82" y="94" font-size="9">(21)A6000012209</text>
        </g>

        <g fill="currentColor" font-size="8.8" font-family="'Microsoft YaHei', 'PingFang SC', sans-serif">
          <text x="192" y="46">货号: G2P1-025</text>
          <text x="192" y="58">批号: C20250917</text>
          <text x="192" y="70">生产日期: 20250801</text>
          <text x="192" y="82">有效期: 20270801</text>
        </g>

        <text
          x="12"
          y="17"
          fill="currentColor"
          fill-opacity="0.68"
          font-size="8"
          font-family="'Microsoft YaHei', 'PingFang SC', sans-serif"
        >
          UDI DataMatrix 示例
        </text>
      </svg>
      <div class="udi-hint-text">{{ hintText }}</div>
    </div>
  </el-popover>
</template>

<script setup>
defineProps({
  triggerText: {
    type: String,
    default: 'UDI 条码?',
  },
  hintText: {
    type: String,
    default: '请扫描包装上的 DataMatrix（UDI）条码',
  },
  popoverWidth: {
    type: Number,
    default: 390,
  },
})
</script>

<style scoped>
.scan-hint-icon {
  width: 268px;
  flex-shrink: 0;
}

.datamatrix-hint-icon {
  display: block;
  height: auto;
  color: currentColor;
}

.udi-hint-trigger {
  color: var(--el-color-primary);
  font-size: 14px;
  font-weight: 700;
  cursor: help;
  user-select: none;
}

.udi-hint-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  color: var(--el-text-color-primary);
}

.udi-hint-text {
  font-size: 13px;
  line-height: 1.35;
}
</style>
