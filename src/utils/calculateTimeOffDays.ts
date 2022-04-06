import { getHolidays } from 'public-holidays'

export const calculateTimeOffDays = (startDate: Date, endDate: Date) => {
  const fromDate = new Date(startDate)
  const toDate = new Date(endDate)
  const numOfDates = getBusinessDatesCount(fromDate, toDate)

  async function getBusinessDatesCount(fromDate: Date, toDate: Date) {
    let count = 0
    const timeOffDays = new Set()
    const curDate = fromDate

    while (curDate <= toDate) {
      const dayOfWeek = curDate.getDay()

      let formattedDate = `${curDate.getMonth() + 1}/${curDate.getDate()}/${curDate.getFullYear()}`

      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++
      }

      timeOffDays.add(formattedDate)
      curDate.setDate(curDate.getDate() + 1)

      formattedDate = `${curDate.getMonth() + 1}/${curDate.getDate()}/${curDate.getFullYear()}`

      if (!timeOffDays.has(formattedDate)) {
        timeOffDays.add(formattedDate)
      }
    }
    if (count > 0) count++

    const options = { country: 'bg', lang: 'en' }
    const allHolidays = await getHolidays(options)

    allHolidays
      .filter((holiday) => {
        const dayOfWeek = holiday.date.getDay() - 1 < 0 ? 6 : holiday.date.getDay() - 1
        const isBusinessDay = dayOfWeek !== 0 && dayOfWeek !== 6
        if (isBusinessDay) {
          return (
            holiday.name === 'Christmas Day' ||
            holiday.name === 'Second day of Christmas' ||
            holiday.name === 'Easter Sunday'
          )
        }
      })
      .map((holiday) => {
        return `${holiday.date.getMonth() + 1}/${holiday.date.getDate()}/${holiday.date.getFullYear()}`
      })
      .forEach((holiday) => {
        timeOffDays.forEach((day) => {
          if (day === holiday) {
            count -= 1
          }
        })
      })

    return count < 0 ? 0 : count
  }
  return numOfDates
}
