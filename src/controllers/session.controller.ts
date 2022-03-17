import { Request, Response } from 'express'
import { createSession, findSession } from '../service/session.service'
import config from 'config'
import { validatePassword } from '../service/user.service'
import { signJwt } from '../utils/jwt.utils'

export async function createUserSessionHandler(req: Request, res: Response) {
  const user = await validatePassword(req.body)

  if (!user) return res.status(401).send('Invalid email or password')
  console.log(req.get('user-agent'))

  const session = await createSession(user._id, req.get('user-agent') || '')

  const accessToken = signJwt(
    { ...user, session: session.id },
    { expiresIn: config.get('accessTokenTtl') },
  )

  const refreshToken = signJwt(
    { ...user, session: session.id },
    { expiresIn: config.get('accessTokenTtl') },
  )

  return res.send({ accessToken, refreshToken })
}

export async function getUserSessionHandler(req: Request, res: Response) {
  const userId = res.locals.user._id
  const sessions = await findSession({ user: userId, valid: true })
  return res.send(sessions)
}
