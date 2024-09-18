import dayjs from "dayjs"
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export const timestampToDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return dayjs(date).utc().format('DD.MM.YYYY')
  }