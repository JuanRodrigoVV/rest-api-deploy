const z = require('zod')

const movieSchema = z.object({
    title: z.string({
     required_error: 'Title is required'
    }),
    director: z.string(),
    duration: z.number().int(),
    year: z.number().int().positive(),
    rate: z.number().min(0).max(10).default(5),
    poster: z.string().url({message: 'Invalid URL'}),
    genre: z.array(z.enum(['Action', 'Adventure', 'Drama', 'Comedy', 'Fantasy', 'Horror']), {
     required_error: 'Genre is required'
    })

 })

function validateMovie (input) {
    return movieSchema.safeParse(input)
 }

function validatePartialMovie(input) {
   return movieSchema.partial().safeParse(input)
}



 module.exports = {
    validateMovie,
    validatePartialMovie
 }