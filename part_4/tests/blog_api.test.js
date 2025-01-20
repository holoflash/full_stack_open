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

test.only('a valid blog can be added ', async () => {
    const newBlog = {
        title: "New blog added",
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

after(async () => {
    await mongoose.connection.close()
})