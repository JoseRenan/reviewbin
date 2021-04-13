import { GetStaticProps } from 'next'
import { binsRef } from '../../src/api/bins/binsController'
import { bucket, firestore } from '../../src/api/firebaseAdmin'
import { BinFile } from '../../src/screens/bins/FilesTab'

export { BinPage as default } from '../../src/screens/bins/BinPage'

export async function getStaticPaths() {
  const snapshot = await firestore.collection('bins').get()
  const paths = snapshot.docs.map((doc) => ({ params: { id: doc.data().id } }))

  return { paths, fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const binId = context.params?.id as string
  const binResult = await binsRef.doc(binId).get()

  if (!binResult.exists) {
    return { notFound: true }
  }

  const bin = binResult.data()!

  const files = bin.files.map(async (file: BinFile) => {
    const fileRef = bucket.file(`bins/${binId}/${file.name}`)
    return { ...file, code: (await fileRef.download())[0].toString() }
  })

  bin.files = await Promise.all(files)

  return { props: { bin } }
}
