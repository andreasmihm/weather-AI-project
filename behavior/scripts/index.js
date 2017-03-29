'use strict'

const getCompanyInfo = require('./lib/getCompanyInfo')

exports.handle = function handle(client) {
  const collectCompany = client.createStep({
    satisfied() {
      return Boolean(client.getConversationState().divaeCompany)
    },

    extractInfo() {
     const company = client.getFirstEntityWithRole(client.getMessagePart(), 'company')
      if (company) {
        client.updateConversationState({
          divaeCompany: company,
        })
        console.log('User wants the info about:', company.value)
      }
    },

    prompt() {
      client.addResponse('prompt/divae_company')
      client.done()
    },
  })

  const provideInformation = client.createStep({
    satisfied() {
      return false
    },

    prompt(callback) {
      const environment = client.getCurrentApplicationEnvironment()
      getCompanyInfo(client.getConversationState().divaeCompany.value, resultBody => {
        if (!resultBody) {
          console.log('Error getting info.')
          callback()
          return
        }

        const companyData = {
          headCount: resultBody.headCount,
          interns: resultBody.interns,
		  revenue: resultBody.revenue,
          company: resultBody.companyName,
        }

        console.log('sending company data:', companyData)
        client.addResponse('provide_company_information/current', companyData)
        client.done()

        callback()
      })
    },
  })

  client.runFlow({
    classifications: {},
    streams: {
      main: 'getCompanyInformation',
      getWeather: [collectCompany, provideInformation],
    }
  })
}
