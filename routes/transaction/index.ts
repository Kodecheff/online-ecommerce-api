import express from 'express'

const router: express.Router = express.Router()


router.get('/paystack/initialize', async (req: express.Request, res: express.Response) => {
  const https = require('https')

  const params = JSON.stringify({
    "email": "customer@email.com",
    "amount": 2000 * 100 
  })

  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: '/transaction/initialize',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json'
    }
  }

  const paystackReq = https.request(options, paystackRes => {
    let data = ''

    paystackRes.on('data', (chunk) => {
      data += chunk
    });

    paystackRes.on('end', () => {
      console.log(JSON.parse(data))

      res.json(JSON.parse(data))
    })
  }).on('error', error => {
    console.error(error)
    res.json({msg: error})
  })

  paystackReq.write(params)
  paystackReq.end()
})

export default router