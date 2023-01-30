import apiHelper from '../../src/utils/api-helper'
import * as Boom from '@hapi/boom'

export default apiHelper()
  .get((req, res) => {
    throw Boom.forbidden('Please sign in first')
  })
