import dayjs from 'dayjs'
import 'dayjs/locale/es'

import duration from 'dayjs/plugin/duration'

export const useTime = () => {
  dayjs.extend(duration)
  dayjs.locale('es')
  const formatTime = (time: string, format: string) => dayjs(time).format(format)

  return {
    formatTime
  }
}
