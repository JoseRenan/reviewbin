import { binsRef } from './../bins/binsController'
import admin, { database } from '../firebaseAdmin'
import type { NextApiRequest, NextApiResponse } from 'next'

export const reviewsRef = database.ref('reviews')

export const createReview = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { body, query } = req
  const bin = await binsRef.doc(query.binId as string).get()
  if (!bin.exists) {
    res.status(404).json({
      message: "This bin doesn't exists",
    })
  } else {
    const binReviewRef = reviewsRef
      .child(query.binId as string)
      .child('files')
      .child(body.fileId)
      .child(body.lineNumber)

    const newReview = await binReviewRef.push({
      author: body.comment.author,
      content: body.comment.content,
      timestamp: admin.database.ServerValue.TIMESTAMP,
    })

    res.status(201).json({
      id: newReview.key,
      fileId: body.fileId,
      lineNumber: body.lineNumber,
      comment: { ...body.comment, id: newReview.key },
    })
  }
}

export const createComment = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { body, query } = req
  const bin = await binsRef.doc(query.binId as string).get()
  if (!bin.exists) {
    res.status(404).json({
      message: "This bin doesn't exists",
    })
  } else {
    const binReviewRef = reviewsRef
      .child(query.binId as string)
      .child('comments')

    const newReview = await binReviewRef.push({
      author: body.author,
      content: body.content,
      timestamp: admin.database.ServerValue.TIMESTAMP,
    })

    res.status(201).json({
      author: body.author,
      content: body.content,
      id: newReview.key,
    })
  }
}

export const getReviewsFromBin = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { query } = req
  const bin = await binsRef.doc(query.binId as string).get()
  if (!bin.exists) {
    res.status(404).json({
      message: "This bin doesn't exists",
    })
  } else {
    const collection = await getFileReviews(query.binId as string)
    if (!collection) {
      res.status(200).json({})
    } else {
      const result: { [fileId: string]: { [lineNumber: string]: any[] } } = {}
      Object.keys(collection).forEach((fileId) => {
        const fileComments = collection[fileId]
        if (!result[fileId]) result[fileId] = {}
        Object.keys(fileComments).forEach((lineNumber) => {
          result[fileId][lineNumber] = Object.keys(
            fileComments[lineNumber]
          ).map((commentId) => ({
            ...fileComments[lineNumber][commentId],
            id: commentId,
          }))
        })
      })
      res.status(200).json(result)
    }
  }
}

export const getCommentList = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { query } = req
  const response = []
  const fileReviews = await getFileReviews(query.binId as string)
  if (fileReviews) {
    Object.keys(fileReviews).forEach((fileId) => {
      const fileComments = fileReviews[fileId]
      Object.keys(fileComments).forEach((lineNumber) => {
        const thread: any = {
          fileId,
          lineNumber,
          type: 'file',
          comments: { [lineNumber]: [] },
        }
        thread.comments[lineNumber].push(
          ...Object.keys(fileComments[lineNumber]).map((commentId, i) => {
            if (i === 0)
              thread.timestamp = fileComments[lineNumber][commentId].timestamp
            return {
              ...fileComments[lineNumber][commentId],
              id: commentId,
            }
          })
        )
        response.push(thread)
      })
    })
  }

  const comments = await getComments(query.binId as string)
  if (comments) {
    response.push(
      ...Object.keys(comments).map((commentId) => ({
        ...comments[commentId],
        id: commentId,
        type: 'comment',
      }))
    )
  }

  response.sort((a, b) => a.timestamp - b.timestamp)
  res.status(200).json(response)
}

export async function getFileReviews(binId: string) {
  const binReviewRef = reviewsRef.child(binId).child('files')
  return new Promise<{ [key: string]: any } | undefined>((resolve) => {
    binReviewRef.once('value', (snap) => {
      const collection = snap.val()
      if (!collection) {
        resolve(undefined)
      } else {
        resolve(collection)
      }
    })
  })
}

export async function getComments(binId: string) {
  const binReviewRef = reviewsRef.child(binId).child('comments')
  return new Promise<{ [key: string]: any } | undefined>((resolve) => {
    binReviewRef.once('value', (snap) => {
      const collection = snap.val()
      if (!collection) {
        resolve(undefined)
      } else {
        resolve(collection)
      }
    })
  })
}
