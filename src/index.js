const _ = require('lodash')
const axios = require('axios')
const config = require('./config')

class Payment {
  constructor(paymentDetails, cardDetails, output) {
    this.paymentDetails = paymentDetails
    this.cardDetails = cardDetails
    this.output = output
  }

  getSessionDetails() {
    axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*'
    return axios.post(config.urlGetSessionDetails, { merchantId: config.merchantId })
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

  getIinDetails(session) {
    return session.getIinDetails(this.cardDetails.cardNumber, this.paymentDetails)
  }

  getPaymentProduct(session, iinDetailsResponse) {
    return session.getPaymentProduct(iinDetailsResponse.paymentProductId, this.paymentDetails)
  }

  getEncryptor(session, paymentRequest) {
    return session.getEncryptor().encrypt(paymentRequest)
  }

  processPayment() {
    this.getSessionDetails().then((sessionDetails) => {
      const session = this.createSession(sessionDetails)
      this.getIinDetails(session).then((iinDetailsResponse) => {
        if (iinDetailsResponse.status !== "SUPPORTED") {
          console.error("Card check error: " + iinDetailsResponse.status);
          return;
        }
        this.getPaymentProduct(session, iinDetailsResponse).then((paymentProduct) => {
          let paymentRequest = session.getPaymentRequest()
          paymentRequest.setPaymentProduct(paymentProduct)
          paymentRequest.setValue("cardNumber", this.cardDetails.cardNumber)
          paymentRequest.setValue("cvv", this.cardDetails.cvv)
          paymentRequest.setValue("expiryDate", this.cardDetails.expiryDate)

          if (!paymentRequest.isValid()) {
            console.error('error', paymentRequest.getErrorMessageIds())
          } else {
            this.getEncryptor(session, paymentRequest).then((paymentHash) => {
              console.log(paymentHash)
              return paymentHash
            }, (error) => {
              console.error('Failed encrypting the payload, check your credentials');
              console.log('getEncryptor', error)
            })
          }
        }, (error) => {
          console.log('getPaymentProduct', error)
        })
      }, (error) => {
        console.log('getIinDetails', error)
      })
    }, (error) => {
      console.log('getSessionDetails', error)
    })
  }
}

module.exports = Payment
