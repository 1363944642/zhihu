import { ColumnProps, ImageProps, UserProps } from './store'

export function generateFitUrl(data: ImageProps, width: number, height: number, format = ['m_pad']) {
  if (data && data.url) {
    const formatStr = format.reduce((prev, current) => {
      return current + ',' + prev
    }, '')
    data.url = data.url + `?x-oss-process=image/resize,${formatStr}h_${height},w_${width}`
  }
}

export function addColumnAvatar(data: ColumnProps | UserProps, width: number, height: number) {
  if (data.avatar) {
    generateFitUrl(data.avatar, width, height)
  } else {
    const parseCol = data as ColumnProps
    data.avatar = {
      url: require(parseCol.title ? '@/assets/column.jpg' : '@/assets/avatar.jpg')
    }
  }
}

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
  return {
    passed: isValidFormat && isValidSize,
    error
  }
}

interface TestProps {
  _id: string;
  name: string;
}
const testData = [{ _id: '1', name: 'a' }, { _id: '2', name: 'b' }]

export const arrToObj = <T>(arr: Array<T>) => {
  return { ...arr }
}
const result = arrToObj(testData)
console.log(result)

export const objToArr = <T>(obj: { [key: string]: T }) => {
  return Object.keys(obj).map(key => obj[key])
}

const testData2 = {
  1: { _id: '1', name: 'a' },
  2: { _id: '2', name: 'b' }
}

const aaa = objToArr(testData2)
console.log(aaa)
