import faker from '@faker-js/faker'
import { TimeOffTypes } from '@prisma/client'
import supertest from 'supertest'
import { TimeOffService } from '../service/timeoff.service'
import { UserService } from '../service/user.service'
import createServer from '../utils/server'
const app = createServer()
const token = process.env.AUTHORIZATION
const refreshToken = process.env.X_REFRESH

describe('timeOff', () => {
  describe('timeOff endpoints', () => {
    describe('timeOff does not exist', () => {
      it('should return 404 not found', async () => {
        const timeOffId = 'notExistingId'
        await supertest(app)
          .get(`/timeoffs/${timeOffId}`)
          .set('Authorization', `Bearer ${token}`)
          .set('x-refresh', `Bearer ${refreshToken}`)
          .expect(404)
      })
    })
    describe('user is not authenticated (no tokens provided)', () => {
      it('should return 403 ', async () => {
        const timeOffId = 'notExistingId'
        await supertest(app).get(`/timeoffs/${timeOffId}`).expect(403)
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

        //* It should create a new lead and connect the user that we created to it

        const query = {
          startDate: '2022-04-07T00:28:55+03:00',
          endDate: '2022-04-07T00:28:55+03:00',
          approved: true,
          uploaded: false,
          type: TimeOffTypes.paid,
          user: { connect: { id: user.id } },
        }

        const timeOff = await TimeOffService.createTimeOff(query, user.id)

        //* The lead that we just created should exist in our database
        await supertest(app)
          .get(`/timeoffs/${timeOff.id}`)
          .set('Authorization', `Bearer ${token}`)
          .set('x-refresh', `Bearer ${refreshToken}`)
          .expect(200)
          .then((res) => {
            expect(res.body).toHaveProperty('userId', user.id)
          })
        //* We try to update the lead with different userId

        const newUser = await UserService.createUser({
          email: faker.internet.email(),
          name: faker.name.firstName() + ' ' + faker.name.lastName(),
          password: faker.internet.password(),
          birthday: '02/20/1999',
          discord: faker.internet.userName(),
          phone: faker.phone.phoneNumber(),
        })

        const newTimeOffQuery = {
          startDate: faker.date.future(),
          endDate: faker.date.future(),
          approved: true,
          uploaded: false,
          type: TimeOffTypes.paid,
          user: { connect: { id: newUser.id } },
        }

        await supertest(app)
          .patch(`/timeoffs/${timeOff.id}`)
          .send(newTimeOffQuery)
          .set('Authorization', `Bearer ${token}`)
          .set('x-refresh', `Bearer ${refreshToken}`)
          .expect(200)
          .then((res) => {
            expect(res.body).toHaveProperty('userId', newUser.id)
          })
        //* We try to delete the new lead
        await supertest(app)
          .delete(`/timeoffs/${timeOff.id}`)
          .set('Authorization', `Bearer ${token}`)
          .set('x-refresh', `Bearer ${refreshToken}`)
          .expect(200)
        //* if deleting operation is successfull should return empty object
        await supertest(app)
          .get(`/timeoffs/${timeOff.id}`)
          .set('Authorization', `Bearer ${token}`)
          .set('x-refresh', `Bearer ${refreshToken}`)
          .then((res) => {
            const resBodyKeys = Object.keys(res.body)
            expect(resBodyKeys.length).toEqual(0)
          })
        //* We delete the user
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
        //* We delete the second user as well
        await supertest(app)
          .delete(`/users/${newUser.id}`)
          .set('Authorization', `Bearer ${token}`)
          .set('x-refresh', `Bearer ${refreshToken}`)
          .expect(200)
      })
    })
  })
})
