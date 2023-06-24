import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { HTTP_METHOD, isHTTPMethod } from 'next/dist/server/web/http'

import { errorHandler } from '@/pages/api/errorHandler'

export interface Data<T> {
  data: T
}
export type Handlers = {
  [key in HTTP_METHOD]?: NextApiHandler
}

export const handler = (handlers: Handlers) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req
    if (!method || !isHTTPMethod(method)) {
      return res.status(405).json({
        error: {
          message: `${req.method} method is not allowed`,
          statusCode: 405,
        },
      })
    }
    const handler = handlers[method]

    if (!handler) {
      return res.status(405).json({
        error: {
          message: `${req.method} method is not allowed`,
          statusCode: 405,
        },
      })
    }

    try {
      await handler(req, res)
    } catch (error) {
      console.log(error)
      errorHandler(error, res)
    }
  }
}
