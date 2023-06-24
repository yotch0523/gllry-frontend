import { PassThrough, Writable } from 'stream'
import { formidable, Files, Fields } from 'formidable'
import VolatileFile from 'formidable/VolatileFile'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

import { handler } from '@/pages/api/handler'
import { initContainerClient } from '@/services/storage'

export const config = {
  api: {
    bodyParser: false,
    responseLimit: '15mb'
  },
}

const storageContainerName = 'user-images'

const postHandler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  try {
    const userId =
      req.headers instanceof Headers
        ? req.headers.get('user-id')
        : req.headers['user-id']
    if (!(typeof userId === 'string'))
      return res.status(401).send({ message: 'Unauthorized' })
    const contentType =
      req.headers instanceof Headers
        ? req.headers.get('content-type')
        : req.headers['content-type']

    // upload blob
    if (contentType?.includes('multipart/form-data')) {
      const { files } = await parseMultipleNodeRequest(userId, req)
      // request for saving to db ...
      const response = await save(userId, files, req)
    } else {
      // body = await readBody(req)
    }
    res.status(200).send(
      {
        message: 'Success',
        data: {
          userId,
          percentage: 100,
          isCompleted: true,
        }
      })
  } catch (error) {
    console.log('error has occured ', error)
    return { isSuccess: false }
  }
}

const parseMultipleNodeRequest = (
  userId: string,
  req: NextApiRequest,
): Promise<{ fields: Fields; files: Files }> => {
  return new Promise((resolve, reject) => {
    const uploads: Promise<void>[] = []
    const containerClient = initContainerClient(storageContainerName)
    const fileWriteStreamHandler = (file?: VolatileFile): Writable => {
      if (!file) throw Error('file is empty')
      const body = new PassThrough()
      const fileInfo = file.toJSON()
      const blobClient = containerClient.getBlockBlobClient(
        `${userId}/${fileInfo.newFilename}`,
      )
      const upload = blobClient.uploadStream(body)
      const uploadRequest = upload.then((response) => {
        console.log('upload status ', response._response.status)
      })
      uploads.push(uploadRequest)
      return body
    }
    const form = formidable({
      multiples: true,
      fileWriteStreamHandler: fileWriteStreamHandler,
    })
    form.parse(req, (error, fields, files) => {
      if (error) {
        reject(error)
        return
      }
      Promise.all(uploads)
        .then(() => {
          resolve({ fields, files })
        })
        .catch(reject)
    })
  })
}

const save = async (userId: string, files: Files, req: NextApiRequest) => {
  // set header
  const requestHeaders: HeadersInit = new Headers()
  const authorizationHeader =
    req.headers instanceof Headers
      ? req.headers.get('authorization')
      : req.headers.authorization
  requestHeaders.set('Access-Control-Allow-Credentials', 'true')
  requestHeaders.set(
    'Access-Control-Allow-Origin',
    process.env.IMAGE_API_BASE_URL ?? '',
  )
  requestHeaders.set('x-functions-key', process.env?.IMAGE_FUNCTIONS_KEY ?? '')
  requestHeaders.set('Authorization', authorizationHeader ?? '')
  // request API
  const formData = new FormData()
  formData.append('userId', userId)
  formData.append('files', JSON.stringify(files['file']))
  const endpoint = `${process.env.IMAGE_API_BASE_URL}/api/image`

  return await fetch(endpoint, {
    method: req.method,
    headers: requestHeaders,
    body: formData,
  })
}

export default handler({
  POST: postHandler,
})
