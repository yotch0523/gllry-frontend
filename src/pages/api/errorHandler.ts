import { NextApiResponse } from 'next'

export const errorHandler = (error: any, res: NextApiResponse) => {
  return res.status(error?.statusCode ?? 500).json({ error })
}
