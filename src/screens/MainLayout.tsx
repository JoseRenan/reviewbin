import Head from 'next/head'
import { PropsWithChildren } from 'react'
import { Navbar } from './home/HomePage'

export const MainLayout = ({ children }: PropsWithChildren<{}>) => {
  return (
    <div>
      <Head>
        <title>ReviewBin</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      {children}
    </div>
  )
}
