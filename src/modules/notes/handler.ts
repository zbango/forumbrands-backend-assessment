import serverless from 'serverless-http'
import app from '../../app'
import router from './notes.routes'

app.use('/notes', router)

export const handler = serverless(app)