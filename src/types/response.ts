export type Response<T> = {
  isSuccess: boolean
  message: string
  data: T[]
}
