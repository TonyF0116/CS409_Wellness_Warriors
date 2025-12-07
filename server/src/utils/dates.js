function pad(value) {
  return value.toString().padStart(2, '0')
}

function toDateOnlyString(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function normalizeDateInput(value) {
  if (!value) {
    return toDateOnlyString(new Date())
  }
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return null
  }
  return toDateOnlyString(parsed)
}

function calculateStreak(dates) {
  if (!dates?.length) {
    return 0
  }
  const uniqueDates = new Set(dates)
  let streak = 0
  const cursor = new Date()

  while (true) {
    const key = toDateOnlyString(cursor)
    if (!uniqueDates.has(key)) {
      break
    }
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}

function countUniqueDates(dates) {
  if (!dates?.length) return 0
  return new Set(dates).size
}

module.exports = {
  toDateOnlyString,
  normalizeDateInput,
  calculateStreak,
  countUniqueDates
}
