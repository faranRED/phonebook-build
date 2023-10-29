require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
app.use(express.json())

const cors = require('cors')
const morgan = require('morgan')

app.use(cors())
app.use(express.static('build'))

morgan.token('post-data', function(req, res) {return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'))

const Person = require('./models/person')

app.get('/', (request, response) => {
    response.send('<h1>Welcome to the YellowBook of internet!</h1>')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(person => {
        response.json(person)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
    .then(person => {
        if (person) {
        response.json(person)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})


app.get('/info', (request, response) => {
    Person.countDocuments({}).then(count => {
        let infopage = `<p>Phonebook has info for ${count} people,</p> <p>${Date()}</p>`
        response.send(infopage)
    })
})

app.delete('/api/persons/:id',  (request, response, next) => {
    Person.findByIdAndDelete(request.params.id).then(result => {
        console.log(result)
        if (!result){
            response.status(400).send('no record exists')
        } else {
            response.status(204).end()
        }
        
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, {new: true})
    .then(updatedPerson => {
        response.json(updatedPerson)
    })

    .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if(!body.name) {
        return response.status(400).json({
            error: 'content missing'
        })
    } else if (!body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
        
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})


const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({error: 'malformatted id'})
    }
    next(error)
}

const unknownEndPoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint'})
  }

  app.use(unknownEndPoint)

  app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})