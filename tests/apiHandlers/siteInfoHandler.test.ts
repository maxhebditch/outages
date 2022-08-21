import * as siteInfoHandler from '../../src/apiHandlers/siteInfoHandler'
import { mockSiteInfo } from './mocks/mockResponses'
import axios, { AxiosError } from 'axios'
import MockAdapter from 'axios-mock-adapter'
import config from 'config'

process.env.API_KEY = 'fakekey'
const siteId = 'kingfisher'
const siteInfoURL = `${config.get('API.URL')}${config.get('API.SITE_INFO')}`
const siteInfoRequest = `${siteInfoURL}/${siteId}?api_key=${process.env.API_KEY}`
const mock = new MockAdapter(axios)

describe('Test happy path', () => {
    beforeAll(() => {
        mock.onGet(siteInfoRequest).reply(200, mockSiteInfo)
    })

    afterAll(() => {
        mock.reset()
    })

    test('Test requestSiteInformation returns data and status', async () => {
        const returned = await siteInfoHandler.requestSiteInformation(siteId)
        expect(returned.data).toEqual(mockSiteInfo)
        expect(returned.status).toEqual(200)
    })
    test('Test getSiteInformation() returns expected response', async () => {
        const expectedResponse = {
            status: 200,
            success: true,
            data: mockSiteInfo
        }
        const returned = await siteInfoHandler.getSiteInformation(siteId)
        expect(returned).toEqual(expectedResponse)
    })
})

describe('Test response 500', () => {
    beforeAll(() => {
        mock.onGet(siteInfoRequest).reply(500)
    })
    afterAll(() => {
        mock.reset()
    })

    test('Test requestSiteInformation throws AxiosError', async () => {
        await expect(
            siteInfoHandler.requestSiteInformation(siteId)
        ).rejects.toThrowError(AxiosError)
    })
    test('Test getSiteInformation() returns expected response with status code', async () => {
        const expectedResponse = {
            success: false,
            status: 500
        }
        const returned = await siteInfoHandler.getSiteInformation(siteId)
        expect(returned).toEqual(expectedResponse)
    })
})

describe('Test network Error', () => {
    beforeAll(() => {
        mock.onGet(siteInfoRequest).networkError()
    })
    afterAll(() => {
        mock.reset()
    })

    test('Test requestSiteInformation throws AxiosError', async () => {
        await expect(
            siteInfoHandler.requestSiteInformation(siteId)
        ).rejects.toThrowError(AxiosError)
    })
    test('Test getSiteInformation() returns expected response without status code', async () => {
        const expectedResponse = {
            success: false
        }
        const returned = await siteInfoHandler.getSiteInformation(siteId)
        expect(returned).toEqual(expectedResponse)
    })
})
