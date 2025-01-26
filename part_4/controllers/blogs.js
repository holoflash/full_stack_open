const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware');

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogRouter.post('/', middleware.userExtractor, async (request, response) => {
    const body = request.body
    const user = request.user

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user._id
    })

    const savedBlog = await blog.save();

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    const populatedBlog = await Blog.findById(savedBlog._id).populate('user', { username: 1, name: 1 })

    response.status(201).json(populatedBlog)
})

blogRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
    const user = request.user

    const blog = await Blog.findById(request.params.id)

    if (!blog) {
        return response.status(404).json({ error: 'blog not found' })
    }

    if (blog.user.toString() !== user.id) {
        return response.status(403).json({ error: 'invalid user' })
    }

    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
    const body = request.body

    const updatedBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        { likes: body.likes },
        { new: true }
    ).populate('user', { username: 1, name: 1 })

    if (!updatedBlog) {
        return response.status(404).json({ error: 'Blog not found' })
    }

    response.json(updatedBlog)
})


module.exports = blogRouter