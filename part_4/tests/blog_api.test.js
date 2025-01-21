const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const helper = require('./testHelpers')

const api = supertest(app)
describe('api', () => {
    beforeEach(async () => {
        await Blog.deleteMany({});
        await User.deleteMany({});

        const passwordHash = await bcrypt.hash('password123', 10);
        const testUser = new User({
            username: 'testuser',
            name: 'Test User',
            passwordHash,
        });
        await testUser.save();

        if (helper.initialBlogs) {
            const user = await User.findOne({ username: 'testuser' });
            const blogs = helper.initialBlogs.map(blog => ({
                ...blog,
                user: user._id,
            }));
            await Blog.insertMany(blogs);
        }
    });

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')

        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('all blog posts have a unique identifier property named id', async () => {
        const response = await api.get('/api/blogs');
        const ids = response.body.map(blog => blog._id);
        const uniqueIds = new Set(ids);

        assert.strictEqual(ids.length, uniqueIds.size);
    });

    test('a valid blog can be added', async () => {
        const user = await User.findOne({ username: 'testuser' });

        const newBlog = {
            title: 'Test Blog',
            author: 'Test Author',
            url: 'http://testblog.com',
            likes: 10,
            userId: user._id.toString(),
        };

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const blogsAtEnd = await Blog.find({});
        assert.equal(blogsAtEnd.length, helper.initialBlogs.length + 1);
    });

    test('a blog without likes property defaults to 0 likes', async () => {
        const user = await User.findOne({ username: 'testuser' });

        const newBlog = {
            title: 'Test Blog',
            author: 'Test Author',
            url: 'http://testblog.com',
            userId: user._id.toString(),
        };

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        const lastBlogLikes = blogsAtEnd[blogsAtEnd.length - 1].likes
        assert.strictEqual(lastBlogLikes, 0, 'Great success!')
    })

    test('Blog without title and url is not added', async () => {
        const user = await User.findOne({ username: 'testuser' });

        const newBlog = {
            author: 'Test Author',
            userId: user._id.toString(),
        };

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('Deleting blog succeeds with status code 204 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete._id}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })

    test('Updating blog succeeds with status code 200 if id is valid', async () => {
        const updatedLikes = {
            likes: 12834
        }

        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]

        await api
            .put(`/api/blogs/${blogToUpdate._id}`)
            .send(updatedLikes)
            .expect(200)

        const blogsAtEnd = await helper.blogsInDb()

        assert(blogsAtEnd[0].likes === updatedLikes.likes)
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "testuser",
            name: "Bob",
            password: "password123",
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        assert(result.body.error.includes('expected `username` to be unique'))

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if password invalid', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "12",
            name: "Bob",
            password: "12",
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        assert(result.body.error.includes('Password must be at least 3 characters long'))

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if username invalid', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "12",
            name: "Bob",
            password: "mypassword",
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        assert(result.body.error.includes('Username must be at least 3 characters long'))

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    after(async () => {
        await mongoose.connection.close()
    })
})