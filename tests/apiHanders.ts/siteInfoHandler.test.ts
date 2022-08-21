import { getAllOutages } from '../../src/apiHandlers/getOutageHandler'

describe('Test happy path', () => {
    test('Test return of all outages', async () => {
        expect(getAllOutages()).toBe('')
    })
})
