const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const name = process.argv[2]
const number = process.argv[3]

const url = process.env.MONGODB_URI;
console.log(url)
mongoose.set('strictQuery', false)

mongoose.connect(url)


const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (!name || !number) {
    console.log('Phonebook:')
    Person.find({}).then(persons => {
        persons.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
    return
}

const person = new Person({
    name: name,
    number: number,
})


person.save().then(person => {
    console.log(`Added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
})


