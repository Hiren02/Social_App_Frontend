import React, { useState, MouseEvent, useEffect } from 'react'
// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'
import OutlinedInput from '@mui/material/OutlinedInput'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import toast from 'helpers/toast'
import { ToastContainer } from 'react-toastify'
import Link from 'next/link'
// ** Icons Imports
import EmailOutline from 'mdi-material-ui/EmailOutline'
import AccountOutline from 'mdi-material-ui/AccountOutline'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import { useRouter } from 'next/router'
import { register } from 'services/webservices/user/api'
import { useSession } from 'next-auth/react'
interface State {
  password: string
  showPassword: boolean
}
function Signup() {
  const router = useRouter()
  const { status } = useSession()
  // ** State
  const [values, setValues] = useState<State>({
    password: '',
    showPassword: false,
  })

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/')
    } else {
      router.push('/signup')
    }
  }, [status])

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }
  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  const validateSchema = Yup.object().shape({
    userName: Yup.string().trim().required('Username is required'),
    email: Yup.string()
      .trim()
      .matches(
        emailRegex,
        'Invalid email format. Please follow below format=> abc123@xyz.com'
      )
      .required('Email is required'),
    password: Yup.string()
      .trim()
      .matches(
        passwordRegex,
        'Password should contain min 8 characters with atleast one uppercase Alphanumeric, one Numeric and special character.'
      )
      .required('Password is required.'),
    dob: Yup.date().required('Date is required'),
    gender: Yup.string().required('Gender is required'),
  })
  const formik = useFormik({
    initialValues: {
      userName: '',
      email: '',
      password: '',
      dob: '',
      gender: '',
    },
    validationSchema: validateSchema,
    onSubmit: async (value: any) => {
      console.log('date', value.dob)
      const response = await register(
        value.userName,
        value.email,
        value.password,
        value.dob,
        value.gender
      )
      console.log('response', response)
      if (response.responseCode !== 200) {
        toast.error(response.responseMessage)
      } else {
        router.push('/login')
      }
    },
  })
  return (
    <Box style={{ marginTop: '3%' }}>
      <ToastContainer />
      <Card className="signupformbox">
        <CardHeader title="Sign Up" titleTypographyProps={{ variant: 'h6' }} />
        <CardContent>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Username"
                  placeholder="Enter Your Username"
                  onChange={async (e) => {
                    formik.handleChange('userName')(e)
                  }}
                  value={formik.values.userName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountOutline />
                      </InputAdornment>
                    ),
                  }}
                />
                {formik.touched.userName && formik.errors.userName ? (
                  <div>
                    <div className="fv-help-block" style={{ color: '#FF6C70' }}>
                      {formik.errors.userName}
                    </div>
                  </div>
                ) : null}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="email"
                  label="Email"
                  onChange={async (e) => {
                    formik.handleChange('email')(e)
                  }}
                  value={formik.values.email}
                  placeholder="Enter Your Email"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutline />
                      </InputAdornment>
                    ),
                  }}
                />{' '}
                {formik.touched.email && formik.errors.email ? (
                  <div>
                    <div className="fv-help-block" style={{ color: '#FF6C70' }}>
                      {formik.errors.email}
                    </div>
                  </div>
                ) : null}
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="auth-login-password">
                    Password
                  </InputLabel>
                  <OutlinedInput
                    label="Password"
                    value={formik.values.password}
                    id="auth-login-password"
                    onChange={async (e) => {
                      formik.handleChange('password')(e)
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
                  {formik.touched.password && formik.errors.password ? (
                    <div style={{ marginBottom: '15px' }}>
                      <div
                        className="fv-help-block"
                        style={{ color: '#FF6C70' }}
                      >
                        {formik.errors.password}
                      </div>
                    </div>
                  ) : null}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="date"
                  onChange={async (e) => {
                    formik.handleChange('dob')(e)
                  }}
                  value={formik.values.dob}
                  label="Date Of Birth"
                  InputProps={{
                    startAdornment: <InputAdornment position="start" />,
                  }}
                />
                {formik.touched.dob && formik.errors.dob ? (
                  <div>
                    <div className="fv-help-block" style={{ color: '#FF6C70' }}>
                      {formik.errors.dob}
                    </div>
                  </div>
                ) : null}
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="form-layouts-separator-select-label">
                    Gender
                  </InputLabel>
                  <Select
                    label="Gender"
                    id="form-layouts-separator-select"
                    labelId="form-layouts-separator-select-label"
                    onChange={async (e: any) => {
                      formik.handleChange('gender')(e)
                    }}
                    value={formik.values.gender}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                  {formik.touched.gender && formik.errors.gender ? (
                    <div>
                      <div
                        className="fv-help-block"
                        style={{ color: '#FF6C70' }}
                      >
                        {formik.errors.gender}
                      </div>
                    </div>
                  ) : null}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" size="large">
                  Submit
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ mr: 2 }}>
                    Already have an account?
                  </Typography>
                  <Link href="/login">Log in</Link>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}
export default Signup
