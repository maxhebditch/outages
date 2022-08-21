import * as outageHandler from '../../src/apiHandlers/getOutageHandler'
import { mockAllOutagesItems } from './mocks/mockResponses'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import config from 'config'

process.env.API_KEY = 'fakekey'
const outagesURL = `${config.get('API.URL')}${config.get('API.OUTAGES_ENDPOINT')}`
const outagesRequest = `${outagesURL}?api_key=${process.env.API_KEY}`
const mock = new MockAdapter(axios);

describe('Test happy path', () => {
    test('Test requesting outage API items', async () => {
        mock.onGet(outagesRequest).reply(200, mockAllOutagesItems);
        expect(await outageHandler.requestOutages()).toEqual(mockAllOutagesItems)
    })

    // test('Test return of all outages', async () => {
    //     const expectedResponse = {
    //         status: 200,
    //         data: mockAllOutagesItems
    //     }
    //     expect(outageHandler.getAllOutages()).toEqual(expectedResponse)
    // })
})
