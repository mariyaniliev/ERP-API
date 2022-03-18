import { Request, Response } from 'express'
import { createSession, findSession, updateSession } from '../service/session.service'
import { validatePassword } from '../service/user.service'
import { signJwt } from '../utils/jwt.utils'

export async function createUserSessionHandler(req: Request, res: Response) {
  const user = await validatePassword(req.body)

  if (!user) return res.status(401).send('Invalid email or password')

  const session = await createSession(user.id, req.get('user-agent') || '')

  const accessToken = signJwt({ ...user, session: session.id }, { expiresIn: '2h' })

  const refreshToken = signJwt({ ...user, session: session.id }, { expiresIn: '1y' })

  return res.send({ accessToken, refreshToken })
}

export async function getUserSessionHandler(req: Request, res: Response) {
  const userId = res.locals.user.id
  const sessions = await findSession({ userId: userId, valid: true })
  return res.send(sessions)
}

export async function deleteSessionHandler(req: Request, res: Response) {
  const sessionId = res.locals.user.session

  await updateSession({ id: sessionId }, { valid: false })
  return res.send({ accessToken: null, refreshToken: null })
}
