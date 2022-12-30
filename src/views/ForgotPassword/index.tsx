import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { CardHeader } from '@mui/material'
import { forgotPassword } from 'services/webservices/user/api'
import toast from 'helpers/toast'
import { ToastContainer } from 'react-toastify'
import { useRouter } from 'next/navigation'

const Forgotpassword = () => {
  const router = useRouter()
  const validateSchema = Yup.object().shape({
    email: Yup.string().trim().required('Email is required'),
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
    },
    validationSchema: validateSchema,
    onSubmit: async (value: any) => {
      const email: { email: string | null } = { email: value.email }

      const response = await forgotPassword(value.email)
      console.log('response', response)
      const data = response

      if (data.responseCode == 404) {
        toast.error(data.responseMessage)
      } else {
        toast.success(data.responseMessage)
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      }
    },
  })

  return (
    <Card className="signupformbox">
      <CardHeader title="Email" titleTypographyProps={{ variant: 'h6' }} />
      <ToastContainer />
      <CardContent>
        <form noValidate onSubmit={handleSubmit}>
          <TextField
            autoFocus
            fullWidth
            id="email"
            placeholder="Email "
            onChange={async (e) => {
              handleChange('email')(e)
            }}
            label="Email"
            sx={{ marginBottom: 4 }}
          />
          {touched.email && errors.email ? (
            <div style={{ marginTop: '-30px', marginBottom: '15px' }}>
              <div className="fv-help-block" style={{ color: '#ff6c70' }}>
                {errors.email}
              </div>
            </div>
          ) : null}

          <Button
            type="submit"
            fullWidth
            size="large"
            variant="contained"
            sx={{ marginBottom: 7 }}
          >
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default Forgotpassword
