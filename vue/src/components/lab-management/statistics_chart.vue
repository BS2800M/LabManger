<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { VueUiXy } from "vue-data-ui";
import "vue-data-ui/style.css"; // 如果您使用多个组件，请将此样式导入放在您的主文件中

// 接收从父组件传入的数据
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      dataset: null,
      xAxisLabels: null,
      title: "示例"
    })
  }
});

// 先定义计算属性
const dataset = computed(() => {
  // 添加安全的空值检查
  if (!props.modelValue || !props.modelValue.dataset) {
    return [
      {
        name: '库存',
        series: [0],
        color: '#42d392',  // 使用官方示例的颜色
        type: 'line',
        shape: 'circle',
        useArea: false,  // 官方示例中是false
        useProgression: false,
        dataLabels: true,
        smooth: false,  // 官方示例中是false
        dashed: false,
        useTag: 'none'
      }
    ];
  }
  return props.modelValue.dataset;
});

// 添加安全的 xAxisLabels 计算属性
const xAxisLabels = computed(() => {
  if (!props.modelValue || !props.modelValue.xAxisLabels) {
    return [0,0,0,0,0];
  }
  return props.modelValue.xAxisLabels;
});


const title = computed(() => {
  if (!props.modelValue || !props.modelValue.title) {
    return '试剂统计';
  }
  return props.modelValue.title;
});

