const express = require('express')
const app = express()

app.use(express.json())

const cors = require('cors')
const morgan = require('morgan')

app.use(cors())
app.use(express.static('build'))

morgan.token('post-data', function(req, res) {return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'))

let persons = 
[
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]



app.get('/', (request, response) => {
    response.send('<h1>Welcome to the YellowBook of internet!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id )
    if (person){
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.get('/info', (request, response) => {
    let infopage = `<p>Phonebook has info for ${persons.length} people,</p> <p>${Date()}</p>`
    response.send(infopage)
})

app.delete('/api/persons/:id',  (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(note => note.id !== id)
    response.send(204).end()
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
    
    const personFound = persons.find(person => person.name === body.name)
        if (personFound) {
            return response.status(409).json({
                error: 'content already exists'
            })
        }


    const person = {
        id: Math.floor(Math.random()*10000),
        name: body.name,
        number: body.number
        
    }

    persons = persons.concat(person)
    response.json(person)
})

const unknownEndPoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint'})
  }

  app.use(unknownEndPoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})