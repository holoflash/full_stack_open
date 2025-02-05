import { render,screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('blogTests',()=>{
  const blog = {
    title:'It works',
    author:'testing',
    url:'www',
    likes:14,
    user : {
      username:'test',
      name:'test'
    }
  }
  
  const likesMockHandler = vi.fn()

  beforeEach(()=>{
    render(<Blog blog={blog} user={blog.user} addLike={likesMockHandler}/>)
  })

  test('renders blog title and author',() => {
    const element = screen.getByText(`${blog.title} ${blog.author}`)
    expect(element).toBeDefined()
  })
  
  test('shows url and number of likes when More is clicked', async () => {
    const user = userEvent.setup()
    const moreButton = screen.getByText('More')
    
    await user.click(moreButton)
    
    const likesDisplay = screen.getByTestId('likes')
    const urlDisplay = screen.getByTestId('url')
    
    expect(likesDisplay).toHaveTextContent(`Likes: ${blog.likes}`)
    expect(urlDisplay).toHaveTextContent(`URL: ${blog.url}`)
  })

  test('the event handler that the component received as props is called twice', async () => {
    const user = userEvent.setup()
    const viewButton = screen.getByText('More')
    await user.click(viewButton)

    const likeButton = screen.getByText('Like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(likesMockHandler.mock.calls).toHaveLength(2)
  })
})