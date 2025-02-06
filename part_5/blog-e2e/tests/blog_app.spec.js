const { test, describe, expect, beforeEach } = require('@playwright/test')

const logIn = async (page, username, password) => {
    await page.getByTestId('username').fill(username)
    await page.getByTestId('password').fill(password)
    await page.getByRole('button', { name: 'login' }).click()
}

const newBlog = async (page, title, url) => {
    await page.getByRole('button', { name: 'Add blog' }).click()
    await page.getByTestId('title').fill(title)
    await page.getByTestId('url').fill(url)
    await page.getByTestId('add').click()

    await page.getByText('Blog added:').waitFor()
}

describe('Blogs', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('/api/testing/reset')
        await request.post('/api/users', {
            data: {
                username: 'jack',
                name: 'jackson',
                password: 'jones'
            }
        })

        await request.post('/api/users', {
            data: {
                username: 'billy',
                name: 'billy',
                password: 'junior'
            }
        })

        await page.goto('')
    })


    test('Login form is shown', async ({ page }) => {
        const locator = page.getByText('Login:')
        await expect(locator).toBeVisible()
        await expect(page.getByText('username')).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await page.getByTestId('username').fill('jack')
            await page.getByTestId('password').fill('jones')
            await page.getByRole('button', { name: 'login' }).click()

            await expect(page.getByText('jack logged in sucessfully')).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await page.getByTestId('username').fill('jack')
            await page.getByTestId('password').fill('wrong')
            await page.getByRole('button', { name: 'login' }).click()

            await expect(page.getByText('invalid username or password')).toBeVisible()
        })
    })

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            logIn(page, 'jack', 'jones')
        })

        test('a new blog can be created', async ({ page }) => {
            await newBlog(page, 'New blog', 'www.website.com')

            await page.getByText('More').last().click()

            await expect(page.getByText('Likes: 0')).toBeVisible()
        })

        test('a blog can be liked', async ({ page }) => {
            await newBlog(page, 'New blog', 'www.website.com')

            await page.getByText('More').last().click()
            await page.getByRole('button', { name: 'Like' }).click()

            await expect(page.getByText('Likes: 1')).toBeVisible()

        })

        test('a blog can be deleted by use who created it', async ({ page }) => {
            await newBlog(page, 'New blog', 'www.website.com')

            await page.getByText('More').last().click()
            page.on('dialog', async dialog => {
                await dialog.accept();
            });

            await page.getByRole('button', { name: 'Delete' }).click()

            await expect(page.getByText('Blog deleted: New blog')).toBeVisible()
        })

        test('delete can only be seen by user who created blog', async ({ page }) => {
            await newBlog(page, 'New blog', 'www.website.com')
            await page.getByRole('button', { name: 'logout' }).click()
            await logIn(page, 'billy', 'junior')
            await page.getByText('More').last().click()

            await expect(page.getByText('Delete')).toBeHidden()
        })

        test('blogs are arranged in descending order based on number of likes', async ({ page }) => {
            await newBlog(page, 'New blog', 'www.website.com')
            await newBlog(page, 'Newest blog', 'www.website.com')
            await newBlog(page, 'Newestest blog', 'www.website.com')

            await page.getByText('More').last().click()
            await page.getByRole('button', { name: 'Like' }).click()
            await page.getByText('You liked').waitFor()
            await page.getByRole('button', { name: 'Like' }).click()
            await page.getByText('You liked').waitFor()

            const likesDataTestId = page.locator('#blog').first()
            await expect(likesDataTestId).toBeVisible();
            await expect(likesDataTestId).toContainText('2')
        })
    })
})