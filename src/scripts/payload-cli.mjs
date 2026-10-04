import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { config as loadDotEnv } from 'dotenv'

loadDotEnv({ path: path.join(process.cwd(), '.env.local') })
loadDotEnv({ path: path.join(process.cwd(), '.env') })

const payloadBin = pathToFileURL(path.join(process.cwd(), 'node_modules', 'payload', 'bin.js')).href
await import(payloadBin)
