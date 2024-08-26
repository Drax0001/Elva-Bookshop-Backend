import express from 'express'
import { Book } from '../models/Book.js'
import { User } from '../models/User.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router()

// Add books to the database
router.post('/', async (req, res) => {
    try {
        if(!req.body.title || !req.body.author || !req.body.summary) {
            return res.status(400).send({
                message: 'Send all required fields'
            })
        }
        const newBook = {
            title: req.body.title,
            author: req.body.author,
            summary: req.body.summary,
        }
        const book = await Book.create(newBook)
        return res.status(201).send({ message: 'Book created successfully!', data: book })
    } catch (err) {
        console.log(err)
        res.status(500).send(err.message)
    }
})

// Getting all books from the database
router.get('/', protect, async (req, res) => {
    try {
        const permittedUser = req.user
        const books = await Book.find({})
        return books ?
            res.status(200).json({ booksCount: books.length, data: books, permittedUser: permittedUser })  
            : 
            res.status(404).send('No Books found in our catalog')
    } catch (err) {
        console.log(err)
        res.status(500).send(err.message)
    }
})

// Getting a specific book from the database
router.get('/:materialId', async (req, res) =>{
    try {
        const { materialId } = req.params
        const book = await Book.findById(materialId)
        if(book) {
            return res.status(201).json(book)
        }
        return res.status(404).send('Book not found')
    } catch(err) {
        console.log(err);
        res.status(500).send(err.message);
    }
    
})

// Updating a book from the database
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { title, author, summary } = req.body;
        if(!title || !author || !summary) {
            return res.status(400).send({message: 'Send all fields: title, author, summary'});
        }
        const updatedBook = await Book.findByIdAndUpdate(id, req.body)
        
        return updatedBook ? res.status(200).send({message: 'Updated book successfully'}) : res.status(404).send({message: 'Book not found'})

    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
})

// Deleting a book from catalog
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const deletedBook = await Book.findByIdAndDelete(id)
        const updatedBooks = await Book.find({})
        //return deletedBook ? res.status(200).send({ message: 'Deleted book successfully', data: Book.find({}) }) : res.status(404).send({message: 'Book not found'})
        if(deletedBook) {
            return res.status(200).send({ message: 'Book deleted successfully', data: updatedBooks });
        } else {
            return res.status(404).send({ message: 'Book not found' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
})

// Browsing the Catalog
// router.get("/", async(req, res) => {
//     try {
//         const { q } = req.query;

//         const books = await Book.find({$regex: q})

//         // const keys = ["title", "author"];

//         // const search = (data) => {
//         // return data.filter((item) =>
//         //     keys.some((key) => item[key].toLowerCase().includes(q.toLowerCase()))
//         // )};

//         res.json(books)

//     } catch(err) {
//         console.log(err);
//         res.status(500).send(err.message);
//     }
// });

export default router;