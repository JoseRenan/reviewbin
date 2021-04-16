import uniqid from 'uniqid'
import AdmZip from 'adm-zip'
import multer from 'multer'
import admin, { bucket, firestore } from '../firebaseAdmin'
import type { NextApiRequest, NextApiResponse } from 'next'
import initMiddleware from '../initMiddleware'

export const binsRef = firestore.collection('bins')

const upload = multer()

const multerAny = initMiddleware(upload.any())

export type NextApiRequestWithFormData = NextApiRequest & {
  files: any[]
}

type BlobCorrected = Blob & {
  buffer: Buffer
}

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
    name: body.name,
    author: body.author,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
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

export const uploadBinZip = async (
  req: NextApiRequestWithFormData,
  res: NextApiResponse
) => {
  await multerAny(req, res)

  // This operation expects a single file upload.
  if (!req.files?.length || req.files.length > 1) {
    res.status(400).json({ message: 'A .zip file expected' })
    return
  }

  const blob: BlobCorrected = req.files[0]

  var zip = new AdmZip(blob.buffer)
  var zipEntries = zip.getEntries()

  const ref = binsRef.doc()

  const promises = zipEntries.map(async (zipEntry) => {
    if (!zipEntry.isDirectory) {
      const fileUrl = await uploadBinToStorage(
        zipEntry.getData().toString('utf8'),
        `bins/${ref.id}/${zipEntry.entryName}`,
        'text/plain'
      ).catch((e) => {
        console.error(e)
        res.status(500).json({
          message: 'An internal error ocurred',
        })
      })

      const fileExtension = zipEntry.entryName.split('.')

      return {
        id: uniqid(),
        name: zipEntry.entryName,
        url: fileUrl,
        lang: {
          name:
            fileExtension.length > 1
              ? fileExtension[fileExtension.length - 1]
              : 'plaintext',
        },
      }
    }
  })

  const files = await Promise.all(promises)
  const author = {
    name: req.body['author.name'],
    photoUrl: req.body['author.photoUrl'],
  }

  const bin = {
    id: ref.id,
    files: files.filter((file) => file !== undefined),
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    name: req.body.name,
    author: {
      ...author,
      ...(req.body['author.email'] && req.body['author.uid']
        ? {
            email: req.body['author.email'],
            uid: req.body['author.uid'],
          }
        : {}),
    },
  }

  await ref.set(bin).catch((e) => {
    console.error(e)
    res.status(500).json({
      message: 'An internal error ocurred',
    })
  })

  res.status(201).json({ ...bin, timestamp: undefined })
}

export const getBin = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const bin = await binsRef.doc(query.binId as string).get()
  if (!bin.exists) {
    res.status(404).json({
      message: "This bin doesn't exists",
    })
  } else {
    res.status(200).json({
      ...bin.data(),
      timestamp: bin.data()?.timestamp.toMillis(),
    })
  }
}
