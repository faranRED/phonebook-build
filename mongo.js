const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://faranred:${password}@cluster0.dkp1c9n.mongodb.net/personApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true
    },
    number: Number,
    
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
        console.log(`${person.name}, ${person.number}`)
    })
    mongoose.connection.close()
})
} else if (process.argv.length === 5) {
    const person = new Person(
    {
        name: process.argv[3],
        number: process.argv[4],
    })
    person.save().then(result => {
        console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
        mongoose.connection.close()
      })
} else {
    console.log('invalid arguments')
    mongoose.connection.close()
    process.exit(1);
}