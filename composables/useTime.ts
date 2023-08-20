import dayjs from 'dayjs'
import durationPlugin from 'dayjs/plugin/duration'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import 'dayjs/locale/es'

export const useTime = () => {
  dayjs.extend(durationPlugin)
  dayjs.extend(utc)
  dayjs.extend(timezone)
  dayjs.locale('es')
  const formatTime = (time: string, format: string) => dayjs(time).format(format)
  // @ts-ignore
  const duration = (milliseconds: Number) => {
    // @ts-ignore
    const d = dayjs.duration(milliseconds)
    return {
      days: d.days(),
      hours: d.hours(),
      minutes: d.minutes(),
      seconds: d.seconds()
    }
  }

  return {
    now: dayjs,
    formatTime,
    duration
  }
}
