import * as postOutageHandler from '../../src/apiHandlers/postOutageHandler'
import { mockPost } from '../mocks/mockResponses'
import axios, { AxiosError } from 'axios'
import MockAdapter from 'axios-mock-adapter'
import config from 'config'
import { mockSpecificIdAndTimeOutagesItems } from '../mocks/mockFiltering'

process.env.API_KEY = 'fakekey'
const siteId = 'kingfisher'
const postURL = `${config.get('API.URL')}${config.get('API.POST_ENDPOINT')}`
const postRequest = `${postURL}/${siteId}?api_key=${process.env.API_KEY}`
const mock = new MockAdapter(axios)

describe('Test happy path', () => {
    beforeAll(() => {
        mock.onPost(postRequest).reply(200, mockPost)
    })

    afterAll(() => {
        mock.reset()
    })

    test('Test postOutageInformation returns data and status', async () => {
        const returned = await postOutageHandler.postOutageInformation(
            siteId,
            mockSpecificIdAndTimeOutagesItems
        )
        expect(returned.data).toEqual(mockPost)
        expect(returned.status).toEqual(200)
    })
    test('Test handlePostOutage() returns expected response', async () => {
        const expectedResponse = {
            status: 200,
            success: true
        }
        const returned = await postOutageHandler.handlePostOutage(
            siteId,
            mockSpecificIdAndTimeOutagesItems
        )
        expect(returned).toEqual(expectedResponse)
    })
})

describe('Test response 500', () => {
    beforeAll(() => {
        mock.onPost(postRequest).reply(500)
    })
    afterAll(() => {
        mock.reset()
    })

    test('Test postOutageInformation throws AxiosError', async () => {
        await expect(
            postOutageHandler.postOutageInformation(
                siteId,
                mockSpecificIdAndTimeOutagesItems
            )
        ).rejects.toThrowError(AxiosError)
    })
    test('Test handlePostOutage() returns expected response with status code', async () => {
        const expectedResponse = {
            success: false,
            status: 500
        }
        const returned = await postOutageHandler.handlePostOutage(
            siteId,
            mockSpecificIdAndTimeOutagesItems
        )
        expect(returned).toEqual(expectedResponse)
    })
})

describe('Test network Error', () => {
    beforeAll(() => {
        mock.onPost(postRequest).networkError()
    })
    afterAll(() => {
        mock.reset()
    })

    test('Test postOutageInformation throws AxiosError', async () => {
        await expect(
            postOutageHandler.postOutageInformation(
                siteId,
                mockSpecificIdAndTimeOutagesItems
            )
        ).rejects.toThrowError(AxiosError)
    })
    test('Test handlePostOutage() returns expected response without status code', async () => {
        const expectedResponse = {
            success: false
        }
        const returned = await postOutageHandler.handlePostOutage(
            siteId,
            mockSpecificIdAndTimeOutagesItems
        )
        expect(returned).toEqual(expectedResponse)
    })
})
