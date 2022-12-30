import { getSession } from 'next-auth/react'
import React from 'react'
import SearchPage from 'views/SearchPage'

function Search() {
  return (
    <div>
      <SearchPage />
    </div>
  )
}

export default Search
