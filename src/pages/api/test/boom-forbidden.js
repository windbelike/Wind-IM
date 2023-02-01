import { apiHandler } from '../../../utils/server-utils'
import * as Boom from '@hapi/boom'

export default apiHandler()
  .get((req, res) => {
    throw Boom.forbidden('Please sign in first')
  })
