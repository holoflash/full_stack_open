const Blog = require('../models/blog')
const User = require('../models/user')

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

module.exports = {
    initialUsers,
    initialBlogs,
    blogsInDb,
    usersInDb,
}