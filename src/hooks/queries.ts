import { Bin, FileComments } from '../screens/bins/FilesTab'
import { storage } from './../screens/firebaseClient'
import { useQuery } from 'react-query'

export const useFileQuery = (fileUrl: string) =>
  useQuery<string>(['file', fileUrl], async () => {
    const ref = storage.refFromURL(fileUrl)
    const authorizedUrl = await ref.getDownloadURL()
    const response = await fetch(authorizedUrl)
    if (!response.ok) throw new Error('An error ocurred')
    return response.text()
  })

export const useReviewsQuery = (binId: string) =>
  useQuery<FileComments>(
    ['reviews', binId],
    async () => {
      const response = await fetch(`/api/bins/${binId}/reviews`)
      if (!response.ok) throw new Error('An error ocurred')
      return response.json()
    },
    {
      enabled: !!binId,
    }
  )

export const useCommentsQuery = (binId: string) =>
  useQuery<FileComments>(
    ['comments', binId],
    async () => {
      const response = await fetch(`/api/bins/${binId}/comments`)
      if (!response.ok) throw new Error('An error ocurred')
      return response.json()
    },
    {
      enabled: !!binId,
    }
  )

export const useBinQuery = (binId: string) =>
  useQuery<Bin>(
    ['bin', binId],
    async () => {
      const response = await fetch(`/api/bins/${binId}`)
      if (!response.ok) throw new Error('An error ocurred')
      return response.json()
    },
    {
      enabled: !!binId,
    }
  )
