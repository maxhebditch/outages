import { mockAllOutagesItems } from '../mocks/mockResponses'
import { mockFilteredOutagesItems } from '../mocks/mockFiltering'
import * as filterOutages from '../../src/processOutages/filterOutages'

const filterDate = new Date('2022-01-01T00:00:00.000Z')

describe('happy path', () => {
    test('Test filtering dates', async () => {
        const expected = mockFilteredOutagesItems
        const returned = filterOutages.filterEventsBefore(
            filterDate,
            mockAllOutagesItems
        )
        expect(returned).toEqual(expected)
    })
})
