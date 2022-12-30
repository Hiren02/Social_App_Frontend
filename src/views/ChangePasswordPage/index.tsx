import { MouseEvent, useContext, useState } from 'react'
import toast from 'helpers/toast'
import { ToastContainer } from 'react-toastify'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import { useRouter } from 'next/router'
import { GlobalContext } from 'globalContext'
import { changePassword } from 'services/webservices/user/api'

interface State {
  currentPassword: string
  showPassword: boolean
}

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' },
}))

const ChangePasswordPage = () => {
  const { userData } = useContext<any>(GlobalContext)
  const route = useRouter()

  const [values, setValues] = useState<State>({
    currentPassword: '',
    showPassword: false,
  })

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

  const validateSchema = Yup.object().shape({
    newPassword: Yup.string()
      .matches(
        passwordRegex,
        'Password should contain min 8 characters with atleast one uppercase Alphanumeric, one Numeric and special character.'
      )
      .trim()
      .required('New Passwprd is required.'),
    currentPassword: Yup.string()
      .trim()
      .matches(
        passwordRegex,
        'Password should contain min 8 characters with atleast one uppercase Alphanumeric, one Numeric and special character.'
      )
      .required('Current Password is required.'),
  })

  const {
    handleSubmit: handleSubmit,
    handleChange,
    values: values1,
    touched,
    errors,
  } = useFormik({
    initialValues: {
      newPassword: '',
      currentPassword: '',
    },
    validationSchema: validateSchema,
    onSubmit: async (value: any) => {
      const response = await changePassword(
        userData._id,
        value.currentPassword,
        values1.newPassword
      )

      const data = response

      if (data.responseCode == 400) {
        toast.error(response.responseMessage)
      } else {
        toast.success(response.responseMessage)
        setTimeout(() => {
          route.push('/')
        }, 2000)
      }
    },
  })

  return (
    <div className="fading">
      <Box className="content-center">
        <ToastContainer />

        <Card className="loginbox">
          <CardContent>
            <Box sx={{ mb: 6 }}>
              <p style={{ fontSize: '30px' }}>Change Password</p>
            </Box>
            <form noValidate onSubmit={handleSubmit}>
              <FormControl fullWidth>
                <InputLabel htmlFor="auth-login-Password">
                  Current Password
                </InputLabel>
                <OutlinedInput
                  autoFocus
                  autoComplete="off"
                  label="currentPassword"
                  id="auth-login-Password"
                  onChange={async (e) => {
                    handleChange('currentPassword')(e)
                  }}
                  type={values.showPassword ? 'text' : 'Password'}
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
                />
                {touched.currentPassword && errors.currentPassword ? (
                  <div style={{ marginBottom: '15px' }}>
                    <div className="fv-help-block" style={{ color: '#ff6c70' }}>
                      {errors.currentPassword}
                    </div>
                  </div>
                ) : null}
                <TextField
                  fullWidth
                  id="newPassword"
                  placeholder="Enter New Passwprd"
                  onChange={async (e) => {
                    handleChange('newPassword')(e)
                  }}
                  label="New Passwprd"
                  sx={{ marginBottom: 4, marginTop: '5%' }}
                />
                {touched.newPassword && errors.newPassword ? (
                  <div style={{ marginTop: '-30px', marginBottom: '15px' }}>
                    <div className="fv-help-block" style={{ color: '#ff6c70' }}>
                      {errors.newPassword}
                    </div>
                  </div>
                ) : null}
              </FormControl>

              <Button
                type="submit"
                fullWidth
                size="large"
                variant="contained"
                sx={{
                  marginBottom: 7,
                  marginTop: '5%',
                  textTransform: 'capitalize',
                }}
              >
                Change Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    </div>
  )
}

export default ChangePasswordPage
