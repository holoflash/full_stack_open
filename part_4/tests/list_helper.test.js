const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const baseBlog = {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
}

describe('total likes', () => {
    test('when list has only one blog, equals the likes of that', () => {
        const listWithOneBlog = [{ ...baseBlog, likes: 5 }]
        const result = listHelper.totalLikes(listWithOneBlog)
        assert.strictEqual(result, 5)
    })

    test('when likes are a string, parse to int', () => {
        const listWithOneBlogStringLikes = [{ ...baseBlog, likes: "5" }]
        const result = listHelper.totalLikes(listWithOneBlogStringLikes)
        assert.strictEqual(result, 5)
    })

    test('when blog has missing likes value, count as 0', () => {
        const blogWithoutLikesValue = [{ ...baseBlog }]
        const result = listHelper.totalLikes(blogWithoutLikesValue)
        assert.strictEqual(result, 0)
    })

    test('when blog has missing likes value, count as 0 but count others', () => {
        const oneBlogWithoutLikesValue = [
            { ...baseBlog },
            { ...baseBlog, likes: 23 }
        ]
        const result = listHelper.totalLikes(oneBlogWithoutLikesValue)
        assert.strictEqual(result, 23)
    })

    test('when list has only multiple blogs, equal all their likes', () => {
        const listWithMultipleBlogs = [
            { ...baseBlog, likes: 7 },
            { ...baseBlog, likes: 5 },
            { ...baseBlog, likes: 12 },
        ]
        const result = listHelper.totalLikes(listWithMultipleBlogs)
        assert.strictEqual(result, 24)
    })
})

describe('favorite blog', () => {
    test('when list has multiple blogs, return the blog with most likes', () => {
        const listWithMultipleBlogs = [
            { ...baseBlog, likes: 7 },
            { ...baseBlog, likes: 5 },
            { ...baseBlog, likes: 12 },
        ]
        const result = listHelper.favoriteBlog(listWithMultipleBlogs)
        assert.deepStrictEqual(result, { ...baseBlog, likes: 12 })
    })

    test('when list has multiple blogs with same likes, return any one of them', () => {
        const listWithMultipleBlogsSameLikes = [
            { ...baseBlog, likes: 7 },
            { ...baseBlog, likes: 12 },
            { ...baseBlog, likes: 12 },
        ]
        const result = listHelper.favoriteBlog(listWithMultipleBlogsSameLikes)
        assert.deepStrictEqual(result, { ...result, likes: 12 })
    })
})

describe('author with most blogs', () => {
    test('return most prolific author and number of blogs written', () => {
        const listWithBlogsBySameAuthor = [
            { ...baseBlog, author: "Michael Chan" },
            { ...baseBlog, author: "Michael Chan" },
            { ...baseBlog, author: "Michael Chan" },
        ]
        const result = listHelper.mostBlogs(listWithBlogsBySameAuthor)
        assert.deepStrictEqual(result, { author: "Michael Chan", blogs: 3 })
    })

    test('return most prolific author and number of blogs written', () => {
        const listWithTwoEquallyProlificAuthors = [
            { ...baseBlog, author: "Michael Chan" },
            { ...baseBlog, author: "Michael Chan" },
            { ...baseBlog, author: "Bob" },
            { ...baseBlog, author: "Bob" },
        ]
        const result = listHelper.mostBlogs(listWithTwoEquallyProlificAuthors)
        assert.deepStrictEqual(result, { ...result, blogs: 2 })
    })
})

describe('author with most likes', () => {
    test('return most prolific author and number of blogs written', () => {
        const listWithTwoEquallyProlificAuthors = [
            { ...baseBlog, likes: 3, author: "Michael Chan" },
            { ...baseBlog, likes: 0, author: "Michael Chan" },
            { ...baseBlog, likes: 12, author: "Bob" },
            { ...baseBlog, likes: 12, author: "Bob" },
        ]
        const result = listHelper.mostLikes(listWithTwoEquallyProlificAuthors)
        assert.deepStrictEqual(result, { ...result, likes: 24 })
    })
})
