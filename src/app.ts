import { appWrapper } from './appHandlers/runApp'

export const main = async (siteId: string): Promise<void> => {
    console.log(`Requesting ${siteId}`)
    await appWrapper(siteId)
}

// CLI input, currently runs on single site id, would extend with CLI args
main('norwich-pear-tree')
