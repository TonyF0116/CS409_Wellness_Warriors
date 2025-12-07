function userContext(req, res, next) {
  const headerUser = req.header('x-user-id')
  req.userId = (headerUser && headerUser.trim()) || req.query.userId || 'demo-user'
  next()
}

module.exports = userContext
