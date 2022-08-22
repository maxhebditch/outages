import { kfClient } from '../src/apiHandlers/kfClient'
import MockAdapter from 'axios-mock-adapter'
import config from 'config'
import {
    mockAllOutagesItems,
    mockSiteInfo,
    mockPost
} from './mocks/mockResponses'
import {
    mockSpecificIdAndTimeOutagesItems,
    mockAssembledEvents
} from './mocks/mockFiltering'
import * as runApp from '../src/appHandlers/runApp'
import * as outageHander from '../src/apiHandlers/getOutageHandler'
import * as siteInfo from '../src/apiHandlers/getSiteInfoHandler'
import * as filterEvents from '../src/processOutages/filterOutages'
import * as assembleOutages from '../src/processOutages/assembleOutages'
import * as postOutages from '../src/apiHandlers/postOutageHandler'
import { OutageItem } from '../src/types/outageTypes'
import { SiteInfo } from '../src/types/siteInfoTypes'

process.env.API_KEY = 'fakekey'
const siteId = 'kingfisher'
const outagesURL = `${config.get('API.URL')}${config.get(
    'API.OUTAGES_ENDPOINT'
)}`
const siteInfoURL = `${config.get('API.URL')}${config.get(
    'API.SITE_INFO'
)}/${siteId}`
const postURL = `${config.get('API.URL')}${config.get(
    'API.POST_ENDPOINT'
)}/${siteId}`

const mock = new MockAdapter(kfClient)
const spyGetAllOutages = jest.spyOn(outageHander, 'getAllOutages')
const spyValidateOutageItems = jest.spyOn(runApp, 'validateOutageItems')
const spyGetSiteInfo = jest.spyOn(siteInfo, 'getSiteInformation')
const spyValidateSiteInfo = jest.spyOn(runApp, 'validateSiteInfo')
const spyFilterEvents = jest.spyOn(filterEvents, 'filterEventsByTimeAndId')
const spyAssembleOutages = jest.spyOn(assembleOutages, 'assembleOutages')
const spyPostOutages = jest.spyOn(postOutages, 'handlePostOutage')
const spyPrintErrorAndExit = jest.spyOn(runApp, 'printErrorAndExit')
const spyConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {})
const spyConsoleError = jest
    .spyOn(console, 'error')
    .mockImplementation(() => {})
process.exit = jest.fn(() => {
    throw 'mocked process exit'
})

describe('Validate outages', () => {
    test('valid outages returns false', async () => {
        const validation = runApp.validateOutageItems(mockAllOutagesItems)
        expect(validation.valid).toBe(true)
    })
    test('validate outages due to being empty returns true', async () => {
        const validation = runApp.validateOutageItems([] as OutageItem[])
        expect(validation.valid).toBe(false)
        expect(validation.reason).toBe('No outage items retrieved')
    })
    test('validate outages due to missing items returns true', async () => {
        const validation = runApp.validateOutageItems([
            { id: 'test' }
        ] as OutageItem[])
        expect(validation.valid).toBe(false)
        expect(validation.reason).toBe('Items missing required keys')
    })
})

describe('Validate siteinfo', () => {
    test('valid siteinfo returns false', async () => {
        const validation = runApp.validateSiteInfo(mockSiteInfo)
        expect(validation.valid).toBe(true)
    })
    test('validate siteinfo due to being empty returns true', async () => {
        const validation = runApp.validateSiteInfo({} as SiteInfo)
        expect(validation.valid).toBe(false)
        expect(validation.reason).toBe('Outage items missing keys')
    })
    test('validate siteinfo due to missing items returns true', async () => {
        const validation = runApp.validateSiteInfo({ name: 'test' } as SiteInfo)
        expect(validation.valid).toBe(false)
        expect(validation.reason).toBe('Outage items missing keys')
    })
})

