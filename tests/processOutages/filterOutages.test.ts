import { mockAllOutagesItems } from '../mocks/mockResponses'
import {
    mockValidOutagesItems,
    mockInvalidOutagesItems
} from '../mocks/mockFiltering'
import * as filterOutages from '../../src/processOutages/filterOutages'
import { OutageItem } from '../../src/types/outageTypes'

const filterDate = new Date('2022-01-01T00:00:00.000Z')

describe('happy path', () => {
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
