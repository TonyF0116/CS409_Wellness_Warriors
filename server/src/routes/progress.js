const express = require('express')

const { normalizeDateInput, toDateOnlyString, calculateStreak, countUniqueDates } = require('../utils/dates')

function startOfMonth(date) {
  const copy = new Date(date)
  copy.setDate(1)
  return copy
}

function endOfMonth(date) {
  const copy = new Date(date)
  copy.setMonth(copy.getMonth() + 1)
  copy.setDate(0)
  return copy
}

function daysAgo(date, amount) {
  const copy = new Date(date)
  copy.setDate(copy.getDate() - amount)
  return copy
}

function createProgressRouter(store) {
  const router = express.Router()

  router.get('/overview', async (req, res, next) => {
    try {
      const [habits, completions] = await Promise.all([
        store.getHabits(req.userId),
        store.getCompletions(req.userId)
      ])

      const completionDates = completions.map(c => c.date)
      const sevenDaysAgo = toDateOnlyString(daysAgo(new Date(), 6))
      const completionsThisWeek = completions.filter(c => c.date >= sevenDaysAgo).length

      res.json({
        summary: {
          totalHabits: habits.length,
          totalCompletions: completions.length,
          completionsThisWeek,
          daysActive: countUniqueDates(completionDates),
          activeStreak: calculateStreak(completionDates)
        }
      })
    } catch (error) {
      next(error)
    }
  })

  router.get('/calendar', async (req, res, next) => {
    try {
      const today = new Date()
      const defaultStart = startOfMonth(today)
      const defaultEnd = endOfMonth(today)

      const start = normalizeDateInput(req.query.start) || toDateOnlyString(defaultStart)
      const end = normalizeDateInput(req.query.end) || toDateOnlyString(defaultEnd)

      const completions = await store.getCompletionsByRange(req.userId, start, end)
      const dates = completions.reduce((acc, completion) => {
        acc[completion.date] = (acc[completion.date] || 0) + 1
        return acc
      }, {})

      res.json({
        range: { start, end },
        dates
      })
    } catch (error) {
      next(error)
    }
  })

  return router
}

module.exports = createProgressRouter
