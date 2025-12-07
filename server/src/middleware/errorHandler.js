function errorHandler(err, req, res, next) {
  const status = err.status || 500
  const payload = {
    message: err.message || 'Unexpected server error'
  }

  if (process.env.NODE_ENV !== 'production') {
    payload.stack = err.stack
  }

  // eslint-disable-next-line no-console
  console.error(err)
  res.status(status).json(payload)
}

module.exports = errorHandler
