import type { AppProps } from 'next/app'
import React, { useState, useEffect } from 'react'
import LandingPageLayout from 'layout/index'
import NextNProgress from 'nextjs-progressbar'
import { SSRProvider } from 'react-bootstrap'
import { GlobalContext } from 'globalContext'
import 'bootstrap/dist/css/bootstrap.css'
import 'theme/global.scss'
import Head from 'next/head'
import { SessionProvider } from 'next-auth/react'

const MainApp = ({ Component, pageProps }: AppProps) => {
  const [flag,setFlag] = useState<boolean>(false)
  const [isLoggedIn, setIsLoggedIn] = useState(
    typeof window !== 'undefined' &&
      window.localStorage.getItem('token') !== null &&
      window.localStorage.getItem('token') !== '' &&
      window.localStorage.getItem('token') !== undefined
  )
  const [isWindow, setIsWindow] = useState<Boolean>(false)
  const [userData, setUserData] = useState(
    JSON.parse(
      (typeof window !== 'undefined' &&
        window.localStorage.getItem('userData')) ||
        '{}'
    )
  )

  const setLoginData = (data: { loginActivity: string | any[] }) => {
    setUserData(data)
    window.localStorage.setItem('userData', JSON.stringify(data))
  }
  const setUserToken = (data: string) => {
    window.localStorage.setItem('token', data)
  }

  useEffect(() => {
    if (typeof window !== undefined) {
      setIsWindow(true)
    }
  }, [])

  return (
    <>
      {isWindow && (
        <SessionProvider session={pageProps.session}>
          <GlobalContext.Provider
            value={{
              setLoginData,
              setUserToken,
              isLoggedIn,
              setIsLoggedIn,
              userData,
              setUserData,
              setFlag,
              flag
            }}
          >
            <SSRProvider>
              <Head>
                <title>HONEYED</title>
              </Head>
              <LandingPageLayout>
                <NextNProgress
                  height={5}
                  color="#0010f1"
                  options={{
                    showSpinner: false,
                  }}
                />
                <Component {...pageProps} />
              </LandingPageLayout>
            </SSRProvider>
          </GlobalContext.Provider>
        </SessionProvider>
      )}
    </>
  )
}

export default MainApp
