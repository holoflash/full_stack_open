import { useState } from 'react'
import PropTypes from 'prop-types'

const NewBlog = ({ createBlog, username }) => {
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

  const handleNewBlog = (event) => {
    const { name, value } = event.target
    setNewBlog({ ...newBlog, [name]: value })
  }

  const addBlog = (event) => {
    event.preventDefault()
    const blogToAdd = {
      ...newBlog,
      author: username,
    }
    createBlog(blogToAdd)
    setNewBlog({ title: '', author: '', url: '' })
  }

  return (
    <div>
      <h3>Add a new blog</h3>
      <form onSubmit={addBlog}>
        <div>
          Title: <input data-testid='title' name="title" value={newBlog.title} onChange={handleNewBlog} required />
        </div>
        <div>
          URL: <input data-testid='url' name="url" value={newBlog.url} onChange={handleNewBlog} required />
        </div>
        <div>
          <button data-testid='add' type="submit">add</button>
        </div>
      </form>
    </div>
  )
}

NewBlog.propTypes = {
  createBlog: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
}

export default NewBlog
