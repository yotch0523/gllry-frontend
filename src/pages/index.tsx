import type { NextPage } from 'next'
import { useState } from 'react'
import useFetchWithMsal from '@/hooks/useFetchWithMsal'

type ApiConfig = {
  b2cScopes: string[]
}
const config: ApiConfig = {
  b2cScopes: process.env.NEXT_PUBLIC_IMAGE_API_WRITE_SCOPE
    ? [process.env.NEXT_PUBLIC_IMAGE_API_WRITE_SCOPE]
    : [],
}

const Page: NextPage = () => {
  const [message, setMessage] = useState('')
  const { error, execute } = useFetchWithMsal({
    scopes: config.b2cScopes,
  })
  const handleUploadClick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('file', file)

    try {
      await execute('POST', '/api/image', formData)
      setMessage('画像のアップロードに成功しました。')
    } catch (e) {
      console.log(e)
      setMessage(error?.message ?? '画像のアップロードに失敗しました。')
    }
  }
  return (
    <>
      <div>home</div>
      <span className="text-red-600">{message}</span>
      <div>
        <label htmlFor="upload-button">
          <input
            accept="image/*"
            id="upload-button"
            type="file"
            onChange={handleUploadClick}
            hidden
          />
          choose file
        </label>
      </div>
    </>
  )
}

export default Page
