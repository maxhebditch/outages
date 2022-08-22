import { getAllOutages } from '../apiHandlers/getOutageHandler'
import { getSiteInformation } from '../apiHandlers/getSiteInfoHandler'
import { filterEventsByTimeAndId } from '../processOutages/filterOutages'
import { OutageItem } from '../types/outageTypes'
import { SiteInfo } from '../types/siteInfoTypes'
import { ValidationOutcome } from '../types/validationTypes'

import { handlePostOutage } from '../apiHandlers/postOutageHandler'
import { assembleOutages } from '../processOutages/assembleOutages'

// Validates if the outage items received are the correct format
export const validateOutageItems = (
    outageItems: OutageItem[]
): ValidationOutcome => {
    if (outageItems.length === 0) {
        return {
            valid: false,
            reason: 'No outage items retrieved'
        } as ValidationOutcome
    }

    const itemCheck = outageItems.every((item): boolean => {
        if (item.begin && item.end && item.id) {
            return true
        }
        return false
    })

    if (!itemCheck) {
        return {
            valid: false,
            reason: 'Items missing required keys'
        } as ValidationOutcome
    }

    return {
        valid: true
    } as ValidationOutcome
}

// Validates if the site info received are the correct format
export const validateSiteInfo = (siteInfo: SiteInfo): ValidationOutcome => {
    if (siteInfo.id && siteInfo.name) {
        return {
            valid: true
        } as ValidationOutcome
    }
    return {
        valid: false,
        reason: 'Outage items missing keys'
    } as ValidationOutcome
}

// Resusable function to handle printing error messaging and exiting, easier to test too
export const printErrorAndExit = (message: string): void => {
    console.error(message)
    process.exit(1)
}

// Runs and coordinates the individual functions assessing returned data
export const appWrapper = async (siteId: string): Promise<void> => {
    let allOutages: OutageItem[] = []
    let siteInfo: SiteInfo = { id: '', name: '', devices: [] }

    //Step 1. Get all outages
    const outageResponse = await getAllOutages()
    if (outageResponse.success) {
        allOutages = outageResponse.data as OutageItem[]
    } else {
        const msg = `Failed to request outage data ${
            outageResponse.status ? `with status ${outageResponse.status}` : ''
        }`
        printErrorAndExit(msg)
    }

    //Step 2. Check the all outages data is correct
    const allOutagesValidation = validateOutageItems(allOutages)
    if (!allOutagesValidation.valid) {
        printErrorAndExit(
            `Invalid data returned from outage request: ${allOutagesValidation.reason}`
        )
    }

    //Step 3. Request info for a site
    const siteInfoResponse = await getSiteInformation(siteId)
    if (siteInfoResponse.success) {
        siteInfo = siteInfoResponse.data as SiteInfo
    } else {
        const msg = `Failed to request site info ${
            siteInfoResponse.status
                ? `with status ${siteInfoResponse.status}`
                : ''
        }`
        printErrorAndExit(msg)
    }

    //Step 4. Validate site info is as expected
    const siteInfoValidation = validateSiteInfo(siteInfo)
    if (!siteInfoValidation.valid) {
        printErrorAndExit(
            `Invalid data returned from site info request: ${siteInfoValidation.reason}`
        )
    }

    //Step 5. Filter out old events and ones that don't match the site devices
    const filteredEvents = filterEventsByTimeAndId(siteInfo, allOutages)
    if (filteredEvents.length === 0) {
        printErrorAndExit('No outage events available for enhancement')
    }

    //Step 6. Create the enhanced output by combining site information and filtered events
    const enhancedEvents = assembleOutages(siteInfo, filteredEvents)
    if (enhancedEvents.length === 0) {
        printErrorAndExit('No enhanced events available for posting')
    }

    //Step 7. Post the enhanced events to the endpoint
    const postEnhancedResponse = await handlePostOutage(siteId, enhancedEvents)
    if (postEnhancedResponse.success) {
        console.log('Successfully updated endpoint with enhanced events')
    } else {
        const msg = `Failed to post enhanced events ${
            postEnhancedResponse.status
                ? `with status ${postEnhancedResponse.status}`
                : ''
        }`
        printErrorAndExit(msg)
    }
}
