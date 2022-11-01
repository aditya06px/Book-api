const express = require('express');
const router = express.Router();

// Databse Models
const AuthorModel = require('../../database/author');

/* 
    ROUTE        :  /authors
    DESCRIPTION  :  get all author
    ACCESS       :  public
    PARAMETERS   :  none
    METHOD       :  GET
*/
router.get('/', async (req,res)=> {
    const getAllAuthors = await AuthorModel.find();
    res.json({
        authors: getAllAuthors
    })
})

/* 
    ROUTE        :  /authors
    DESCRIPTION  :  get specific author based on  book's isbn
    ACCESS       :  public
    PARAMETERS   :  isbn
    METHOD       :  GET
*/
router.get('/:isbn', async (req,res)=> {
    const getSpecificBooksOfAuthors = await AuthorModel.find({books: req.params.isbn});
    // const getSpecificAuthors = database.authors.filter((author)=> {
    //     return author.books.includes(req.params.isbn);
    // })

    if(!getSpecificBooksOfAuthors) {
        return res.json({
            Error: `author ${req.params.isbn} did not found`
        })
    }

    res.json({
        author : getSpecificBooksOfAuthors
    })
})

/* 
    ROUTE        :  /authors/a
    DESCRIPTION  :  get specific author id
    ACCESS       :  public
    PARAMETERS   :  id                
    METHOD       :  GET
*/
router.get('/a/:id', async (req,res)=> {

    const getAuthor = await AuthorModel.findOne({id: parseInt(req.params.id)})
    // const author = database.authors.filter((author)=> {
    //    return author.id === parseInt(req.params.id)
    // })
    if(!getAuthor) {
        return res.json({
            Error: `No Author found with id ${req.params.id}`
        })
    }
   
    return res.json({
        authors : getAuthor
    })

})

/* 
    ROUTE        :  /author/new
    DESCRIPTION  :  add new author
    ACCESS       :  public
    PARAMETERS   :  none
    METHOD       :  POST
*/

router.post("/new", async (req,res)=> {
    const {newAuthor} = req.body;
    await AuthorModel.create(newAuthor); 
    res.json({
        message: 'new author was added'
    })
})

/* 
    ROUTE        :  /author/update
    DESCRIPTION  :  Author details ( name ) USING ID
    ACCESS       :  public
    PARAMETERS   :  id
    METHOD       :  PUT              
*/ 

router.put("/update/:id", async (req,res)=> {

    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: parseInt(req.params.id)
        },
        {
            name: req.body.name
        },
        { 
            new:true 
        }
    )
    res.json({
        author: updatedAuthor,
        message: "author updated successfully "
    })
})

/* 
    ROUTE        :  /author/delete/
    DESCRIPTION  :  delete a Author with id 
    ACCESS       :  public
    PARAMETERS   :  id
    METHOD       :  DELETE            
*/

router.delete("/delete/:id", async (req,res)=> {
    //delete author from author database
    const updatedAuthor =  await AuthorModel.findOneAndDelete(
        {
            id : parseInt(req.params.id)
        },
        {
            new: true
        }
    )
    // const updatedDatabase = database.authors.filter((author)=> {
    //     return author.id !== parseInt(req.params.id);
    // })

    // database.authors = updatedDatabase;

    //delete author from book databse

    const updatedBooks = await BookModel.updateMany(
        {
            authors : parseInt(req.params.id)
        },
        {
            $pull: {
                authors: parseInt(req.params.id)
            }
        },
        {new:true}
    )
    // database.books.forEach((book)=> {

    //     const author = book.authors.filter((author)=> {
    //         return author !== parseInt(req.params.id);
    //     })
    //     book.authors = author;
    // });

    res.json({
        books: database.books,
        authors: database.authors,
        message: "author deleted successfully"
    })
})


module.exports = router;
