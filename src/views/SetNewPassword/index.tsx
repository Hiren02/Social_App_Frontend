import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { CardHeader } from '@mui/material'
import toast from 'helpers/toast'
import { ToastContainer } from 'react-toastify'
import { useRouter } from 'next/router'
import { setNewPassword } from 'services/webservices/user/api'

const SetNewUpdatepassword = () => {
  const [UpdatePassword, setUpdatePassword] = useState<string>('')
  const [confirmPassword, setconfirmPassword] = useState<string>('')
  const [btnhide, setBtnhide] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const router = useRouter()
  // const [verifyLink, setVerifyLink] = useState<string>('')

  //   console.log('verifyLink', verifyLink)
  useEffect(() => {
    ;(async () => {
      if (UpdatePassword === confirmPassword) {
        setBtnhide(false)
      } else {
        setBtnhide(true)
      }
    })()
  }, [UpdatePassword, confirmPassword])

  const ForgotPassword = async (e) => {
    e.preventDefault()

    // setVerifyLink(router.asPath.split('/')[2])
    const linkverify = router.asPath.split('/')[2]
    // console.log('router', router)
    // console.log('verifyLink', linkverify)
    // console.log('UpdatePassword', UpdatePassword)

    if (UpdatePassword == '' || confirmPassword == '') {
      setError(true)
    } else {
      const response = await setNewPassword(UpdatePassword, linkverify)
      const data = response
      console.log('set password data', data)
      if (data.response == 408) {
        toast.error(data.responseMessage)
      } else if (data.resendCode == 404) {
        toast.error(data.responseMessage)
      } else {
        toast.success('Password has been updated successfully')
        setTimeout(() => {
          window.close()
        }, 2000)
      }
    }
  }

  return (
    <Card className="signupformbox">
      <CardHeader
        title="forgot Password"
        titleTypographyProps={{ variant: 'h6' }}
      />
      <ToastContainer />
      <CardContent>
        <form>
          <TextField
            autoFocus
            fullWidth
            id="password"
            placeholder="password "
            label="password"
            sx={{ marginBottom: 4 }}
            onChange={(e) => setUpdatePassword(e.target.value)}
          />
          <div style={{ marginTop: '-30px', marginBottom: '15px' }}>
            {error && !UpdatePassword && (
              <span style={{ color: 'red' }}>Enter New password </span>
            )}
          </div>
          <TextField
            autoFocus
            fullWidth
            id="confirmpassword"
            placeholder="confirm password "
            label="confirm password"
            sx={{ marginBottom: 4 }}
            onChange={(e) => setconfirmPassword(e.target.value)}
          />
          <div style={{ marginTop: '-30px', marginBottom: '15px' }}>
            {error && !confirmPassword && (
              <span style={{ color: 'red' }}>Enter Confirm password </span>
            )}
          </div>
          <div style={{ marginTop: '-10px', marginBottom: '15px' }}>
            {btnhide && confirmPassword && (
              <span style={{ color: 'red' }}>Password Not Match </span>
            )}
          </div>
          <Button
            type="submit"
            fullWidth
            size="large"
            variant="contained"
            disabled={btnhide}
            onClick={ForgotPassword}
            sx={{ marginBottom: 7 }}
          >
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default SetNewUpdatepassword
