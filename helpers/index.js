const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
  const token = req.token

  if (!token) {
    return res.status(403).json({
      failed: 'No token provided'
    })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).json({
        failed: 'Failed to authenticate token'
      })
    }
    req.userId = decoded.id
    next()
  })
}

module.exports = verifyToken
