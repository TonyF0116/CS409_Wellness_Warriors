const express = require('express')

const { normalizeDateInput, toDateOnlyString, calculateStreak } = require('../utils/dates')

function validateHabitPayload(body, { partial = false } = {}) {
  const payload = {}

  if (!partial || body.name !== undefined) {
    if (!body.name || typeof body.name !== 'string') {
      const error = new Error('Habit name is required')
      error.status = 400
      throw error
    }
    payload.name = body.name.trim()
    if (!payload.name) {
      const error = new Error('Habit name cannot be empty')
      error.status = 400
      throw error
    }
  }

  if (body.type !== undefined) {
    if (typeof body.type !== 'string') {
      const error = new Error('Habit type must be a string')
      error.status = 400
      throw error
    }
    payload.type = body.type.trim()
  }

  if (body.cycle !== undefined) {
    const allowed = ['daily', 'weekly', 'monthly']
    if (!allowed.includes(body.cycle)) {
      const error = new Error(`Cycle must be one of: ${allowed.join(', ')}`)
      error.status = 400
      throw error
    }
    payload.cycle = body.cycle
  }

  if (body.message !== undefined) {
    if (typeof body.message !== 'string') {
      const error = new Error('Message must be a string')
      error.status = 400
      throw error
    }
    payload.message = body.message.trim()
  }

  return payload
}

function buildHabitResponse(habit, completions = []) {
  const today = toDateOnlyString(new Date())
  const todaysCompletion = completions.find(c => c.date === today) || null
  const sorted = [...completions].sort((a, b) => a.date.localeCompare(b.date))
  const lastCompletion = sorted[sorted.length - 1] || null

  return {
    ...habit,
    totalEntries: completions.length,
    completedToday: Boolean(todaysCompletion),
    completedTodayCompletionId: todaysCompletion?.id || null,
    lastCompletedOn: lastCompletion?.date || null,
    streak: calculateStreak(sorted.map(c => c.date))
  }
}

function createHabitRouter(store) {
  const router = express.Router()

  router.get('/', async (req, res, next) => {
    try {
      const habits = await store.getHabits(req.userId)
      const completions = await store.getCompletions(req.userId)
      const grouped = completions.reduce((acc, completion) => {
        acc[completion.habitId] = acc[completion.habitId] || []
        acc[completion.habitId].push(completion)
        return acc
      }, {})
      const shaped = habits.map(habit => buildHabitResponse(habit, grouped[habit.id] || []))
      res.json({ habits: shaped })
    } catch (error) {
      next(error)
    }
  })

  router.post('/', async (req, res, next) => {
    try {
      const payload = validateHabitPayload(req.body || {})
      const habit = await store.createHabit(req.userId, payload)
      res.status(201).json({ habit: buildHabitResponse(habit, []) })
    } catch (error) {
      next(error)
    }
  })

  router.put('/:habitId', async (req, res, next) => {
    try {
      const payload = validateHabitPayload(req.body || {}, { partial: true })
      const updated = await store.updateHabit(req.userId, req.params.habitId, payload)
      if (!updated) {
        return res.status(404).json({ message: 'Habit not found' })
      }
      const completions = await store.getCompletions(req.userId, updated.id)
      res.json({ habit: buildHabitResponse(updated, completions) })
    } catch (error) {
      next(error)
    }
  })

  router.delete('/:habitId', async (req, res, next) => {
    try {
      const deleted = await store.deleteHabit(req.userId, req.params.habitId)
      if (!deleted) {
        return res.status(404).json({ message: 'Habit not found' })
      }
      res.status(204).end()
    } catch (error) {
      next(error)
    }
  })

  router.get('/:habitId/completions', async (req, res, next) => {
    try {
      const { habitId } = req.params
      const habit = await store.getHabit(req.userId, habitId)
      if (!habit) {
        return res.status(404).json({ message: 'Habit not found' })
      }
      const completions = await store.getCompletions(req.userId, habitId)
      res.json({ completions })
    } catch (error) {
      next(error)
    }
  })

  router.post('/:habitId/completions', async (req, res, next) => {
    try {
      const { habitId } = req.params
      const habit = await store.getHabit(req.userId, habitId)
      if (!habit) {
        return res.status(404).json({ message: 'Habit not found' })
      }

      const targetDate = normalizeDateInput(req.body?.date)
      if (!targetDate) {
        return res.status(400).json({ message: 'Invalid date format' })
      }

      const completion = await store.addCompletion(req.userId, habitId, targetDate)
      const completions = await store.getCompletions(req.userId, habitId)
      res.status(201).json({ completion, habit: buildHabitResponse(habit, completions) })
    } catch (error) {
      next(error)
    }
  })

  router.delete('/:habitId/completions/:completionId', async (req, res, next) => {
    try {
      const { habitId, completionId } = req.params
      const habit = await store.getHabit(req.userId, habitId)
      if (!habit) {
        return res.status(404).json({ message: 'Habit not found' })
      }
      const removed = await store.removeCompletion(req.userId, habitId, completionId)
      if (!removed) {
        return res.status(404).json({ message: 'Completion not found' })
      }
      const completions = await store.getCompletions(req.userId, habitId)
      res.json({ habit: buildHabitResponse(habit, completions) })
    } catch (error) {
      next(error)
    }
  })

  return router
}

module.exports = createHabitRouter
