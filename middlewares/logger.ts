import express from 'express'


const appLogger = (req: express.Request, res: express.Response, next: express.NextFunction) => {

  const url = req.url
  const method = req.method
  const date = new Date().toLocaleDateString()
  const time = new Date().toLocaleTimeString()

  let result: string = `${method} request for ${url} at ${time} - ${date}`

  console.log(result)

  next()
}

export default appLogger