import { appWrapper } from './appHandlers/runApp'

export const main = async (): Promise<void> => {
    appWrapper('kingfisher')
}
