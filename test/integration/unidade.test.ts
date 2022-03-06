import dotenv from 'dotenv'
import supertest from 'supertest'

const request = supertest('http://localhost:7000/api/v1')

dotenv.config()

describe('/unidade', () => {
  const payloadRequest1 = {
    id: 408,
    nome: 'Anita Garibaldi, SC',
    tipo: 'AG',
    porte: 1,
    cluster: 'Agências - Porte 1',
    nivel: 3,
    se: 6006,
    sr: 2625,
    rede: 'Física'

  }
  test('POST - Criar uma unidade', async () => {
    const res = await request.post('/unidade')
    // .auth(process.env.ROOT_USER, process.env.ROOT_PASS)
      .send(payloadRequest1)
    expect(res.status).toBe(201)
    expect(res.body.id).toBe(payloadRequest1.id)
  })

  test('PUT - Atualizar uma unidade', async () => {
    payloadRequest1.nome = 'Anita Garibaldi, SC'

    const res = await request.put('/unidade')
      // .auth(process.env.ROOT_USER, process.env.ROOT_PASS)
      .send(payloadRequest1)
    expect(res.status).toBe(200)
    expect(res.body.id).toBe(payloadRequest1.id)
    expect(res.body.nome).toBe(payloadRequest1.nome)
  })

  test('GET - Buscar uma unidade', async () => {
    const id = payloadRequest1.id

    const res = await request.put('/unidade/' + id)
      .send(payloadRequest1)
    expect(res.status).toBe(200)
    expect(res.body.id).toBe(id)
    expect(res.body.nome).toBe(payloadRequest1.nome)
  })

  test('GET - Buscar unidades por agregador', async () => {
    const id = payloadRequest1.sr

    const res = await request.put('/unidade/vinc/' + id)
      .send(payloadRequest1)

    expect(res.status).toBe(200)
    // expect(res.body.sr).toBe(id)
    // expect(res.body.nome).toBe(payloadRequest1.nome)
  })
}
)
