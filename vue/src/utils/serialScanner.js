const DEFAULT_LINE_DELIMITERS = ['\r\n', '\n', '\r']
const SERIAL_PORT_PREFERENCE_KEY = 'labmanager.serial.port.preference.v1'
let serialTransition = Promise.resolve()

function noop() {}

function enqueueSerialTransition(task) {
  const next = serialTransition.then(task, task)
  serialTransition = next.catch(() => {})
  return next
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function getErrorMessage(error) {
  return String(error?.message ?? error ?? '')
}

function isPortAlreadyOpenError(error) {
  return getErrorMessage(error).toLowerCase().includes('already open')
}

function isRetryableOpenError(error) {
  const message = getErrorMessage(error).toLowerCase()
  // 不同浏览器/驱动对“端口暂时不可用”文案不一致，这里统一按可重试处理。
  return (
    message.includes('failed to open serial port') ||
    message.includes('failed to open') ||
    message.includes('networkerror') ||
    message.includes('resource busy') ||
    message.includes('device busy')
  )
}

function isReadableLockedError(error) {
  const message = getErrorMessage(error).toLowerCase()
  return message.includes('locked') || message.includes('reader')
}

async function openPortWithRetry(
  port,
  openOptions,
  retries = 12,
  delayMs = 120,
) {
  let lastError = null
  for (let i = 0; i < retries; i++) {
    if (port?.readable) return true
    try {
      await port.open(openOptions)
      return true
    } catch (error) {
      lastError = error
      if (isPortAlreadyOpenError(error)) return true
      if (!isRetryableOpenError(error)) throw error
      await sleep(delayMs)
    }
  }
  if (lastError) {
    throw new Error(`串口打开失败: ${getErrorMessage(lastError)}`)
  }
  throw new Error('串口打开失败')
}

async function getReaderWithRetry(port, retries = 120, delayMs = 30) {
  let lastError = null
  for (let i = 0; i < retries; i++) {
    if (!port?.readable) {
      await sleep(delayMs)
      continue
    }
    try {
      return port.readable.getReader()
    } catch (error) {
      lastError = error
      if (!isReadableLockedError(error)) throw error
      await sleep(delayMs)
    }
  }
  if (lastError) {
    throw new Error(`串口读取器初始化失败: ${getErrorMessage(lastError)}`)
  }
  throw new Error('串口读取器初始化失败')
}

function getSafeLocalStorage() {
  if (typeof window === 'undefined') return null
  return window.localStorage ?? null
}

function normalizePortInfo(info) {
  return {
    usbVendorId: typeof info?.usbVendorId === 'number' ? info.usbVendorId : null,
    usbProductId: typeof info?.usbProductId === 'number' ? info.usbProductId : null,
  }
}

/**
 * 当前浏览器是否支持 Web Serial。
 * Web Serial 仅在 HTTPS 或 localhost 环境可用。
 */
export function isSerialSupported() {
  return typeof navigator !== 'undefined' && !!navigator.serial
}

/**
 * 保存串口偏好到 localStorage（用于跨页面自动恢复）。
 * 仅保存 vendorId/productId，不保存敏感数据。
 */
export function saveSerialPortPreference(port) {
  const storage = getSafeLocalStorage()
  if (!storage || !port?.getInfo) return
  const payload = normalizePortInfo(port.getInfo())
  storage.setItem(SERIAL_PORT_PREFERENCE_KEY, JSON.stringify(payload))
}

function loadSerialPortPreference() {
  const storage = getSafeLocalStorage()
  if (!storage) return null
  const raw = storage.getItem(SERIAL_PORT_PREFERENCE_KEY)
  if (!raw) return null
  try {
    return normalizePortInfo(JSON.parse(raw))
  } catch {
    return null
  }
}

/**
 * 清空保存的串口偏好。
 */
export function clearSerialPortPreference() {
  const storage = getSafeLocalStorage()
  if (!storage) return
  storage.removeItem(SERIAL_PORT_PREFERENCE_KEY)
}

/**
 * 从浏览器已授权串口列表中，按 localStorage 偏好匹配设备。
 * 注意：该方法不会弹设备选择框。
 */
export async function getPreferredSerialPort() {
  if (!isSerialSupported()) return null
  const preference = loadSerialPortPreference()
  if (!preference) return null

  const grantedPorts = await navigator.serial.getPorts()
  if (grantedPorts.length === 0) return null

  return grantedPorts.find((port) => {
    const info = normalizePortInfo(port.getInfo?.())
    return info.usbVendorId === preference.usbVendorId && info.usbProductId === preference.usbProductId
  }) ?? null
}

/**
 * 弹出浏览器串口选择框，请在用户手势（点击）里调用。
 * @param {Object} [options]
 * @param {Array<{usbVendorId?: number, usbProductId?: number}>} [options.filters]
 * @returns {Promise<SerialPort>}
 */
export async function requestSerialPort(options = {}) {
  if (!isSerialSupported()) {
    throw new Error('当前浏览器不支持 Web Serial API')
  }

  const filters = Array.isArray(options.filters) ? options.filters : []
  return navigator.serial.requestPort({ filters })
}

/**
 * 监听扫码枪串口数据（串口模式）。
 * 支持 CR/LF 分隔，也支持“静默超时自动收包”。
 *
 * @param {Object} options
 * @param {SerialPort} options.port 已选择的串口对象
 * @param {(scanText: string, meta: {raw: string, time: number}) => void} [options.onScan]
 * @param {(error: unknown) => void} [options.onError]
 * @param {number} [options.baudRate=9600]
 * @param {number} [options.dataBits=8]
 * @param {1|2} [options.stopBits=1]
 * @param {'none'|'even'|'odd'} [options.parity='none']
 * @param {'none'|'hardware'} [options.flowControl='none']
 * @param {number} [options.bufferSize=255]
 * @param {string} [options.encoding='utf-8']
 * @param {string[]} [options.lineDelimiters=['\\r\\n','\\n','\\r']]
 * @param {number} [options.idleFlushMs=40]
 * @param {number} [options.maxBufferLength=4096]
 * @param {boolean} [options.closePortOnStop=false]
 * @returns {Promise<{stop: () => Promise<void>}>}
 */
export async function startSerialScanner(options) {
  const {
    port,
    onScan = noop,
    onError = noop,
    baudRate = 9600,
    dataBits = 8,
    stopBits = 1,
    parity = 'none',
    flowControl = 'none',
    bufferSize = 255,
    encoding = 'utf-8',
    lineDelimiters = DEFAULT_LINE_DELIMITERS,
    idleFlushMs = 40,
    maxBufferLength = 4096,
    closePortOnStop = false,
  } = options ?? {}
  const openOptions = { baudRate, dataBits, stopBits, parity, flowControl, bufferSize }

  if (!port) throw new Error('缺少串口对象：请先调用 requestSerialPort()')
  if (!isSerialSupported()) throw new Error('当前浏览器不支持 Web Serial API')

  let reader = null
  // 串口 open/close/read-lock 操作串行化，避免路由切换时的并发竞态。
  await enqueueSerialTransition(async () => {
    if (!port.readable) {
      await openPortWithRetry(port, openOptions)
    }
    reader = await getReaderWithRetry(port)
  })

  if (!reader) throw new Error('串口读取器初始化失败')

  // 分隔符按长度降序，优先匹配长分隔（例如 \r\n 优先于 \n）。
  const delimiters = (Array.isArray(lineDelimiters) && lineDelimiters.length > 0 ? lineDelimiters : DEFAULT_LINE_DELIMITERS)
    .slice()
    .sort((a, b) => b.length - a.length)
  const decoder = new TextDecoder(encoding)

  let stopped = false
  let idleTimer = null
  let buffer = ''

  // 清理静默超时定时器。
  function clearIdleTimer() {
    if (!idleTimer) return
    clearTimeout(idleTimer)
    idleTimer = null
  }

  // 输出一条扫描结果：统一 trim，过滤空串，并附带时间戳元信息。
  function emitScan(raw) {
    const text = String(raw ?? '').trim()
    if (!text) return
    onScan(text, { raw: text, time: Date.now() })
  }

  // 将当前缓冲区当作一整条扫描结果输出（用于静默超时或收尾）。
  function flushBuffer() {
    if (!buffer) return
    emitScan(buffer)
    buffer = ''
  }

  // 每次有“未分割残留数据”时，重置静默计时；超时就强制出包。
  function scheduleIdleFlush() {
    clearIdleTimer()
    idleTimer = setTimeout(() => {
      flushBuffer()
    }, idleFlushMs)
  }

  // 依据分隔符反复拆包：一次可以从 buffer 中切出多条扫码数据。
  function trySplitByDelimiters() {
    let hasDelimiter = true
    while (hasDelimiter) {
      hasDelimiter = false
      let delimiterIndex = -1
      let delimiterMatched = ''
      // 找到当前 buffer 中“最早出现”的分隔符位置。
      for (const delimiter of delimiters) {
        const idx = buffer.indexOf(delimiter)
        if (idx === -1) continue
        if (delimiterIndex === -1 || idx < delimiterIndex) {
          delimiterIndex = idx
          delimiterMatched = delimiter
        }
      }
      // 没找到分隔符，说明当前数据还不完整，等待后续 chunk。
      if (delimiterIndex === -1) break
      // 取出一条完整扫描结果，并从缓冲区中消费掉已处理部分。
      const oneScan = buffer.slice(0, delimiterIndex)
      buffer = buffer.slice(delimiterIndex + delimiterMatched.length)
      emitScan(oneScan)
      hasDelimiter = true
    }
  }

  // 后台读取循环：持续读取串口字节流 -> 解码 -> 拼接缓冲 -> 拆包。
  async function readLoop() {
    try {
      while (!stopped) {
        const { value, done } = await reader.read()
        if (done) break
        if (!value) continue

        // stream=true 保留 decoder 内部状态，处理多字节字符更安全。
        const chunk = decoder.decode(value, { stream: true })
        if (!chunk) continue

        buffer += chunk
        // 防止异常情况下缓冲无限增长。
        if (buffer.length > maxBufferLength) {
          buffer = buffer.slice(buffer.length - maxBufferLength)
        }

        trySplitByDelimiters()
        // 仍有残留时启动静默超时；无残留则取消定时器。
        if (buffer) scheduleIdleFlush()
        else clearIdleTimer()
      }
    } catch (error) {
      if (!stopped) onError(error)
    } finally {
      // 退出前做收尾，避免最后一段数据丢失。
      clearIdleTimer()
      flushBuffer()
    }
  }

  // 启动异步读取（不阻塞调用方）。
  readLoop()

  return {
    async stop() {
      if (stopped) return
      stopped = true
      clearIdleTimer()
      await enqueueSerialTransition(async () => {
        // 取消 reader.read() 阻塞并释放锁。
        try {
          await reader.cancel()
        } catch {}
        try {
          reader.releaseLock()
        } catch {}
        // 按需关闭底层串口。
        if (closePortOnStop && port.readable) {
          try {
            await port.close()
          } catch {}
        }
      })
    },
  }
}
