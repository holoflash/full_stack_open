import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewBlog from './NewBlog'

test('that the form calls the event handler it received as props with the right details when a new blog is created', async () => {
  const user = userEvent.setup()
  const createBlogMockHandler = vi.fn()
  render(
    <NewBlog createBlog={createBlogMockHandler} username='tester'/>)

  const titleInput = screen.getByTestId('title')
  const urlInput = screen.getByTestId('url')
  const createButton = screen.getByTestId('add')

  await user.type(titleInput, 'testing')
  await user.type(urlInput, 'test.se')
  await user.click(createButton)

  expect(createBlogMockHandler.mock.calls).toHaveLength(1)
  expect(createBlogMockHandler.mock.calls[0][0]).toEqual({
    title: 'testing',
    author: 'tester',
    url: 'test.se',
  })
})
