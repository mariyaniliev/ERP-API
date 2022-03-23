import { OccasionTypes } from '@prisma/client'
import supertest from 'supertest'
import { createCelebration } from '../service/celebration.service'
import { createUser } from '../service/user.service'
import createServer from '../utils/server'
import faker from '@faker-js/faker'
const app = createServer()
const token = process.env.AUTHORIZATION
const refreshToken = process.env.X_REFRESH

describe('celebration', () => {
  describe('get celebration route', () => {
    describe('celebration does not exist', () => {
      it('should return 404 ', async () => {
        const celebrationId = 'celebration-123'
        await supertest(app)
          .get(`/celebrations/${celebrationId}`)
          .set('Authorization', `Bearer ${token}`)
          .set('x-refresh', `Bearer ${refreshToken}`)
          .expect(404)
      })
    })
    describe('user is not authenticated', () => {
      it('should return 403 ', async () => {
        const celebrationId = 'celebration-123'
        await supertest(app).get(`/celebrations/${celebrationId}`).expect(403)
      })
    })

    describe('celebration exists', () => {
      it('should return 200 ', async () => {
        const user = await createUser({
          name: faker.name.firstName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
        })
        const query = {
          occasion: OccasionTypes.birthday,
          startDate: faker.date.future(),
          enabled: true,
          user: { connect: { id: user.id } },
        }

        const celebration = await createCelebration(query)

        await supertest(app)
          .get(`/celebrations/${celebration.id}`)
          .set('Authorization', `Bearer ${token}`)
          .set('x-refresh', `Bearer ${refreshToken}`)
          .expect(200)
          .then((res) => {
            expect(res.body).toHaveProperty('id')
            expect(res.body).toHaveProperty('userId', user.id)
          })
      })
    })
  })
})
