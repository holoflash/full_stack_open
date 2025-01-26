const NewBlog = ({ addBlog, newBlog, handleNewBlog }) => {
    return (
        <div>
            <h3>Add a new blog</h3>
            <form onSubmit={addBlog}>
                <div>
                    Title: <input name="title" value={newBlog.title} onChange={handleNewBlog} required />
                </div>
                <div>
                    URL: <input name="url" value={newBlog.url} onChange={handleNewBlog} required />
                </div>
                <div>
                    <button type="submit">add</button>
                </div>
            </form>
        </div>
    )
}

export default NewBlog