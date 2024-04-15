import dayjs from 'dayjs'

export const formatTime = (long, type) => {
  const fullMin = long / 1000 / 60
  const h = Math.floor(fullMin / 60)
  let m
  let hh
  let mm
  if (h > 0) {
    m = fullMin - h * 60
  } else {
    m = fullMin
  }
  // hh = h < 10 ? `0${h}` : `${h}`
  // mm = m < 10 ? `0${m}` : `${m}`
  return type === 'hh' ? h : type === 'mm' ? m : ''
}

export const formatHourAndMinute = (time) => {
  return `${dayjs(time).get('hour')}:${dayjs(time).get('minute')}`
}
