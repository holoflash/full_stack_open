import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ user, blog, addLike, deleteBlog }) => {
  const [inView, setInView] = useState(false)
  const toggleView = () => {
    setInView(!inView)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={toggleView}>{inView ? 'Less' : 'More'}</button>
      {inView && (
        <div>
          <p>URL: {blog.url}</p>
          <p>
            Likes: {blog.likes}{' '}
            <button onClick={() => addLike(blog)}>Like</button>
          </p>
          <p>Username: {blog.user.username}</p>
          {blog.user.username === user.username && (
            <button onClick={() => deleteBlog(blog)}>Delete</button>
          )}
        </div>
      )}
    </div>
  )
}


Blog.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }).isRequired,
  blog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.shape({
      username: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  addLike: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
}

export default Blog
