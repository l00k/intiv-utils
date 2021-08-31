import Author from './Author';


/**
 * those types should be wrong!!
 */
const wrongConstructors = [
    new Author(1),
    new Author({ unknown: true }),
    new Author({ active: 4 }),
]
