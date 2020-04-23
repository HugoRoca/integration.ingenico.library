module.exports = class {
  constructor(sessionDetails, cardDetails, paymentDetails) {
    this.cardDetails = cardDetails
    this.paymentDetails = paymentDetails
    this.session = this.createSession(sessionDetails)
  }

  createSession(sessionDetails) {
    const details = sessionDetails.data
    return new connectsdk.Session({
      clientSessionId: details.body.clientSessionId,
      customerId: details.body.customerId,
      clientApiUrl: details.body.clientApiUrl,
      assetUrl: details.body.assetUrl
    })
  }

  async getIinDetails() {
    return new Promise((resolve, reject) => {
      this.session.getIinDetails(this.cardDetails.cardNumber, this.paymentDetails).then(iinDetailsResponse => {
        if (iinDetailsResponse.status !== "SUPPORTED") {
          console.error("Card check error: " + iinDetailsResponse.status);
          resolve(false)
        }
        resolve(iinDetailsResponse)
      }, error => {
        console.log('getIinDetails', error)
        reject(error)
      })
    })
  }

  async getPaymentProduct(iinDetailsResponse) {
    return new Promise((resolve, reject) => {
      this.session.getPaymentProduct(iinDetailsResponse.paymentProductId, this.paymentDetails).then(paymentProduct => {
        let paymentRequest = this.session.getPaymentRequest()
        paymentRequest.setPaymentProduct(paymentProduct)
        paymentRequest.setValue("cardNumber", this.cardDetails.cardNumber)
        paymentRequest.setValue("cvv", this.cardDetails.cvv)
        paymentRequest.setValue("expiryDate", this.cardDetails.expiryDate)
        if (!paymentRequest.isValid()) {
          console.error('error', paymentRequest.getErrorMessageIds())
          resolve(false)
        }
        resolve(paymentRequest)
      }, error => {
        console.log('getPaymentProduct', error)
        reject(error)
      })
    })
  }

  async getEncryptor(paymentRequest) {
    return new Promise((resolve, reject) => {
      this.session.getEncryptor().encrypt(paymentRequest).then(paymentHash => {
        resolve(paymentHash)
      }, error => {
        console.error('Failed encrypting the payload, check your credentials');
        console.log('getEncryptor', error)
        reject(error)
      })
    });
  }
}
