export const GS1_GROUP_SEPARATOR = String.fromCharCode(29)
export const GS1_VISIBLE_GROUP_SEPARATOR = '[GS]'

function ensureString(value) {
  return String(value ?? '')
}

export function gs1RawToVisible(rawValue, token = GS1_VISIBLE_GROUP_SEPARATOR) {
  return ensureString(rawValue).split(GS1_GROUP_SEPARATOR).join(token)
}

export function gs1VisibleToRaw(displayValue, token = GS1_VISIBLE_GROUP_SEPARATOR) {
  return ensureString(displayValue).split(token).join(GS1_GROUP_SEPARATOR)
}

