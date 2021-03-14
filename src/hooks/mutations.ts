import { FileComments } from '../screens/bins/FilesTab'
import { queryClient } from './../../pages/_app'
import { useMutation } from 'react-query'

export interface CommentInput {
  lineNumber: number
  fileId: string
  comment: {
    content: string
    author: string
  }
}

export const useAddCommentMutation = (binId: string) => {
  const mutation = useMutation(
    async (comment: CommentInput) => {
      queryClient.setQueryData<FileComments>(['reviews', binId], (old) => {
        if (!old) old = {}
        if (!old[comment.fileId]) old[comment.fileId] = {}
        if (!old[comment.fileId][comment.lineNumber])
          old[comment.fileId][comment.lineNumber] = []
        old[comment.fileId][comment.lineNumber].push(comment.comment)
        return old
      })

      const response = await fetch(`/api/bins/${binId}/reviews`, {
        method: 'POST',
        body: JSON.stringify(comment),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
      if (!response.ok) throw new Error('')
      return response.json()
    },
    {
      onSuccess: (newComment: CommentInput) => {
        queryClient.setQueryData<FileComments>(['reviews', binId], (old) => {
          old![newComment.fileId][newComment.lineNumber] = old![
            newComment.fileId
          ][newComment.lineNumber].map((comment) =>
            !comment.id ? newComment.comment : comment
          )
          return old!
        })
      },
    }
  )

  return mutation
}
