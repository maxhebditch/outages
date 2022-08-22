import { appWrapper } from './appHandlers/runApp'

export const main = async (siteId: string): Promise<void> => {
    console.log(`Requesting ${siteId}`)
    await appWrapper(siteId)
}

main('norwich-pear-tree')