// 然后定义 config 对象
const config = ref({
        theme: '',
        responsive: false,
        responsiveProportionalSizing: false,
        customPalette: [],
        useCssAnimation: true,
        downsample: {
            threshold: 500
        },
        chart: {
            fontFamily: 'inherit',
            backgroundColor: 'var(--el-bg-color-overlay)',
            color: 'var(--el-text-color-primary)',
            height: '520',
            width: '1080',
            annotations: [
                {
                    show: false,
                    yAxis: {
                        yTop: null,
                        yBottom: null,
                        label: {
                            text: '',
                            textAnchor: 'start',
                            position: 'start',
                            offsetX: 0,
                            offsetY: 0,
                            padding: {
                                top: 5,
                                right: 10,
                                bottom: 5,
                                left: 10
                            },
                            border: {
                                stroke: '#FFFFFF',
                                strokeWidth: 1,
                                rx: 0,
                                ry: 0
                            },
                            fontSize: 20,
                            color: '#2D353C',
                            backgroundColor: '#e1e5e8'
                        },
                        line: {
                            stroke: '#2D353C',
                            strokeWidth: 1,
                            strokeDasharray: 0
                        },
                        area: {
                            fill: '#e1e5e8',
                            opacity: 30
                        }
                    }
                }
            ],
            zoom: {
                show: true,
                color: '#CCCCCCff',
                highlightColor: 'rgba(255, 255, 255, 1)',
                fontSize: 14,
                useResetSlot: false,
                startIndex: null,
                endIndex: null,
                enableRangeHandles: true,
                enableSelectionDrag: false,
                minimap: {
                    show: false,
                    smooth: true,
                    selectedColor: '#1F77B4',
                    selectedColorOpacity: 0.5,
                    lineColor: 'rgba(255, 255, 255, 1)',
                    selectionRadius: 2,
                    indicatorColor: 'rgba(255, 255, 255, 1)',
                    verticalHandles: false
                }
            },
            padding: {
                top: 45,
                right: 0,
                bottom: 80,
                left: 70
            },
            highlighter: {
                color: 'var(--el-text-color-primary)',
                opacity: 5,
                useLine: false,
                lineDasharray: 2,
                lineWidth: 1
            },
            highlightArea: {
                show: false,
                from: 0,
                to: 0,
                color: '#CCCCCCff',
                opacity: 16,
                caption: {
                    text: 'Caption',
                    fontSize: 20,
                    color: '#ffffffff',
                    bold: false,
                    offsetY: 0,
                    width: 'auto',
                    padding: 3,
                    textAlign: 'center'
                }
            },
            timeTag: {
                show: false,
                backgroundColor: '#e1e5e8ff',
                color: '#ffffffff',
                fontSize: 20,
                circleMarker: {
                    radius: 3,
                    color: '#ffffffff'
                }
            },
            grid: {
                stroke: 'var(--el-border-color-light)',
                showVerticalLines: false,
                showHorizontalLines: false,
                position: 'middle',
                frame: {
                    show: false,
                    stroke: '#000000ff',
                    strokeWidth: 2,
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',
                    strokeDasharray: 0
                },
                labels: {
                    show: true,
                    color: 'var(--el-text-color-primary)',
                    fontSize: 10,
                    axis: {
                        yLabel: '库存',
                        yLabelOffsetX: 0,
                        xLabel: '时间',
                        xLabelOffsetY: 14,
                        fontSize: 10,
                        xLabelFontSize: 10,
                        yLabelFontSize: 10
                    },
                    zeroLine: {
                        show: true  // 恢复官方默认设置
                    },
                    xAxis: {
                        showBaseline: true,
                        showCrosshairs: true,
                        crosshairsAlwaysAtZero: false,
                        crosshairSize: 6
                    },
                    yAxis: {
                        position: 'left',
                        showBaseline: true,
                        showCrosshairs: true,
                        crosshairSize: 6,
                        commonScaleSteps: 10,
                        useIndividualScale: false,
                        useNiceScale: true,
                        stacked: false,
                        gap: 12,
                        labelWidth: 40,
                        formatter: null,
                        scaleMin: null,
                        scaleMax: null,
                        groupColor: 'var(--el-text-color-primary)',
                        scaleLabelOffsetX: 0,
                        scaleValueOffsetX: 0,
                        rounding: 1,
                        serieNameFormatter: null
                    },
                    xAxisLabels: {
                        color: 'var(--el-text-color-primary)',
                        show: true,
                        values: xAxisLabels,
                        datetimeFormatter: {
                            enable: true,
                            locale: 'zh-CN',
                            useUTC: false,
                            januaryAsYear: false,
                            options: {
                            year: 'yyyy年',
                            month: 'yy年/MM',
                            day: 'MM/dd',
                            hour: 'dd HH',
                            minute: 'HH:mm',
                            second: 'HH:mm:ss'
                            }
                        },
                        fontSize: 10,
                        showOnlyFirstAndLast: false,
                        showOnlyAtModulo: false,
                        modulo: 12,
                        yOffset: 13,
                        rotation: '-360'
                    }
                }
            },
            comments: {
                show: true,
                showInTooltip: true,
                width: 200,
                offsetX: 0,
                offsetY: 0
            },
            labels: {
                fontSize: 12,
                prefix: '',
                suffix: ''
            },
            legend: {
                color: 'var(--el-text-color-primary)',
                show: true,
                fontSize: 13
            },
            title: {
                text: title,
                color: 'var(--el-text-color-primary)',
                fontSize: 16,
                bold: true,
                textAlign: 'center',
                paddingLeft: 0,
                paddingRight: 0,
                subtitle: {
                    color: '#CCCCCCff',
                    text: '',
                    fontSize: 16,
                    bold: false
                },
                show: true
            },
            tooltip: {
                show: true,
                color: 'var(--el-text-color-primary)',
                backgroundColor: 'var(--el-bg-color-overlay)',
                fontSize: 14,
                customFormat: null,
                borderRadius: 4,
                borderColor: 'var(--el-border-color)',
                borderWidth: 1,
                backgroundOpacity: 30,
                position: 'center',
                offsetY: 24,
                showTimeLabel: true,
                showValue: true,
                showPercentage: false,
                roundingValue: 0,
                roundingPercentage: 0
            },
            userOptions: {
                show: true,
                showOnChartHover: false,
                keepStateOnChartLeave: true,
                position: 'right',
                buttons: {
                    tooltip: false,
                    pdf: true,
                    csv: true,
                    img: true,
                    table: false,
                    labels: false,
                    fullscreen: true,
                    sort: false,
                    stack: true,
                    animation: false,
                    annotator: true
                },
                callbacks: {
                    animation: null,
                    annotator: null,
                    csv: null,
                    fullscreen: null,
                    img: null,
                    labels: null,
                    pdf: null,
                    sort: null,
                    stack: null,
                    table: null,
                    tooltip: null
                },
                buttonTitles: {
                    open: 'Open options',
                    close: 'Close options',
                    tooltip: 'Toggle tooltip',
                    pdf: '保存为PDF',
                    csv: '保存为表格',
                    img: '保存为图片',
                    table: 'Toggle table',
                    labels: 'Toggle labels',
                    fullscreen: '全屏显示',
                    stack: 'Toggle stack mode',
                    annotator: '工具'
                },
                print: {
                    allowTaint: false,
                    backgroundColor: 'var(--el-bg-color-overlay)',
                    useCORS: false,
                    onclone: null,
                    scale: 2,
                    logging: false
                }
            }
        },
        bar: {
            borderRadius: 2,
            useGradient: true,
            periodGap: 0.1,
            border: {
                useSerieColor: false,
                strokeWidth: 1,
                stroke: '#FFFFFFff'
            },
            labels: {
                show: true,
                offsetY: -8,
                rounding: 0,
                color: 'var(--el-text-color-primary)',
                formatter: null
            },
            serieName: {
                show: false,
                offsetY: -6,
                useAbbreviation: true,
                abbreviationSize: 3,
                useSerieColor: true,
                color: '#1A1A1Aff',
                bold: false
            }
        },
        line: {
            radius: 4,
            useGradient: false,
            strokeWidth: 5,  // 默认值，会被具体系列的 strokeWidth 覆盖
            cutNullValues: false,
            dot: {
                hideAboveMaxSerieLength: 62,
                useSerieColor: true,  // 使用系列颜色
                fill: '#FFFFFF',
                strokeWidth: 1
            },
            labels: {
                show: true,
                offsetY: -10,
                rounding: 0,
                color: 'var(--el-text-color-primary)',
                formatter: null
            },
            area: {
                useGradient: true,
                opacity: 20
            },
            tag: {
                followValue: true,
                formatter: null,
                fontSize: 20
            }
        },
        plot: {
            radius: 6,
            useGradient: true,
            dot: {
                useSerieColor: true,
                fill: 'rgba(255, 255, 255, 1)',
                strokeWidth: 0.5
            },
            labels: {
                show: true,
                offsetY: -8,
                rounding: 0,
                color: 'var(--el-text-color-primary)',
                formatter: null
            },
            tag: {
                followValue: true,
                formatter: null,
                fontSize: 14
            }
        },
        table: {
            responsiveBreakpoint: 400,
            rounding: 0,
            sparkline: true,
            showSum: true,
            columnNames: {
                period: 'Period',
                total: 'Total'
            },
            th: {
                backgroundColor: 'var(--el-bg-color-overlay)',
                color: 'var(--el-text-color-primary)',
                outline: ''
            },
            td: {
                backgroundColor: 'var(--el-bg-color-overlay)',
                color: 'var(--el-text-color-primary)',
                outline: ''
            }
        },
        showTable: false
    });

