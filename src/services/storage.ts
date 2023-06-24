import { DefaultAzureCredential } from '@azure/identity'
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob'

export const initContainerClient = (containerName: string): ContainerClient => {
  if (!containerName) throw Error('Target container is not found')
  const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME
  if (!accountName) throw Error('Target storage account is not found.')

  const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    new DefaultAzureCredential(),
  )
  return blobServiceClient.getContainerClient(containerName)
}
