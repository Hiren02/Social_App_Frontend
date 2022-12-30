import { FC, MouseEvent, useContext, useEffect, useState } from 'react'
// Next Imports
import Link from 'next/link'
import toast from 'helpers/toast'
import { ToastContainer } from 'react-toastify'
import { useFormik } from 'formik'
import * as Yup from 'yup'
// MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel, {
  FormControlLabelProps,
} from '@mui/material/FormControlLabel'

// import Divider from '@mui/material/Divider'
import Google from 'mdi-material-ui/Google'
import Github from 'mdi-material-ui/Github'
import Twitter from 'mdi-material-ui/Twitter'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import { Instagram } from 'mdi-material-ui'
import {
  login,
  resendVerificationCode,
  verifySecurityCode,
} from 'services/webservices/user/api'
import { useRouter } from 'next/router'
import { GlobalContext } from 'globalContext'
import { signIn, useSession } from 'next-auth/react'
import OtpInput from 'react-otp-input'

interface State {
  password: string
  showPassword: boolean
}

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' },
}))

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(
  ({ theme }) => ({
    '& .MuiFormControlLabel-label': {
      fontSize: '0.875rem',
      color: theme.palette.text.secondary,
    },
  })
)

const LoginPage: FC = () => {
  // ** State
  const [otpModel, setOtpModel] = useState<boolean>(false)
  const [flag, SetFlag] = useState<boolean>(false)
  let [counter, setCounter] = useState(59)
  const [userId, setUserId] = useState<string>('')
  const { setLoginData, setUserToken } = useContext<any>(GlobalContext)

  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/')
    } else {
      router.push('/login')
    }
  }, [status])
  const [values, setValues] = useState<State>({
    password: '',
    showPassword: false,
  })

  function countdown() {
    counter = 59

    let timer = setInterval(() => {
      setCounter(counter--)

      if (counter < 0) {
        // console.log("stop time");
        clearInterval(timer)
      } else {
        // console.log("start time");
      }
    }, 1000)
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const onlynumber = /^[0-9\b]+$/
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

  const validateSchema = Yup.object().shape({
    email: Yup.string().trim().required('Email or Username'),
    password: Yup.string()
      .trim()
      .matches(
        passwordRegex,
        'Password should contain min 8 characters with atleast one uppercase Alphanumeric, one Numeric and special character.'
      )
      .required('Password is required.'),
  })

  const validateSchema1 = Yup.object().shape({
    otp: Yup.string()
      .matches(onlynumber, 'Only valid Number')
      .min(6)
      .max(6)
      .required('OTP is required.'),
  })

  const {
    handleSubmit: handleSubmit,
    handleChange,
    values: values2,
    touched,
    errors,
  } = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validateSchema,
    onSubmit: async (value: any) => {
      const email: { email: string | null } = { email: value.email }

      const response = await login({
        email: value.email,
        password: value.password,
        role: 'user',
      })

      setUserId(response.responseData)
      const data = response

      if (data.responseCode == 404) {
        toast.error('Email or Usename is incorrect')
      } else if (data.responseCode == 400) {
        toast.error('Password is incorrect')
      } else {
        if (data.responseData.twoFactorAuthentication == false) {
          const meet = await signIn('credentials', {
            email: value.email,
            password: value.password,
            redirect: false,
          })

          toast.success(data.responseMessage)
          setLoginData(data.responseData)
          setUserToken(data.responseData.token)
          router.push('/')
        } else {
          setOtpModel(true)
          toast.success(data.responseMessage)
          setUserToken(data.responseData.token)
          SetFlag(true)
          countdown()
        }
      }
    },
  })

  const {
    handleSubmit: handleSubmit1,
    handleChange: handleChange1,
    touched: touched1,
    errors: errors1,
    values: value1,
  } = useFormik({
    initialValues: {
      otp: '',
    },
    validationSchema: validateSchema1,
    onSubmit: async (value: any) => {
      const response = await verifySecurityCode(value.otp, userId)
      const data = response

      // user data or token are there
      // console.log(data.responseData)
      if (data.responseCode == 400) {
        toast.error(data.responseMessage)
      } else if (data.responseCode == 400) {
        toast.error(data.responseMessage)
      } else if (data.responseCode == 200) {
        const meet2 = await signIn('credentials', {
          otp: value.otp,
          userId,
          redirect: false,
        })
        toast.success(data.responseMessage)
        setLoginData(data.responseData)
        setUserToken(data.responseData.token)
        router.push('/')
      } else {
        router.push('/login')
      }
    },
  })

  const ReSendOTP = async (valuesforotp) => {
    countdown()
    const response = await resendVerificationCode(valuesforotp, true)
    const data = response
    toast.success(data.responseMessage)
  }

  return (
    <div className="fading">
      <Box className="content-center">
        <ToastContainer />
        {!otpModel ? (
          <Card className="loginbox">
            <CardContent>
              <Box sx={{ mb: 6 }}>
                <h1 className="main-heading">
                  <span className="main-heading-primary">Login</span>
                </h1>
              </Box>
              <form noValidate onSubmit={handleSubmit}>
                <TextField
                  autoFocus
                  fullWidth
                  id="email"
                  placeholder="Email or Username"
                  onChange={async (e) => {
                    handleChange('email')(e)
                  }}
                  label="Email or Username"
                  sx={{ marginBottom: 4 }}
                />
                {touched.email && errors.email ? (
                  <div style={{ marginTop: '-30px', marginBottom: '15px' }}>
                    <div className="fv-help-block" style={{ color: '#ff6c70' }}>
                      {errors.email}
                    </div>
                  </div>
                ) : null}
                <FormControl fullWidth>
                  <InputLabel htmlFor="auth-login-password">
                    Password
                  </InputLabel>
                  <OutlinedInput
                    label="Password"
                    id="auth-login-password"
                    onChange={async (e) => {
                      handleChange('password')(e)
                    }}
                    type={values.showPassword ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          aria-label="toggle password visibility"
                        >
                          {values.showPassword ? (
                            <EyeOutline />
                          ) : (
                            <EyeOffOutline />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />{' '}
                  {touched.password && errors.password ? (
                    <div style={{ marginBottom: '15px' }}>
                      <div
                        className="fv-help-block"
                        style={{ color: '#ff6c70' }}
                      >
                        {errors.password}
                      </div>
                    </div>
                  ) : null}
                </FormControl>
                <Box
                  sx={{
                    mb: 4,
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                  }}
                >
                  <FormControlLabel
                    control={<Checkbox />}
                    label="Remember Me"
                  />
                  <Link href="/forgot-password">Forgot Password?</Link>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  size="large"
                  variant="contained"
                  sx={{ marginBottom: 7 }}
                >
                  Login
                </Button>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="body2" sx={{ marginRight: 2 }}>
                    New on our platform?
                  </Typography>
                  <Typography variant="body2">
                    <Link href="/signup">Create an account</Link>
                  </Typography>
                </Box>
                {/* <Divider sx={{ my: 5 }}>or</Divider> */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Link href="https://www.instagram.com/accounts/login/">
                    <IconButton>
                      <Instagram sx={{ color: '#497ce2' }} />
                    </IconButton>
                  </Link>
                  <Link href="https://twitter.com/login">
                    <IconButton>
                      <Twitter sx={{ color: '#1da1f2' }} />
                    </IconButton>
                  </Link>
                  <Link href="https://github.com/login">
                    <IconButton>
                      <Github
                        sx={{
                          color: (theme) =>
                            theme.palette.mode === 'light'
                              ? '#272727'
                              : theme.palette.grey[300],
                        }}
                      />
                    </IconButton>
                  </Link>
                  <Link href="https://github.com/login">
                    <IconButton>
                      <Google sx={{ color: '#db4437' }} />
                    </IconButton>
                  </Link>
                </Box>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="loginbox">
            <CardContent>
              <Box sx={{ mb: 6 }}>
                <h1 className="main-heading">
                  <span className="main-heading-primary">OTP Verify</span>
                </h1>
              </Box>
              <form noValidate autoComplete="off" onSubmit={handleSubmit1}>
                <OtpInput
                  inputStyle="inputStyle"
                  onChange={async (e) => {
                    handleChange1('otp')(e)
                  }}
                  value={value1.otp}
                  numInputs={6}
                  separator={<span></span>}
                />

                {touched1.otp && errors1.otp ? (
                  <div style={{ marginTop: '15px' }}>
                    <div className="fv-help-block" style={{ color: '#ff6c70' }}>
                      {errors1.otp}
                    </div>
                  </div>
                ) : null}
                {flag ? (
                  <>
                    <br />
                    OTP valid till:-
                    <span
                      style={{
                        color: 'green',
                        fontWeight: 'bold',
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      00:{counter}
                      {counter == 0 && (
                        <Button
                          size="medium"
                          variant="contained"
                          onClick={() => {
                            ReSendOTP(values2.email)
                          }}
                          sx={{ marginBottom: 7 }}
                        >
                          Resend OTP
                        </Button>
                      )}
                    </span>
                    <Button
                      type="submit"
                      fullWidth
                      size="large"
                      variant="contained"
                      sx={{ marginBottom: 7 }}
                    >
                      Verify Otp
                    </Button>
                  </>
                ) : null}
              </form>
            </CardContent>
          </Card>
        )}
      </Box>
    </div>
  )
}

export default LoginPage
