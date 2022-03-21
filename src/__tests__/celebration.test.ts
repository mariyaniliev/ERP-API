import supertest from 'supertest'
import createServer from '../utils/server'

const app = createServer()
const token = process.env.AUTHORIZATION
const refreshToken = process.env.X_REFRESH_TOKEN
describe('celebration', () => {
  describe('get celebration route', () => {
    describe('celebration does not exist', () => {
      it('should return 404', async () => {
        const celebrationId = 'product-123'
        await supertest(app)
          .get(`/celebrations/${celebrationId}`)
          .set('Authorization', `Bearer ${token}`)
          .set('x-refresh', `Bearer ${refreshToken}`)
          .expect(404)
      })
    })
  })
})
