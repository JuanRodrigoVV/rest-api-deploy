const express = require('express')
const movies = require('./movies.json')
const crypto = require('crypto')
const {validateMovie, validatePartialMovie} = require('./schemes/schema')



const app = express()
//Eliminar add
app.disable('x-powered-by')
//Convertir Data req.body
app.use(express.json())

// Equivalente de app.use(express.json())

// app.use(((req, res, next) => {
//     if (req.method !=='POST')return next()
//     if(req.headers['content-type'] !== 'application/json')return next()
//     let body = ''
//     req.on('data', chunk => {
//         body += chunk.toString()
//     })
//     req.on('end', () => {
//         const data = JSON.parse(body)
//         data.timestamp = Date.now()
//         req.body = data
//         next()
//     })

// }))


const ACCEPTED_ORIGINS = [

    'http://localhost:8080'
]





// GET Method

app.get('/movies', (req, res) => {
    const origin = req.header('origin')
    if (ACCEPTED_ORIGINS.includes(origin)){
    res.header('Access-Control-Allow-Origin', origin || !origin )
    }

    const {genre} = req.query
    if (genre) {
        const filteredMovies = movies.filter(messi => messi.genre.some(g => g.toLowerCase() === genre.toLowerCase()))
        return res.json(filteredMovies)
    }
    res.json(movies)
})

app.get('/movies/:id', (req, res) => {
     const origin = req.header('origin')
    if (ACCEPTED_ORIGINS.includes(origin)){
    res.header('Access-Control-Allow-Origin', origin || !origin )
    }
    const {id} = req.params
    const movie = movies.find(messi => messi.id === id)
    if (movie) return res.json(movie)
    res.status(404).json({message: 'Movie not Found'})
})




// POST Method

app.post('/movies', (req, res) => {
    const result = validateMovie(req.body)
    if(result.error) {
        return res.status(400).json({error: JSON.parse(result.error.message)})
    }

    const newMovie = {
        id: crypto.randomUUID(),
        ...result.data
    }
    movies.push(newMovie)
    res.status(201).json(newMovie)
})

// Actualizar Pelicula

app.patch('/movies/:id', (req, res) => {

    const result = validatePartialMovie(req.body)

    if (!result.success) {
        return res.status(400).json({error:JSON.parse(result.error.message)})
    }

    const {id} = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)

    if (movieIndex === -1) {
        return res.status(404).json({message: "Movie not found"})
    }

    const updateMovie = {
       ...movies[movieIndex],
       ...result.data
    }

    movies[movieIndex] = updateMovie

    return res.json(updateMovie)


})


//DELETE Method
app.delete('/movies/:id', (req, res) => {
    const origin = req.header('origin')
    if (ACCEPTED_ORIGINS.includes(origin) || !origin){
    res.header('Access-Control-Allow-Origin', origin || !origin )
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')


    }

    const {id} = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)

    if(movieIndex === -1) {
        return res.status(404).json({message: 'Not Found'})
    }
    movies.splice(movieIndex, 1)
    return res.json({message: 'Movie deleted'})
})

app.options('/movies/:id', (req, res) => {
    const origin = req.header('origin')
    if (ACCEPTED_ORIGINS.includes(origin) || !origin){
        res.header('Access-Control-Allow-Origin', origin)
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
        }
    res.send(200)
})



const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
})