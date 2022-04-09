import { OccasionTypes } from '@prisma/client'
import faker from '@faker-js/faker'
import supertest from 'supertest'
import { CelebrationService } from '../service/celebration.service'
import { UserService } from '../service/user.service'
import createServer from '../utils/server'
const app = createServer()
const token = process.env.AUTHORIZATION
const refreshToken = process.env.X_REFRESH

describe('celebration', () => {
  describe('celebration endpoints', () => {
    describe('celebration does not exist', () => {
      it('should return 404 not found', async () => {
        const celebrationId = 'notExistingId'
        await supertest(app)
          .get(`/celebrations/${celebrationId}`)
          .set('Authorization', `Bearer ${token}`)
          .set('x-refresh', `Bearer ${refreshToken}`)
          .expect(404)
      })
    })
    describe('user is not authenticated (no tokens provided)', () => {
      it('should return 403 ', async () => {
        const celebrationId = 'notExistingId'
        await supertest(app).get(`/celebrations/${celebrationId}`).expect(403)
      })
    })

    describe('successful crud operations', () => {
      it('should return 200', async () => {
        const user = await UserService.createUser({
          email: faker.internet.email(),
          name: faker.name.firstName() + ' ' + faker.name.lastName(),
          password: faker.internet.password(),
          birthday: '02/20/1999',
          discord: faker.internet.userName(),
          phone: faker.phone.phoneNumber(),
        })

        //* It should create a new celebration and connect the user that we created to it
        const query = {
          occasion: OccasionTypes.birthday,
          startDate: faker.date.future(),
          enabled: true,
          user: { connect: { id: user.id } },
        }
        const celebration = await CelebrationService.createCelebration(query)

        //* The celebration that we just created should exist in our database
        await supertest(app)
          .get(`/celebrations/${celebration.id}`)
          .set('Authorization', `Bearer ${token}`)
          .set('x-refresh', `Bearer ${refreshToken}`)
          .expect(200)
          .then((res) => {
            expect(res.body).toHaveProperty('userId', user.id)
          })
        //* We try to update the celebration with different "occasion" property
        await supertest(app)
          .patch(`/celebrations/${celebration.id}`)
          .send({ occasion: OccasionTypes.nameday })
          .set('Authorization', `Bearer ${token}`)
          .set('x-refresh', `Bearer ${refreshToken}`)
          .expect(200)
          .then((res) => {
            expect(res.body).toHaveProperty('occasion', OccasionTypes.nameday)
          })
        //* We try to delete the new celebration
        await supertest(app)
          .delete(`/celebrations/${celebration.id}`)
          .set('Authorization', `Bearer ${token}`)
          .set('x-refresh', `Bearer ${refreshToken}`)
          .expect(200)
        //* if deleting operation is successfull should return empty object
        await supertest(app)
          .get(`/celebrations/${celebration.id}`)
          .set('Authorization', `Bearer ${token}`)
          .set('x-refresh', `Bearer ${refreshToken}`)
          .then((res) => {
            const resBodyKeys = Object.keys(res.body)
            expect(resBodyKeys.length).toEqual(0)
          })
        //* We delete the user that we created
        await supertest(app)
          .delete(`/users/${user.id}`)
          .set('Authorization', `Bearer ${token}`)
          .set('x-refresh', `Bearer ${refreshToken}`)
          .expect(200)
        //* We expect the user to be deleted
        await supertest(app)
          .get(`/users/${user.id}`)
          .set('Authorization', `Bearer ${token}`)
          .set('x-refresh', `Bearer ${refreshToken}`)
          .then((res) => {
            const resBodyKeys = Object.keys(res.body)
            expect(resBodyKeys.length).toEqual(0)
          })
      })
    })
  })
})
