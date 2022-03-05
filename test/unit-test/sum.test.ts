import 'jest'
import { sum } from './sum'

describe.skip('Teste de exemplo', () => {
  test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3)
  })
}
)
