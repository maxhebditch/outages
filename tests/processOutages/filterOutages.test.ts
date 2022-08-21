import { mockAllOutagesItems, mockSiteInfo } from '../mocks/mockResponses'
import {
    mockValidOutagesItems,
    mockInvalidOutagesItems,
    mockSiteIds,
    mockSpecificIdOutagesItems,
    mockSpecificIdAndTimeOutagesItems
} from '../mocks/mockFiltering'
import * as filterOutages from '../../src/processOutages/filterOutages'
import { OutageItem } from '../../src/types/outageTypes'
import { SiteDevice, SiteInfo } from '../../src/types/siteInfoTypes'

const filterDate = new Date('2022-01-01T00:00:00.000Z')

describe('Filtering by date', () => {
    test('Test filtering dates mix', async () => {
        const returned = filterOutages.filterEventsBefore(
            filterDate,
            mockAllOutagesItems
        )
        expect(returned).toEqual(mockValidOutagesItems)
    })
    test('Test filtering dates only valid', async () => {
        const returned = filterOutages.filterEventsBefore(
            filterDate,
            mockValidOutagesItems
        )
        expect(returned).toEqual(mockValidOutagesItems)
    })
    test('Test filtering dates only invalid', async () => {
        const expected = [] as OutageItem[]
        const returned = filterOutages.filterEventsBefore(
            filterDate,
            mockInvalidOutagesItems
        )
        expect(returned).toEqual(expected)
    })
})

describe('Extract Ids from site info', () => {
    test('Test extract ids', async () => {
        const returned = filterOutages.extractSiteId(mockSiteInfo)
        expect(returned).toEqual(mockSiteIds)
    })
    test('Test extract ids missing', async () => {
        const returned = filterOutages.extractSiteId({
            devices: [] as SiteDevice[]
        } as SiteInfo)
        expect(returned).toEqual([])
    })
})

describe('Filter outages by id', () => {
    test('Test filtering outages by id', async () => {
        const returned = filterOutages.filterEventsWithIds(
            mockSiteIds,
            mockAllOutagesItems
        )
        expect(returned).toEqual(mockSpecificIdOutagesItems)
    })
    test('Test no match ids', async () => {
        const returned = filterOutages.filterEventsWithIds(
            ['RANDOM_ID'],
            mockAllOutagesItems
        )
        expect(returned).toEqual([])
    })
    test('Test no provided ids', async () => {
        const returned = filterOutages.filterEventsWithIds(
            [],
            mockAllOutagesItems
        )
        expect(returned).toEqual([])
    })
})

describe('Test filterEventsByTimeAndId', () => {
    test('Test with ids and events', async () => {
        const returned = filterOutages.filterEventsByTimeAndId(
            mockSiteInfo,
            mockAllOutagesItems
        )
        expect(returned).toEqual(mockSpecificIdAndTimeOutagesItems)
    })
    test('Test with no ids and events returns empty array', async () => {
        const returned = filterOutages.filterEventsByTimeAndId(
            {
                devices: [] as SiteDevice[]
            } as SiteInfo,
            mockAllOutagesItems
        )
        expect(returned).toEqual([])
    })
    test('Test ids and no events returns empty array', async () => {
        const returned = filterOutages.filterEventsByTimeAndId(
            mockSiteInfo,
            [] as OutageItem[]
        )
        expect(returned).toEqual([])
    })
    test('Test no ids and no events returns empty array', async () => {
        const returned = filterOutages.filterEventsByTimeAndId(
            {
                devices: [] as SiteDevice[]
            } as SiteInfo,
            [] as OutageItem[]
        )
        expect(returned).toEqual([])
    })
})
