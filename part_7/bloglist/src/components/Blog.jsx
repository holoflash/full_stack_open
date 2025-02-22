import { useState } from 'react'
/* eslint-disable react/prop-types */

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
    <div id='blog' data-testid={blog.likes} style={blogStyle}>
      <div className='title'>
        {blog.title}
      </div>
      <div className='author'>
        {blog.author}
      </div>
      <button onClick={toggleView}>{inView ? 'Less' : 'More'}</button>
      {inView && (
        <div>
          <a className='url' data-testid='url'>{blog.url}</a>
          <p className='likes'>
            <div data-testid='likes'>Likes: {blog.likes}{' '}</div>
            <button className='like' onClick={() => addLike(blog)}>Like</button>
          </p>
          <p className='username'>Username: {blog.user.username}</p>
          {blog.user.username === user.username && (
            <button onClick={() => deleteBlog(blog)}>Delete</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
