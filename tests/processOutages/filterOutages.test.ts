import { mockAllOutagesItems, mockSiteInfo } from '../mocks/mockResponses'
import {
    mockValidOutagesItems,
    mockInvalidOutagesItems,
    mockSiteIds
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
