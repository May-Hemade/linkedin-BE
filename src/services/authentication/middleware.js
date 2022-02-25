import jwt from "jsonwebtoken"

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"] || req.headers["Authorization"]
  console.log(token)

  if (!token) {
    return res.status(403).send("A token is required for authentication")
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY)
    req.user = decoded
    console.log(req.user)
  } catch (err) {
    return res.status(401).send("Invalid Token")
  }
  return next()
}
export default verifyToken
