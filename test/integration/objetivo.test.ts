import dotenv from 'dotenv'
import supertest from 'supertest'

const request = supertest('http://localhost:7000/api/v1')

dotenv.config()

describe('/objetivo', () => {
  const payloadRequest1 = {
    produtoId: 1,
    unidadeId: 2625,
    metaReferencia: 1000,
    metaReferencia2: 1000,
    metaAjustada: 1000,
    metaMinima: 0,
    trocas: 0,
    trava: '30%',
    erros: 0
  }
  test('POST - Criar um objetivo', async () => {
    const res = await request.post('/objetivo')
    // .auth(process.env.ROOT_USER, process.env.ROOT_PASS)
      .send(payloadRequest1)
    expect(res.status).toBe(201)
    // expect(res.body.id).toBe(payloadRequest1.id)
  })
})
