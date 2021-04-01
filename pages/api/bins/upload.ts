import {
  NextApiRequestWithFormData,
  uploadBinZip,
} from '../../../src/api/bins/binsController'
import { NextApiResponse } from 'next'

export default async (
  req: NextApiRequestWithFormData,
  res: NextApiResponse
) => {
  switch (req.method) {
    case 'POST':
      await uploadBinZip(req, res)
      break
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
