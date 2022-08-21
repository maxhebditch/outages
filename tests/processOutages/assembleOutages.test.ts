import { mockSiteInfo } from '../mocks/mockResponses'
import {
    mockSpecificIdAndTimeOutagesItems,
    mockmapIdToName,
    mockAssembledEvents
} from '../mocks/mockFiltering'
import * as assembleOutages from '../../src/processOutages/assembleOutages'
import { SiteDevice, SiteInfo } from '../../src/types/siteInfoTypes'

describe('Test Mapping Name to ID', () => {
    test('Test with usable name and id', async () => {
        const returned = assembleOutages.mapIdToName(mockSiteInfo)
        expect(returned).toEqual(mockmapIdToName)
    })
    test('Test with no site info', async () => {
        const returned = assembleOutages.mapIdToName({
            devices: [] as SiteDevice[]
        } as SiteInfo)
        expect(returned).toEqual({})
    })
})

describe('Assemble Outages using addNameToEvent', () => {
    test('add name to event', async () => {
        const returned = assembleOutages.addNameToEvent(
            mockmapIdToName,
            mockSpecificIdAndTimeOutagesItems
        )
        expect(returned).toEqual(mockAssembledEvents)
    })
})

describe('Assemble Outages', () => {
    test('Test using assembleOutages', async () => {
        const returned = assembleOutages.assembleOutages(
            mockSiteInfo,
            mockSpecificIdAndTimeOutagesItems
        )
        expect(returned).toEqual(mockAssembledEvents)
    })
})
