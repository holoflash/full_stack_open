const totalLikes = (blogs) => blogs.reduce((acc, curr) => {
    return acc + parseInt(curr.likes) || 0
}, 0)

const favoriteBlog = (blogs) => blogs.reduce((acc, curr) => {
    return acc.likes > curr.likes ? acc : curr;
}, blogs[0])

const mostBlogs = (blogs) =>
    blogs.reduce((acc, { author }) => {
        acc.counts[author] = (acc.counts[author] || 0) + 1;
        if (acc.counts[author] > acc.max.blogs) {
            acc.max = { author, blogs: acc.counts[author] };
        }
        return acc;
    }, { counts: {}, max: { author: null, blogs: 0 } }).max;

const mostLikes = (blogs) =>
    blogs.reduce((acc, { author, likes }) => {
        acc.counts[author] = (acc.counts[author] || 0) + likes;
        if (acc.counts[author] > acc.max.likes) {
            acc.max = { author, likes: acc.counts[author] };
        }
        return acc;
    }, { counts: {}, max: { author: null, likes: 0 } }).max;

module.exports = {
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}

console.log(totalLikes)