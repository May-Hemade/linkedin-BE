import express from "express"
import createHttpError from "http-errors"
import profilesModel from "../profiles/schema.js"
import jwt from "jsonwebtoken"

const authRouter = express.Router()

authRouter.post("/register", async (req, res, next) => {
  try {
    const { email, username } = req.body
    const oldEmail = await profilesModel.findOne({ email: email })

    if (oldEmail) {
      next(createHttpError(400, `Email address ${email} already exists!`))
    }

    const oldUsername = await profilesModel.findOne({ username: username })

    if (oldUsername) {
      next(createHttpError(400, `Username ${username} already exists!`))
    }

    const newProfile = new profilesModel(req.body)
    const { _id } = await newProfile.save()

    const token = jwt.sign({ user_id: _id, username }, process.env.TOKEN_KEY, {
      expiresIn: "30d",
    })

    newProfile.token = token
    await newProfile.save()

    res.status(201).send({ _id, email, username, token })
  } catch (error) {
    next(error)
  }
})

authRouter.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body

    const profile = await profilesModel.findOne({
      username: username,
      password: password,
    })

    if (profile) {
      const email = profile.email
      const token = jwt.sign(
        { user_id: profile._id, username },
        process.env.TOKEN_KEY,
        {
          expiresIn: "30d",
        }
      )

      profile.token = token
      await profile.save()

      res.status(200).send({ _id: profile._id, email: email, username, token })
    } else {
      next(createHttpError(403, `Invalid credentials!`))
    }
  } catch (error) {
    next(error)
  }
})

export default authRouter
