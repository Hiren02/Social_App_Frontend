import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import { GtmScript, NoScript } from 'scripts/gtm'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <GtmScript />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
        <NoScript />
      </Html>
    )
  }
}

MyDocument.getInitialProps = async (ctx) => {
  const originalRenderPage = ctx.renderPage

  // Run the React rendering logic synchronously
  ctx.renderPage = () =>
    originalRenderPage({
      // Useful for wrapping the whole react tree
      enhanceApp: (App) => App,
      // Useful for wrapping in a per-page basis
      enhanceComponent: (Component) => Component,
    })

  // Run the parent `getInitialProps`, it now includes the custom `renderPage`
  const initialProps = await Document.getInitialProps(ctx)
  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [...React.Children.toArray(initialProps.styles)],
  }
}

export default MyDocument