describe('Test happy path', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mock.onGet(outagesURL).reply(200, mockAllOutagesItems)
        mock.onGet(siteInfoURL).reply(200, mockSiteInfo)
        mock.onPost(postURL).reply(200, mockPost)
        spyGetAllOutages.mockClear()
        spyValidateOutageItems.mockClear()
        spyGetSiteInfo.mockClear()
        spyValidateSiteInfo.mockClear()
        spyFilterEvents.mockClear()
        spyAssembleOutages.mockClear()
        spyPostOutages.mockClear()
        spyPrintErrorAndExit.mockClear()
        spyConsoleLog.mockClear()
        spyConsoleError.mockClear()
    })

    afterEach(() => {
        mock.reset()
    })

    test('Test functions called when successful', async () => {
        await runApp.appWrapper(siteId)

        expect(spyGetAllOutages).toBeCalledTimes(1)
        expect(spyGetAllOutages).toBeCalledWith()

        expect(spyValidateOutageItems).toBeCalledTimes(1)
        expect(spyValidateOutageItems).toBeCalledWith(mockAllOutagesItems)

        expect(spyGetSiteInfo).toBeCalledTimes(1)
        expect(spyGetSiteInfo).toBeCalledWith(siteId)

        expect(spyValidateSiteInfo).toBeCalledTimes(1)
        expect(spyValidateSiteInfo).toBeCalledWith(mockSiteInfo)

        expect(spyFilterEvents).toBeCalledTimes(1)
        expect(spyFilterEvents).toBeCalledWith(
            mockSiteInfo,
            mockAllOutagesItems
        )

        expect(spyAssembleOutages).toBeCalledTimes(1)
        expect(spyAssembleOutages).toBeCalledWith(
            mockSiteInfo,
            mockSpecificIdAndTimeOutagesItems
        )

        expect(spyPostOutages).toBeCalledTimes(1)
        expect(spyPostOutages).toBeCalledWith(siteId, mockAssembledEvents)

        expect(spyPrintErrorAndExit).toBeCalledTimes(0)

        expect(spyConsoleLog).toBeCalledTimes(1)
        expect(spyConsoleLog).toBeCalledWith(
            'Successfully updated endpoint with enhanced events'
        )
        expect(spyConsoleError).toBeCalledTimes(0)
    })
})

describe('Test some unhappy paths', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        spyGetAllOutages.mockClear()
        spyValidateOutageItems.mockClear()
        spyGetSiteInfo.mockClear()
        spyValidateSiteInfo.mockClear()
        spyFilterEvents.mockClear()
        spyAssembleOutages.mockClear()
        spyPostOutages.mockClear()
        spyPrintErrorAndExit.mockClear()
        spyConsoleLog.mockClear()
        spyConsoleError.mockClear()
    })

    afterEach(() => {
        mock.reset()
    })

    // more tests would be desirable
    test('Test functions called when network failure', async () => {
        mock.onGet(outagesURL).reply(500)
        mock.onGet(siteInfoURL).reply(200, mockSiteInfo)
        mock.onPost(postURL).reply(200, mockPost)

        try {
            await runApp.appWrapper(siteId)
        } catch (error) {
            expect(error).toBe('mocked process exit')
        }

        expect(spyGetAllOutages).toBeCalledTimes(1)
        expect(spyGetAllOutages).toBeCalledWith()

        expect(spyValidateOutageItems).toBeCalledTimes(0)
        expect(spyGetSiteInfo).toBeCalledTimes(0)
        expect(spyValidateSiteInfo).toBeCalledTimes(0)
        expect(spyFilterEvents).toBeCalledTimes(0)
        expect(spyAssembleOutages).toBeCalledTimes(0)
        expect(spyPostOutages).toBeCalledTimes(0)
        expect(spyPrintErrorAndExit).toBeCalledTimes(1)

        expect(spyConsoleError).toBeCalledTimes(1)
        expect(spyConsoleLog).toBeCalledTimes(0)
        expect(process.exit).toBeCalledTimes(1)
    })
})
