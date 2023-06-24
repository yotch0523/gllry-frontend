import { z } from 'zod'

export const postImageSchema = z.object({
  userId: z.string().nonempty(),
  // tags: ...
  file: z.custom<FileList>().transform((file) => file[0]),
})
