const fsp = require('fs/promises')
const path = require('path')
const { randomUUID } = require('crypto')

const DEFAULT_STATE = {
  habits: [],
  completions: []
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value))
}

class DataStore {
  constructor(filePath) {
    this.filePath = filePath
    this.state = deepClone(DEFAULT_STATE)
    this.readyPromise = this.load()
  }

  async load() {
    try {
      const contents = await fsp.readFile(this.filePath, 'utf8')
      const parsed = JSON.parse(contents)
      this.state = {
        habits: Array.isArray(parsed.habits) ? parsed.habits : [],
        completions: Array.isArray(parsed.completions) ? parsed.completions : []
      }
    } catch (error) {
      if (error.code === 'ENOENT') {
        await fsp.mkdir(path.dirname(this.filePath), { recursive: true })
        await fsp.writeFile(this.filePath, JSON.stringify(DEFAULT_STATE, null, 2))
        this.state = deepClone(DEFAULT_STATE)
      } else {
        throw error
      }
    }
  }

  async ensureReady() {
    return this.readyPromise
  }

  async persist() {
    await this.ensureReady()
    await fsp.writeFile(this.filePath, JSON.stringify(this.state, null, 2))
  }

  async getHabits(userId) {
    await this.ensureReady()
    return this.state.habits.filter(habit => habit.userId === userId)
  }

  async getHabit(userId, habitId) {
    await this.ensureReady()
    return this.state.habits.find(habit => habit.userId === userId && habit.id === habitId) || null
  }

  async createHabit(userId, { name, type, cycle, message }) {
    await this.ensureReady()
    const now = new Date().toISOString()
    const habit = {
      id: `habit_${randomUUID()}`,
      userId,
      name,
      type: type || '',
      cycle: cycle || 'daily',
      message: message || '',
      createdAt: now,
      updatedAt: now
    }
    this.state.habits.push(habit)
    await this.persist()
    return habit
  }

  async updateHabit(userId, habitId, updates) {
    await this.ensureReady()
    const habit = await this.getHabit(userId, habitId)
    if (!habit) {
      return null
    }
    Object.assign(habit, updates, { updatedAt: new Date().toISOString() })
    await this.persist()
    return habit
  }

  async deleteHabit(userId, habitId) {
    await this.ensureReady()
    const habitIndex = this.state.habits.findIndex(habit => habit.userId === userId && habit.id === habitId)
    if (habitIndex === -1) {
      return false
    }
    this.state.habits.splice(habitIndex, 1)
    this.state.completions = this.state.completions.filter(completion => completion.userId !== userId || completion.habitId !== habitId)
    await this.persist()
    return true
  }

  async getCompletions(userId, habitId = null) {
    await this.ensureReady()
    return this.state.completions.filter(completion => {
      if (completion.userId !== userId) return false
      if (habitId && completion.habitId !== habitId) return false
      return true
    })
  }

  async addCompletion(userId, habitId, date) {
    await this.ensureReady()
    const existing = this.state.completions.find(c => c.userId === userId && c.habitId === habitId && c.date === date)
    if (existing) {
      return existing
    }
    const completion = {
      id: `completion_${randomUUID()}`,
      userId,
      habitId,
      date,
      createdAt: new Date().toISOString()
    }
    this.state.completions.push(completion)
    await this.persist()
    return completion
  }

  async removeCompletion(userId, habitId, completionId) {
    await this.ensureReady()
    const index = this.state.completions.findIndex(c =>
      c.userId === userId && c.habitId === habitId && c.id === completionId
    )
    if (index === -1) {
      return false
    }
    this.state.completions.splice(index, 1)
    await this.persist()
    return true
  }

  async removeCompletionByDate(userId, habitId, date) {
    await this.ensureReady()
    const index = this.state.completions.findIndex(c =>
      c.userId === userId && c.habitId === habitId && c.date === date
    )
    if (index === -1) {
      return null
    }
    const [removed] = this.state.completions.splice(index, 1)
    await this.persist()
    return removed
  }

  async getCompletionsByRange(userId, startDate, endDate) {
    await this.ensureReady()
    return this.state.completions.filter(c => {
      if (c.userId !== userId) return false
      if (startDate && c.date < startDate) return false
      if (endDate && c.date > endDate) return false
      return true
    })
  }
}

module.exports = DataStore
