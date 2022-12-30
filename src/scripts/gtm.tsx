import { gtmKey } from 'services/config'

const gtmScriptFun = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmKey}')`

const GtmScript = () => (
  <script
    type="text/javascript"
    data-cfasync="false"
    dangerouslySetInnerHTML={{ __html: gtmScriptFun }}
  />
)

const SparkLoopScript = () => (
  <script
    async
    src="https://dash.sparkloop.app/widget/MF4fcde86b8f/embed.js"
    data-sparkloop
  />
)
const NoScript = () => (
  <iframe
    title="gtm_noscript"
    src={`https://www.googletagmanager.com/ns.html?id=${gtmKey}`}
    height="0"
    width="0"
    style={{ display: 'none', visibility: 'hidden' }}
  />
)
export { GtmScript, NoScript, SparkLoopScript }
