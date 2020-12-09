interface CheckCondition {
  format?: string[];
  size?: number;
}
// type ErrorType = 'size' | 'format' | null
export function beforeUploadCheck(file: File, condition: CheckCondition) {
  const { format, size } = condition
  const isValidFormat = format ? format.includes(file.type) : true
  const isValidSize = size ? (file.size / 1024 / 1024 < size) : true
  const error = []
  if (!isValidFormat) {
    error.push('format')
  }
  if (!isValidSize) {
    error.push('size')
  }
  console.log(error)
  return {
    passed: isValidFormat && isValidSize,
    error
  }
}
