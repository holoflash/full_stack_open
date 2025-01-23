const Blog = require('../models/blog')
const User = require('../models/user')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const initialBlogs = [
    {
        title: "We got this working fellas!",
        author: "Bob",
        url: "www.google.com",
        likes: 12,
    },
    {
        title: "Another test blog",
        author: "Alice",
        url: "www.example.com",
        likes: 20,
    },
];

const initialUsers = [
    {
        username: "Bob",
        name: "Bob",
        password: "password123",
    },
    {
        username: "Steven",
        name: "Steven",
        password: "password456",
    },
];

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

const userLogin = async () => {
    const user = {
        username: "newuser",
        name: "newuser",
        password: "secret"
    }

    await api
        .post('/api/users')
        .send(user)
    const res = await api
        .post('/api/login')
        .send(user)
    return `Bearer ${res.body.token}`
}

module.exports = {
    initialUsers,
    initialBlogs,
    blogsInDb,
    usersInDb,
    userLogin
}