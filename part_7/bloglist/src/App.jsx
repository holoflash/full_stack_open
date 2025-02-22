import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState({
    text: null,
    type: 'good'
  })
  const newBlogRef = useRef()

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage(prev => ({ ...prev, text: null }))
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [message.text])

  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs(blogs)
    })
      .catch((error) => {
        setMessage(prev => ({ ...prev, text: `${error}`, type: 'error' }))
      }
      )
  }, [])

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [blogs])

  const handleLogin = (event) => {
    event.preventDefault()

    loginService.login({ username, password })
      .then((user) => {
        window.localStorage.setItem('loggedInUser', JSON.stringify(user))
        blogService.setToken(user.token)
        setMessage(prev => ({ ...prev, text: `${user.username} logged in sucessfully`, type: 'good' }))
        setUser(user)
        setUsername('')
        setPassword('')
      })
      .catch((error) => {
        setMessage((prev) => ({ ...prev, text: `${error.response.data.error}`, type: 'error' }))
      })
  }

  const handleLogout = () => {
    setMessage(prev => ({ ...prev, text: `${user.username} logged out`, type: 'good' }))
    window.localStorage.clear()
    setUser(null)
  }

  const addBlog = (blogToAdd) => {
    blogService.create(blogToAdd)
      .then((addedBlog) => {
        setBlogs([...blogs, addedBlog])
        setMessage(prev => ({ ...prev, text: `Blog added: ${addedBlog.title} by ${addedBlog.author}`, type: 'good' }))
        newBlogRef.current.toggleVisibility()

      })
      .catch((error) => {
        console.error('Error adding blog:', error)
      })
  }

  const addLike = (blogToLike) => {
    blogService.like({ _id: blogToLike._id, likes: blogToLike.likes + 1 })
      .then(updatedBlog => {
        setBlogs(blogs.map(blog => blog._id === updatedBlog._id ? updatedBlog : blog))
        setMessage(prev => ({ ...prev, text: `You liked ${updatedBlog.title}`, type: 'good' }))
      })
      .catch((error) => {
        console.error('Error liking blog:', error)
      })
  }

  const deleteBlog = (blogToRemove) => {
    if (window.confirm(`Remove blog  ${blogToRemove.title} by ${blogToRemove.author}?`)) {
      blogService.remove(blogToRemove)
        .then((deletedBlog) => {
          setBlogs(blogs.filter(blog => blog._id !== blogToRemove._id))
          setMessage(prev => ({ ...prev, text: `Blog deleted: ${blogToRemove.title}`, type: 'good' }))
        })
        .catch((error) => {
          console.error('Error deleting blog:', error)
        })
    }
  }

  return (
    <div className='main'>
      <Notification className='notification' message={message} />
      {!user ? (
        <LoginForm className='login-form'{...{ username, password, setUsername, setPassword, handleLogin }} />
      ) : (
        <div className='blog-container'>
          <p>{user.username} logged in <button onClick={handleLogout}>logout</button></p>
          <h2>blogs</h2>
          <Togglable buttonLabel="Add blog" hideLabel="cancel" ref={newBlogRef}>
            <NewBlog createBlog={addBlog} username={user.name} />
          </Togglable>
          <div>
            {blogs
              .sort((a, b) => b.likes - a.likes)
              .map(blog => (
                <Blog key={blog._id} blog={blog} addLike={addLike} deleteBlog={deleteBlog} user={user} />
              ))}
          </div>
        </div>
      )
      }
    </div>
  )
}

export default App