import { bucket, db } from './firebase'
import type { NextApiRequest, NextApiResponse } from 'next'

export const binsRef = db.collection('bins')

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

const createBin = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req
  const ref = binsRef.doc()

  const filename = `bins/${ref.id}/${body.files[0].filename}.${body.files[0].lang.fileExtension}`
  const fileUrl = await uploadBinToStorage(
    body.files[0].code,
    filename,
    'text/plain'
  ).catch((e) => console.log(e))

  const bin = {
    id: ref.id,
    author: body.author,
    files: [{ name: filename, url: fileUrl }],
  }

  await ref.set(bin).catch((e) => console.error(e))

  res.status(200).json(bin)
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'POST':
      await createBin(req, res)
      break
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
