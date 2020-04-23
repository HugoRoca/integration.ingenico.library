const axios = require('axios')
const config = require('../config')

module.exports = class {
  async getSessionDetails() {
    return await axios.post(config.urlGetSessionDetails, { merchantId: config.merchantId })
  }
}
