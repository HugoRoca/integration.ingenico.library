const _ = require('lodash')

class Payment {
  constructor(sessionDetails, paymentDetails, cardDetails) {
    this.sessionDetails = sessionDetails
    this.paymentDetails = paymentDetails
    this.cardDetails = cardDetails

    this.session = this.createSession()
    console.log(this.session);

  }

  createSession() {
    return new connectsdk.Session({
      clientSessionId: this.sessionDetails.clientSessionId,
      customerId: this.sessionDetails.customerId,
      clientApiUrl: this.sessionDetails.clientApiUrl,
      assetUrl: this.sessionDetails.assetUrl
    })
  }

  async processPayment() {
    // const iinDetailsResponse = await this.getIinDetails()
    // if (iinDetailsResponse.status !== 'SUPPORTED') {
    //   console.error("Card check error: " + iinDetailsResponse.status)
    //   document.querySelector('.output').innerText = 'Something went wrong, check the console for more information.'
    //   return
    // }
    // console.log('iinDetailsResponse', iinDetailsResponse);
    const paymentProduct = this.getPaymentProduct()
    console.log(paymentProduct);
  }

  getPaymentProduct() {
    this.session.getPaymentProduct('1', this.paymentDetails).then((paymentProduct) => {
      return paymentProduct
    }, (error) => {
      console.log('paymentProduct', error);
    })
  }

  async getIinDetails() {
    return new Promise((resolve, reject) => {
      this.session.getIinDetails(this.cardDetails.cardNumber, this.paymentDetails).then((iinDetailsResponse) => {
        resolve(iinDetailsResponse)
      }, (error) => {
        console.log(error)
        reject(error)
      })
    });
  }

  // getEncryptor() {
  //   let encryptor = this.session.getEncryptor
  //   encryptor.encrypt(paymentRequest).then((encryptedString) => {

  //   }, (errors) => {

  //   })
  // }
}

module.exports = Payment
