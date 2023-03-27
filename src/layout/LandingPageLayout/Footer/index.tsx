import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    // <footer>
    //   <div className="wrapper">
    //     <small>
    //       &copy;2022 <strong>Nayan Sarvaiya</strong>, All Rights Reserved
    //     </small>
    //     <nav className="footer-nav">
    //       <Link href="#">Back to Top</Link>
    //       <Link href="#">Terms of Use</Link>
    //       <Link href="#">Privacy</Link>
    //     </nav>
    //   </div>
    // </footer>
    <p
      style={{
        textAlign: 'center',
        marginTop: '10px',
        fontWeight: '300',
        color: '#101010',
      }}
    >
      {' '}
      &copy;2022-23 <strong>Hiren Chavda</strong>, All Rights Reserved
    </p>
  )
}

export default Footer
