import * as outageHandler from '../../src/apiHandlers/getOutageHandler'
import { mockAllOutagesItems } from './mocks/mockResponses'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import config from 'config'

process.env.API_KEY = 'fakekey'
const outagesURL = `${config.get('API.URL')}${config.get(
    'API.OUTAGES_ENDPOINT'
)}`
const outagesRequest = `${outagesURL}?api_key=${process.env.API_KEY}`
const mock = new MockAdapter(axios)

describe('Test happy path', () => {
    beforeAll(() => {
        mock.onGet(outagesRequest).reply(200, mockAllOutagesItems)
    })

    test('Test requestOutages return', async () => {
        const returned = await outageHandler.requestOutages()
        expect(returned.data).toEqual(mockAllOutagesItems)
        expect(returned.status).toEqual(200)
    })
    test('Test getAllOutages return', async () => {
        const expectedResponse = {
            status: 200,
            data: mockAllOutagesItems
        }
        const returned = await outageHandler.getAllOutages()
        expect(returned).toEqual(expectedResponse)
    })
})
