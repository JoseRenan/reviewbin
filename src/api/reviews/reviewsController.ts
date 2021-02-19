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
      .child(body.fileId)
      .child(body.lineNumber)

    const newReview = await binReviewRef.push({
      author: body.comment.author,
      content: body.comment.content,
    })

    res.status(201).json({
      id: newReview.key,
      ...body.comment,
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
    const binReviewRef = reviewsRef.child(query.binId as string)

    await binReviewRef.once('value', (snap) => {
      const collection = snap.val()
      const result: { [fileId: string]: { [lineNumber: string]: any[] } } = {}
      Object.keys(collection).forEach((fileId) => {
        const fileComments = collection[fileId]
        if (!result[fileId]) result[fileId] = {}
        Object.keys(fileComments).forEach((lineNumber) => {
          if (!result[fileId][lineNumber]) result[fileId][lineNumber] = []
          result[fileId][lineNumber].push({ ...fileComments[lineNumber] })
        })
      })
      res.status(200).json(result)
    })
  }
}
