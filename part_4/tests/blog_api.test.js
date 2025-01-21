const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const initialBlogs = require('./testHelpers')

const api = supertest(app)

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

beforeEach(async () => {
    await Blog.deleteMany({})

    for (let blog of initialBlogs) {
        let blogObject = new Blog(blog)
        await blogObject.save()
    }
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, initialBlogs.length)
})

test('all blog posts have a unique identifier property named id', async () => {
    const response = await api.get('/api/blogs');
    const ids = response.body.map(blog => blog._id);
    const uniqueIds = new Set(ids);

    assert.strictEqual(ids.length, uniqueIds.size);
});

test('a valid blog can be added', async () => {
    const newBlog = {
        title: "New blog added",
        url: "https://reactpatterns.com/",
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await blogsInDb()
    assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1)

    const title = blogsAtEnd.map(n => n.title)
    assert(title.includes('New blog added'))
})

test('a blog without likes property defaults to 0 likes', async () => {
    const newBlog = {
        title: "New blog added",
        url: "https://reactpatterns.com/",
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await blogsInDb()
    const lastBlogLikes = blogsAtEnd[blogsAtEnd.length - 1].likes
    assert.strictEqual(lastBlogLikes, 0, 'Great success!')
})

test('Blog without title and url is not added', async () => {
    const newBlog = {
        author: "Michael Chan",
        likes: 7,
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

    const blogsAtEnd = await blogsInDb()
    assert.strictEqual(blogsAtEnd.length, initialBlogs.length)
})

test('Deleting blog succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
        .delete(`/api/blogs/${blogToDelete._id}`)
        .expect(204)

    const blogsAtEnd = await blogsInDb()

    assert.strictEqual(blogsAtEnd.length, initialBlogs.length - 1)

    const url = blogsAtEnd.map(r => r.url)
    assert(!url.includes(blogToDelete.url))
})

test('Updating blog succeeds with status code 200 if id is valid', async () => {
    const updatedLikes = {
        likes: 12834
    }

    const blogsAtStart = await blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    await api
        .put(`/api/blogs/${blogToUpdate._id}`)
        .send(updatedLikes)
        .expect(200)

    const blogsAtEnd = await blogsInDb()

    assert(blogsAtEnd[0].likes === updatedLikes.likes)
})

after(async () => {
    await mongoose.connection.close()
})