let themeObserver = null

function applyThemeColors() {
  const rootStyle = getComputedStyle(document.documentElement)
  const textColor = rootStyle.getPropertyValue('--el-text-color-primary').trim() || '#374151'
  const bgOverlay = rootStyle.getPropertyValue('--el-bg-color-overlay').trim() || '#f5f5f5'
  const borderColor = rootStyle.getPropertyValue('--el-border-color').trim() || '#d1d5db'
  const borderColorLight = rootStyle.getPropertyValue('--el-border-color-light').trim() || '#e5e7eb'

  config.value.chart.color = textColor
  config.value.chart.backgroundColor = bgOverlay
  config.value.chart.highlighter.color = textColor
  config.value.chart.grid.stroke = borderColorLight
  config.value.chart.grid.labels.color = textColor
  config.value.chart.grid.labels.yAxis.groupColor = textColor
  config.value.chart.grid.labels.xAxisLabels.color = textColor
  config.value.chart.legend.color = textColor
  config.value.chart.title.color = textColor
  config.value.chart.tooltip.color = textColor
  config.value.chart.tooltip.backgroundColor = bgOverlay
  config.value.chart.tooltip.borderColor = borderColor
  config.value.chart.userOptions.print.backgroundColor = bgOverlay
  config.value.bar.labels.color = textColor
  config.value.line.labels.color = textColor
  config.value.plot.labels.color = textColor
  config.value.table.th.color = textColor
  config.value.table.td.color = textColor
  config.value.table.th.backgroundColor = bgOverlay
  config.value.table.td.backgroundColor = bgOverlay
}

onMounted(() => {
  applyThemeColors()
  themeObserver = new MutationObserver(() => {
    applyThemeColors()
  })
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })
})

watch(
  () => props.modelValue,
  () => {
    applyThemeColors()
  },
  { deep: true }
)

onBeforeUnmount(() => {
  if (themeObserver) {
    themeObserver.disconnect()
    themeObserver = null
  }
})
</script>
<template>
    <div class="chart-wrapper">
      <div class="chart-fixed">
          <VueUiXy
              :config="config"
              :dataset="dataset"
          />
      </div>
    </div>
</template>
<style scoped>
.chart-wrapper {
  width: 100%;
  min-height: 560px;
  padding: 12px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  background-color: var(--el-bg-color-overlay);
  box-sizing: border-box;
  overflow-x: auto;
  overflow-y: hidden;
}

.chart-fixed {
  width: 1080px;
  min-width: 1080px;
  height: 520px;
}
</style>
