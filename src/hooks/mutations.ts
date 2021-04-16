import { Comment } from './../screens/bins/CommentsTab'
import { FileComments } from '../screens/bins/FilesTab'
import { queryClient } from './../../pages/_app'
import { useMutation } from 'react-query'
import { FileThread } from '../screens/bins/CommentsTab'
import { Auth } from './useGoogleAuth'

export interface FileReviewInput {
  lineNumber: number
  fileId: string
  comment: {
    content: string
    author: Auth
  }
}

export const useAddFileReviewMutation = (binId: string) => {
  const mutation = useMutation(
    async (comment: FileReviewInput) => {
      queryClient.setQueryData<FileComments>(['reviews', binId], (old) => {
        if (!old) old = {}
        if (!old[comment.fileId]) old[comment.fileId] = {}
        if (!old[comment.fileId][comment.lineNumber])
          old[comment.fileId][comment.lineNumber] = []
        old[comment.fileId][comment.lineNumber].push(comment.comment)
        return old
      })
      queryClient.setQueryData<Array<FileThread | Comment>>(
        ['comments', binId],
        (old) => {
          if (!old) old = []
          const threadIndex = old.findIndex(
            (thread) =>
              thread.type === 'file' &&
              thread.fileId === comment.fileId &&
              +thread.lineNumber === comment.lineNumber
          )
          if (threadIndex === -1) {
            old.push({
              comments: { [comment.lineNumber]: [comment.comment] },
              type: 'file',
              fileId: comment.fileId,
              lineNumber: `${comment.lineNumber}`,
            })
          } else {
            ;(old[threadIndex] as FileThread).comments[comment.lineNumber].push(
              comment.comment
            )
          }
          return old
        }
      )

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
      onSuccess: (newComment: FileReviewInput) => {
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

export const useAddCommentMutation = (binId: string) => {
  const mutation = useMutation(
    async (comment: Comment) => {
      queryClient.setQueryData<Array<FileThread | Comment>>(
        ['comments', binId],
        (old) => {
          if (!old) old = []
          old.push({ ...comment, type: 'comment' })
          return old
        }
      )

      const response = await fetch(`/api/bins/${binId}/comments`, {
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
      onSuccess: (newComment: Comment) => {
        queryClient.setQueryData<Array<FileThread | Comment>>(
          ['comments', binId],
          (old) => {
            old!.map((comment) =>
              !(comment as Comment).id ? newComment : comment
            )
            return old!
          }
        )
      },
    }
  )

  return mutation
}
