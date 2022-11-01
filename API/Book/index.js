const express = require('express');
const router = express.Router();

// Databse Models
const BookModel = require('../../database/book');

/* 
    ROUTE        :  /
    DESCRIPTION  :  get all books
    ACCESS       :  public
    PARAMETERS   :  none    
    METHOD       :  GET
*/

router.get('/',async (req,res)=> {
    const getAllBooks = await BookModel.find();
    res.json({
        books: getAllBooks
    })
})

/* 
    ROUTE        :  /is
    DESCRIPTION  :  get specific book
    ACCESS       :  public
    PARAMETERS   :  isbn    
    METHOD       :  GET
*/

router.get('/is/:isbn', async (req,res)=> {

    const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn})

    if(!getSpecificBook) {
        res.json({Error : `book of isbn ${req.params.isbn} did not found`});
    }

    res.json({ book : getSpecificBook});
})

/* 
    ROUTE        :  /c
    DESCRIPTION  :  get list of books based on category
    ACCESS       :  public
    PARAMETERS   :  category
    METHOD       :  GET
*/

router.get('/c/:category', async (req,res)=> {
    const getAllBooksOfCategory = await BookModel.findOne({category:req.params.category})
    // const getAllBooksOfCategory = database.books.filter((book)=> {
    //     return book.category.includes(req.params.category);
    // })
    if(!getAllBooksOfCategory) {
        return res.json({
            Error: `No book found for the category of ${req.params.category} `
    })
    }

    return res.json({books: getAllBooksOfCategory});
})

/* 
    ROUTE        :  /a
    DESCRIPTION  :  get list of books based on author
    ACCESS       :  public
    PARAMETERS   :  author 
    METHOD       :  GET             // INCOMPLETE
*/

router.get('/a/:authorId', async (req,res) => {

    const getAllBooksOfAuthor = await BookModel.find({authors: parseInt(req.params.authorId)});
    // const getAllBooksOfAuthor = database.books.filter((book)=> {
    //    return book.authors.includes(parseInt(req.params.authorId));
    // })

    if(!getAllBooksOfAuthor) {
        return res.json({
            Error: `books of ${req.params.authorId} author not available `
        })
    }

    return res.json({
        books: getAllBooksOfAuthor
    })
})

/* 
    ROUTE        :  /book/new
    DESCRIPTION  :  add new book
    ACCESS       :  public
    PARAMETERS   :  none
    METHOD       :  POST
*/
router.post('/new', async (req,res)=> {
    const {newBook} = req.body ;
    await BookModel.create(newBook);
    res.json({
        message: 'book was added'
    })
})

/* 
    ROUTE        :  /book/update
    DESCRIPTION  :  update title of a book
    ACCESS       :  public
    PARAMETERS   :  isbn
    METHOD       :  PUT
*/

router.put('/update/:isbn', async (req,res)=> {
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn
        },
        {
           title: req.body.bookTitle 
        },
        {
            new: true
        }
    );

    res.json({
        books: updatedBook,
        message: "book title updated"
    })
})


/* 
    ROUTE        :  /book/author/update
    DESCRIPTION  :  update/add new Author
    ACCESS       :  public
    PARAMETERS   :  isbn
    METHOD       :  PUT              
*/

router.put("/author/update/:isbn", async(req,res)=> {
    // update the book database
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn
        },
        {
            $addToSet : {
                authors: req.body.newAuthor
            }
        },
        {
            new: true
        }
    )

    //update the author database
    
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            id:req.body.newAuthor
        },
        {
            $push : {
                books: req.params.isbn
            }
        },
        {
            new: true
        }
    )

    res.json({
        books : updatedBook,
        authors : updatedAuthor,
        message: "new author was added" 
    })
}); 


/* 
    ROUTE        :  /book/delete
    DESCRIPTION  :  delete a book
    ACCESS       :  public
    PARAMETERS   :  isbn
    METHOD       :  DELETE             
*/

router.delete('/delete/:isbn',async (req,res)=> {

    const updatedDatabase = await BookModel.findOneAndDelete(
        {
            ISBN: req.params.isbn
        }
    )
    // const updatedDatabase = database.books.filter((book)=> {
    //     return book.ISBN !== req.params.isbn;
    // })

    // database.books = updatedDatabase;

    res.json({
        books: updatedDatabase,
        message: "book deleted successfully"
    })
})

/* 
    ROUTE        :  /book/delete/author
    DESCRIPTION  :  delete a author from book
    ACCESS       :  public
    PARAMETERS   :  isbn , authorId
    METHOD       :  DELETE           
*/
router.delete("/delete/author/:isbn/:authorId",async (req,res)=> {

    // update book database 
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn
        },
        {
            $pull: {
                authors: parseInt(req.params.authorId) 
            }
        },
        {new:true}
    )
    // database.books.forEach((book)=> {
    //     if(book.ISBN === req.params.isbn) {
    //         const newAuthorList = book.authors.filter((author)=> author !== parseInt(req.params.authorId));
    //         book.authors = newAuthorList;
    //     }
    // }) 

    //update author database
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            authors: parseInt(req.params.authorId)
        },
        {
            $pull: {
                books: req.params.isbn
            }
        },
        { new : true }
    )
    // database.authors.forEach((author)=> {
    //     if(author.id === parseInt(req.params.authorId)) {
    //         const newBookList = author.books.filter((book)=> {
    //             return book !== req.params.isbn
    //         })
    //         author.books = newBookList;
    //         console.log(newBookList)
    //     }
    //     return;
    // })

    res.json({
        book: updatedBook,
        author : updatedAuthor,
        message : `deleted a author with id ${req.params.authorId} from book with isbn ${req.params.isbn}`
    })

})



module.exports = router;
