import * as outageHandler from '../../src/apiHandlers/getOutageHandler'
import { mockAllOutagesItems } from '../mocks/mockResponses'
import { AxiosError } from 'axios'
import { kfClient } from '../../src/apiHandlers/kfClient'
import MockAdapter from 'axios-mock-adapter'
import config from 'config'

process.env.API_KEY = 'fakekey'
const outagesURL = `${config.get('API.URL')}${config.get(
    'API.OUTAGES_ENDPOINT'
)}`
const mock = new MockAdapter(kfClient)

describe('Test happy path', () => {
    beforeAll(() => {
        mock.onGet(outagesURL).reply(200, mockAllOutagesItems)
    })

    afterAll(() => {
        mock.reset()
    })

    test('Test requestOutages returns data and status', async () => {
        const returned = await outageHandler.requestOutages()
        expect(returned.data).toEqual(mockAllOutagesItems)
        expect(returned.status).toEqual(200)
    })
    test('Test getAllOutages returns expected response', async () => {
        const expectedResponse = {
            status: 200,
            success: true,
            data: mockAllOutagesItems
        }
        const returned = await outageHandler.getAllOutages()
        expect(returned).toEqual(expectedResponse)
    })
})

describe('Test response 500', () => {
    beforeAll(() => {
        mock.onGet(outagesURL).reply(500)
    })
    afterAll(() => {
        mock.reset()
    })

    test('Test requestOutages throws AxiosError', async () => {
        await expect(outageHandler.requestOutages()).rejects.toThrowError(
            AxiosError
        )
    })
    test('Test getAllOutages returns expected response with status code', async () => {
        const expectedResponse = {
            success: false,
            status: 500
        }
        const returned = await outageHandler.getAllOutages()
        expect(returned).toEqual(expectedResponse)
    })
})

describe('Test network Error', () => {
    beforeAll(() => {
        mock.onGet(outagesURL).networkError()
    })
    afterAll(() => {
        mock.reset()
    })

    test('Test requestOutages throws AxiosError', async () => {
        await expect(outageHandler.requestOutages()).rejects.toThrowError(
            AxiosError
        )
    })
    test('Test getAllOutages returns expected response without status code', async () => {
        const expectedResponse = {
            success: false
        }
        const returned = await outageHandler.getAllOutages()
        expect(returned).toEqual(expectedResponse)
    })
})
