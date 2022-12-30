import { Button, Grid, TextField } from '@mui/material'
import { Box } from '@mui/system'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import React, { useContext, useEffect, useState } from 'react'
import { CloudUploadOutlined } from '@mui/icons-material'
import { addPost } from 'services/webservices/user/api'
import { GlobalContext } from 'globalContext'
import toast from 'helpers/toast'
import { ToastContainer } from 'react-toastify'

function UploadPostPage({ CloseFunction }: any) {
  const { userData,setFlag } = useContext<any>(GlobalContext)
  const [selectedFile, setSelectedFile] = useState()
  const [preview, setPreview] = useState<string>()

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined)
      return
    }
    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile, userData])

  const validateSchema = Yup.object().shape({
    postDescription: Yup.string()
      .trim()
      .required('Post Description is required'),
    postImage: Yup.string().trim().required('Post Image is required'),
  })

  const {
    handleSubmit: handleSubmit1,
    handleChange: handleChange1,
    errors: error1,
    touched: touched1,
    values: values1,
    setFieldValue: setFieldValue1,
  } = useFormik({
    initialValues: {
      postDescription: '',
      postImage: '',
    },
    validationSchema: validateSchema,

    onSubmit: async (values1: any) => {
      setFlag(true)
      const response = await addPost(
        userData._id,
        values1.postDescription,
        values1.postImage,
        userData.userName
      )
      if (response.responseCode == 200) {
        toast.success('Post Upload Successfull')
        CloseFunction()
        setFlag(false)
      }
    },
  })
  return (
    <Box
      style={{
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '50%',
        background: 'white',
        padding: '20px',
      }}
    >
      <ToastContainer />
      <h2>Upload Post</h2>
      <br />
      <form onSubmit={handleSubmit1}>
        <TextField
          label="Post Description"
          fullWidth
          style={{ width: '80%' }}
          onChange={async (e) => {
            handleChange1('postDescription')(e)
          }}
        />
        {touched1.postDescription && error1.postDescription ? (
          <div style={{ marginBottom: '0px' }}>
            <div className="fv-help-block" style={{ color: '#ff6c70' }}>
              {error1.postDescription}
            </div>
          </div>
        ) : null}
        <br />
        <br />
        <div>
          <Button
            style={{ marginBottom: '5px' }}
            variant="contained"
            component="label"
            startIcon={<CloudUploadOutlined />}
          >
            Choose Image
            <TextField
              name="avatar"
              type="file"
              hidden
              onChange={(event: any) => {
                setFieldValue1('postImage', event.target.files[0])
                setSelectedFile(event.target.files[0])
              }}
            />
          </Button>
          {touched1.postImage && error1.postImage ? (
            <div style={{ marginBottom: '0px' }}>
              <div className="fv-help-block" style={{ color: '#ff6c70' }}>
                {error1.postImage}
              </div>
            </div>
          ) : null}
          <br />

          {selectedFile && (
            <>
              <p>Image Preview</p>
              <img src={preview} width="100px" height="100px" />
            </>
          )}

          <Grid style={{ float: 'right' }}>
            <Button type="submit" variant="contained" sx={{ marginRight: 3.5 }}>
              Upload Post
            </Button>
            <Button
              type="button"
              variant="contained"
              color="secondary"
              onClick={CloseFunction}
            >
              Cancel
            </Button>
          </Grid>
        </div>
      </form>
    </Box>
  )
}

export default UploadPostPage
