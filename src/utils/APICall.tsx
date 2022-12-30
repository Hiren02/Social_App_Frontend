import axios from 'axios'

const APICall = async (
    url: string,
    method : string,
    data ?: {},
  ) => {
    const { token } = window.localStorage;
    let headerData = {}
    if (token) {
      headerData = {
        Authorization: token,
      }
    }
  
    const result = await axios(`${url}`, {
      method,
      headers: headerData,
      data,
    })
  
    const response = await result.data
  
    if (!response) {
      throw new Error(JSON.stringify(response))
    }
    return response
  }
  
  export default APICall
  