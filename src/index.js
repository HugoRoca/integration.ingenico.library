const InitializeRepository = require('./repositories/initialize.repository')
const SessionRepository = require('./repositories/session.repository')

class Payment {
  constructor(paymentDetails, cardDetails) {
    this.paymentDetails = paymentDetails
    this.cardDetails = cardDetails
  }

  async processEncrytp() {
    const initializeRepository = new InitializeRepository()
    const sessionDetails = await initializeRepository.getSessionDetails()
    const sessionRepository = new SessionRepository(sessionDetails, this.cardDetails, this.paymentDetails)
    const iinDetailsResponse = await sessionRepository.getIinDetails()
    if (!iinDetailsResponse) return
    const paymentRequest = await sessionRepository.getPaymentProduct(iinDetailsResponse)
    if(!paymentRequest) return
    return await sessionRepository.getEncryptor(paymentRequest)
  }
}

module.exports = Payment
