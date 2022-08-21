import * as getSiteInfoHandler from '../../src/apiHandlers/getSiteInfoHandler'
import { mockSiteInfo } from '../mocks/mockResponses'
import { AxiosError } from 'axios'
import { kfClient } from '../../src/apiHandlers/kfClient'
import MockAdapter from 'axios-mock-adapter'
import config from 'config'

process.env.API_KEY = 'fakekey'
const siteId = 'kingfisher'
const siteInfoURL = `${config.get('API.URL')}${config.get(
    'API.SITE_INFO'
)}/${siteId}`
const mock = new MockAdapter(kfClient)

describe('Test happy path', () => {
    beforeAll(() => {
        mock.onGet(siteInfoURL).reply(200, mockSiteInfo)
    })

    afterAll(() => {
        mock.reset()
    })

    test('Test requestSiteInformation returns data and status', async () => {
        const returned = await getSiteInfoHandler.requestSiteInformation(siteId)
        expect(returned.data).toEqual(mockSiteInfo)
        expect(returned.status).toEqual(200)
    })
    test('Test getSiteInformation() returns expected response', async () => {
        const expectedResponse = {
            status: 200,
            success: true,
            data: mockSiteInfo
        }
        const returned = await getSiteInfoHandler.getSiteInformation(siteId)
        expect(returned).toEqual(expectedResponse)
    })
})

describe('Test response 500', () => {
    beforeAll(() => {
        mock.onGet(siteInfoURL).reply(500)
    })
    afterAll(() => {
        mock.reset()
    })

    test('Test requestSiteInformation throws AxiosError', async () => {
        await expect(
            getSiteInfoHandler.requestSiteInformation(siteId)
        ).rejects.toThrowError(AxiosError)
    })
    test('Test getSiteInformation() returns expected response with status code', async () => {
        const expectedResponse = {
            success: false,
            status: 500
        }
        const returned = await getSiteInfoHandler.getSiteInformation(siteId)
        expect(returned).toEqual(expectedResponse)
    })
})

describe('Test network Error', () => {
    beforeAll(() => {
        mock.onGet(siteInfoURL).networkError()
    })
    afterAll(() => {
        mock.reset()
    })

    test('Test requestSiteInformation throws AxiosError', async () => {
        await expect(
            getSiteInfoHandler.requestSiteInformation(siteId)
        ).rejects.toThrowError(AxiosError)
    })
    test('Test getSiteInformation() returns expected response without status code', async () => {
        const expectedResponse = {
            success: false
        }
        const returned = await getSiteInfoHandler.getSiteInformation(siteId)
        expect(returned).toEqual(expectedResponse)
    })
})
