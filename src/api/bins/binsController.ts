import uniqid from 'uniqid'
import { bucket, firestore } from '../firebaseAdmin'
import type { NextApiRequest, NextApiResponse } from 'next'

export const binsRef = firestore.collection('bins')

const uploadBinToStorage = (content: string, name: string, mimetype: string) =>
  new Promise<string>((resolve, reject) => {
    const fileUpload = bucket.file(name)
    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: mimetype,
      },
    })

    blobStream.on('error', (error) => {
      console.error(error)
      reject('Something is wrong! Unable to upload at the moment.')
    })

    blobStream.on('finish', () => {
      resolve(
        `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`
      )
    })

    blobStream.end(content)
  })

export const createBin = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req
  const ref = binsRef.doc()

  const filename = `${body.files[0].filename}.${body.files[0].lang.fileExtension}`
  const fileUrl = await uploadBinToStorage(
    body.files[0].code,
    `bins/${ref.id}/${filename}`,
    'text/plain'
  ).catch((e) => {
    console.error(e)
    res.status(500).json({
      message: 'An internal error ocurred',
    })
  })

  const bin = {
    id: ref.id,
    author: body.author,
    files: [
      {
        id: uniqid(),
        name: filename,
        url: fileUrl,
        lang: body.files[0].lang,
      },
    ],
  }

  await ref.set(bin).catch((e) => {
    console.error(e)
    res.status(500).json({
      message: 'An internal error ocurred',
    })
  })

  res.status(200).json(bin)
}

export const getBin = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const bin = await binsRef.doc(query.binId as string).get()
  if (!bin.exists) {
    res.status(404).json({
      message: "This bin doesn't exists",
    })
  } else {
    res.status(200).json(bin.data())
  }
}
