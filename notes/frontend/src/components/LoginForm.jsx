const LoginForm = ({ handleSubmit, username, password, setUsername, setPassword }) => {
    const handleUsernameChange = (event) => setUsername(event.target.value)
    const handlePasswordChange = (event) => setPassword(event.target.value)

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    username
                    <input
                        value={username}
                        onChange={handleUsernameChange}
                    />
                </div>
                <div>
                    password
                    <input
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </div>
                <button type="submit">login</button>
            </form>
        </div>
    )
}

export default LoginForm
