import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [newBlog, setNewBlog] = useState({ title: "", author: "", url: "" })
  const [message, setMessage] = useState({
    text: null,
    type: 'good'
  })

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage(prev => ({ ...prev, text: null }));
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [message.text]);

  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs(blogs)
    })
      .catch((error) => {
        setMessage(prev => ({ ...prev, text: `${error}`, type: 'error' }))
      }
      )
  }, [message])

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

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

  const handleNewBlog = (event) => {
    const { name, value } = event.target
    setNewBlog({ ...newBlog, [name]: value })
  }

  const addBlog = (event) => {
    event.preventDefault()
    const blogToAdd = {
      ...newBlog,
      author: user.name,
    }

    blogService.create(blogToAdd)
      .then((addedBlog) => {
        setBlogs([...blogs, addedBlog])
        setNewBlog({ title: "", url: "" })
        setMessage(prev => ({ ...prev, text: `Blog added: ${addedBlog.title} by ${addedBlog.author}`, type: 'good' }))
      })
      .catch((exception) => {
        console.error('Error adding blog:', exception)
      })
  }

  return (
    <div>
      <Notification message={message} />
      {!user ? (
        <LoginForm {...{ username, password, setUsername, setPassword, handleLogin }} />
      ) : (
        <>
          <h2>blogs</h2>
          <p>{user.username} logged in <button onClick={handleLogout}>logout</button></p>
          <NewBlog {...{ addBlog, newBlog, handleNewBlog }} />
          <div>
            {blogs.map(blog =>
              <Blog key={blog._id} blog={blog} />
            )}
          </div>
        </>
      )
      }
    </div>
  )
}

export default App