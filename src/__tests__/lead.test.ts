import faker from '@faker-js/faker'
import supertest from 'supertest'
import { createLead } from '../service/lead.service'
import { createUser } from '../service/user.service'
import createServer from '../utils/server'
const app = createServer()
const token = process.env.AUTHORIZATION
const refreshToken = process.env.X_REFRESH

describe('lead', () => {
  describe('lead endpoints', () => {
    describe('lead does not exist', () => {
      it('should return 404 not found', async () => {
        const leadId = 'notExistingId'
        await supertest(app)
          .get(`/leads/${leadId}`)
          .set('Authorization', `Bearer ${token}`)
          .set('x-refresh', `Bearer ${refreshToken}`)
          .expect(404)
      })
    })
    describe('user is not authenticated (no tokens provided)', () => {
      it('should return 403 ', async () => {
        const leadId = 'notExistingId'
        await supertest(app).get(`/leads/${leadId}`).expect(403)
      })
    })

    describe('successful crud operations', () => {
      it('should return 200', async () => {
        const user = await createUser({
          email: faker.internet.email(),
          name: faker.name.firstName() + ' ' + faker.name.lastName(),
          password: faker.internet.password(),
          birthday: '02/20/1999',
          discord: faker.internet.userName(),
          phone: faker.phone.phoneNumber(),
        })

        //* It should create a new lead and connect the user that we created to it

        const lead = await createLead(user.id)

        //* The lead that we just created should exist in our database
        await supertest(app)
          .get(`/leads/${lead.id}`)
          .set('Authorization', `Bearer ${token}`)
          .set('x-refresh', `Bearer ${refreshToken}`)
          .expect(200)
          .then((res) => {
            expect(res.body).toHaveProperty('userId', user.id)
          })

        //* We try to delete the new lead
        await supertest(app)
          .delete(`/leads/${lead.id}`)
          .set('Authorization', `Bearer ${token}`)
          .set('x-refresh', `Bearer ${refreshToken}`)
          .expect(200)
        //* if deleting operation is successfull should return empty object
        await supertest(app)
          .get(`/leads/${lead.id}`)
          .set('Authorization', `Bearer ${token}`)
          .set('x-refresh', `Bearer ${refreshToken}`)
          .then((res) => {
            const resBodyKeys = Object.keys(res.body)
            expect(resBodyKeys.length).toEqual(0)
          })
        //* We expect the user to be deleted
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
