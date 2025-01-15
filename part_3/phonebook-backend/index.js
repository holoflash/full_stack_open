const express = require('express')
const app = express()
const morgan = require('morgan')

let persons = [
    {
        id: "1",
        name: "Arto",
        number: "040-123456"
    },
    {
        id: "2",
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: "3",
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: "4",
        name: "Mary Poppendieck",
        number: "39-23-6423122"
    }
]

app.use(express.json())

morgan.token('body', req => {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] :body - :response-time ms'))

app.get('/api/info', (request, response) => {
    const date = new Date().toUTCString();
    response.send(`<div>Phonebook has info for ${persons.length} people</div><br/><div>${date}</div>`)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.statusMessage = "Person doesn't exist!"
        response.status(404).end()
    }
})

const generateId = () =>
    Array.from({ length: 8 }, () =>
        'ABCDEFGHIJKLMNOPQRSTUVXYZ0123456789'[Math.floor(Math.random() * 36)]
    ).join('');

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }
    if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    persons = persons.concat(person)
    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        persons = persons.filter(person => person.id !== id)
        response.json(persons)
        response.status(204).end()
    } else {
        response.statusMessage = "Person doesn't exist!"
        response.status(404).end()
    }
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})