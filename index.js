require('dotenv').config();

// database 
const database = require('./database/database.js');

const mongoose = require('mongoose');

// Models
const BookModel = require('./database/book');
const AuthorModel = require('./database/author');
const PublicationModel = require('./database/publication');

// Initializing Express
const express = require('express');
const app = express();

// Configurations
app.use(express.json());

 mongoose.connect(process.env.MONGO_URL)
.then(()=> console.log("mongodb connected"));


        //    BOOKS   // 
/* 
    ROUTE        :  /
    DESCRIPTION  :  get all books
    ACCESS       :  public
    PARAMETERS   :  none    
    METHOD       :  GET
*/

app.get('/',async (req,res)=> {
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

app.get('/is/:isbn', async (req,res)=> {

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

app.get('/c/:category', async (req,res)=> {
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

app.get('/a/:authorId', async (req,res) => {

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

/* ------------------------------------------------------------------------------------------- */

                    //  AUTHOR //
/* 
    ROUTE        :  /authors
    DESCRIPTION  :  get all author
    ACCESS       :  public
    PARAMETERS   :  none
    METHOD       :  GET
*/
app.get('/authors', async (req,res)=> {
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
app.get('/authors/:isbn', async (req,res)=> {
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
app.get('/authors/a/:id', async (req,res)=> {

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

/* ------------------------------------------------------------------------------------------- */

                    //  PUBLICATIONS //
/* 
    ROUTE        :  /PUBLICATIONS
    DESCRIPTION  :  get all publications
    ACCESS       :  public
    PARAMETERS   :  none
    METHOD       :  GET   // INCOMPLETE 
*/      
app.get('/publications', async (req,res)=> {
    
    const getAllPublications = await PublicationModel.find();

    res.json({
        publications: getAllPublications
    })
})

/* 
    ROUTE        :  /PUBLICATIONS
    DESCRIPTION  :  get specific publications on book's isbn 
    ACCESS       :  public
    PARAMETERS   :  name
    METHOD       :  GET
*/

app.get('/publications/:isbn', async (req,res)=> {
    const getSpecificPublication = await PublicationModel.find(
        {books: req.params.isbn}
    );
    // const publication = database.publications.filter((publication)=> {
    //    return  publication.books.includes(req.params.isbn);
    // })

    if(!getSpecificPublication) {
        return res.json({
            Error: `No book found for publication ${req.params.isbn}`
        })
    }

    return res.json({
        publication : getSpecificPublication
    })
})

/* 
    ROUTE        :  /publications/p
    DESCRIPTION  :  get specific publication with id
    ACCESS       :  public
    PARAMETERS   :  id                
    METHOD       :  GET
*/
app.get('/publications/p/:id', async (req,res)=> {
    console.log("this is publication route");
   const getSpecificPublication = await PublicationModel.findOne({id: parseInt(req.params.id)}) 
//    const publication = database.publications.filter((publication)=> {
//     return publication.id === parseInt(req.params.id);
//    })
   if(!getSpecificPublication ) {
    return res.json({
        Error: `No publication found with this id of ${req.params.id} `
    })
   }

   res.json({
    publication : getSpecificPublication
   });
})



/* 
    ROUTE        :  /book/new
    DESCRIPTION  :  add new book
    ACCESS       :  public
    PARAMETERS   :  none
    METHOD       :  POST
*/
app.post('/book/new', async (req,res)=> {
    const {newBook} = req.body ;
    await BookModel.create(newBook);
    res.json({
        message: 'book was added'
    })
})

/* 
    ROUTE        :  /author/new
    DESCRIPTION  :  add new author
    ACCESS       :  public
    PARAMETERS   :  none
    METHOD       :  POST
*/

app.post("/author/new", async (req,res)=> {
    const {newAuthor} = req.body;
    await AuthorModel.create(newAuthor); 
    res.json({
        message: 'new author was added'
    })
})

/* 
    ROUTE        :  /publication/new
    DESCRIPTION  :  add new publication
    ACCESS       :  public
    PARAMETERS   :  none
    METHOD       :  POST
*/
app.post('/publication/new', async (req,res)=> {
    const {newPublication} = req.body ;
    await PublicationModel.create(newPublication);
    res.json({
        message: 'new publication was added'
    })
})

/* 
    ROUTE        :  /book/update
    DESCRIPTION  :  update title of a book
    ACCESS       :  public
    PARAMETERS   :  isbn
    METHOD       :  PUT
*/

app.put('/book/update/:isbn', async (req,res)=> {
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

app.put("/book/author/update/:isbn", async(req,res)=> {
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
    ROUTE        :  /author/update
    DESCRIPTION  :  Author details ( name ) USING ID
    ACCESS       :  public
    PARAMETERS   :  id
    METHOD       :  PUT              
*/ 

app.put("/author/update/:id", async (req,res)=> {

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
    ROUTE        :  /publication/update/book
    DESCRIPTION  :  update/add new book to publication
    ACCESS       :  public
    PARAMETERS   :  isbn
    METHOD       :  PUT             
*/
// should remove the book from the previous publication ! important

app.put('/publication/update/book/:isbn', async (req,res)=>{
    //update publication database
    const updatedPublication = await PublicationModel.findOneAndUpdate(  // returns null
        {
            id: req.body.pubId
        },
        {
            $addToSet: {
                books: req.params.isbn
            }
        },
        {
            new: true
        }
    )
    // database.publications.forEach((publication)=> {
    //     if(publication.id === req.body.pubId) {
    //         publication.books.push(req.params.isbn);
    //         return;
    //     }
    // })

    //update books database
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn
        },
        {
            publication: req.body.pubId
        }
    )
    // database.books.forEach((book)=> {
    //     if(book.ISBN === req.params.isbn) {
    //         book.publication = req.body.pubId;
    //         return;
    //     }
    // });

    res.json({
        message: "Successfully updated publication"
    })
})

/* 
    ROUTE        :  /publication/update/name
    DESCRIPTION  :  publication details NAME USING ID
    ACCESS       :  public
    PARAMETERS   :  id
    METHOD       :  PUT             
*/

app.put("/publication/update/name/:id", async (req,res)=> {
    
    const updatedPublication = await PublicationModel.findOneAndUpdate(
        {
            id: parseInt(req.params.id)
        },
        {
            name: req.body.name
        },
        { new:true }
    )
    // database.publications.forEach((publication)=> {
    //     if(publication.id === parseInt(req.params.id)) {
    //         publication.name = req.body.name
    //     }
    // });

    res.json({
        publications : updatedPublication,
        message: "publication name changed successfully "
    })
})

/* 
    ROUTE        :  /book/delete
    DESCRIPTION  :  delete a book
    ACCESS       :  public
    PARAMETERS   :  isbn
    METHOD       :  DELETE             
*/

app.delete('/book/delete/:isbn',async (req,res)=> {

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
app.delete("/book/delete/author/:isbn/:authorId",async (req,res)=> {

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

/* 
    ROUTE        :  /author/delete/
    DESCRIPTION  :  delete a Author with id 
    ACCESS       :  public
    PARAMETERS   :  id
    METHOD       :  DELETE            
*/

app.delete("/author/delete/:id", async (req,res)=> {
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

/* 
    ROUTE        :  /publication/delete/book
    DESCRIPTION  :  delete a book from publication
    ACCESS       :  public
    PARAMETERS   :  isbn , pubId
    METHOD       :  DELETE             
*/

app.delete("/publication/delete/book/:isbn/:pubId", async (req,res)=> {

    //update publication databse
    const updatedPublication = await PublicationModel.findOneAndUpdate (
        {
            id: parseInt(req.params.pubId)
        },
        {
            $pullAll: {
                books: [req.params.isbn]
            }
        },
        {new: true}
    )
    // database.publications.forEach((publication)=> {
    //     if(publication.id === parseInt(req.params.pubId)) {
    //         const newBookList = publication.books.filter((book)=> {
    //             return book !== req.params.isbn
    //         })

    //         publication.books  = newBookList;
    //     }
    // })

    //update book databse
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn
        },
        {
            publication: 0
        },
        {new: true}


    ) 
    // database.books.forEach((book) => {
    //     if(book.ISBN === req.params.isbn){
    //         book.publication = 0;   // no publication available
    //         return;
    //     }
    // })

    res.json({
        books: updatedBook,
        publication:  updatedPublication,
        message: "deleted a book from publication"
    })
})

/* 
    ROUTE        :  /publication/delete
    DESCRIPTION  :  delete a  publication
    ACCESS       :  public
    PARAMETERS   :  id
    METHOD       :  DELETE             
*/

app.delete('/publication/delete/:id', async (req,res)=> {
    // delete publication from publication database
    
    const updatedPublication = await PublicationModel.findOneAndDelete(
        {
          id: parseInt(req.params.id)  
        },
        {new:true}
    )
    // const updatedDatabase = database.publications.filter((publication)=> {
    //     return publication.id !== parseInt(req.params.id);
    // })

    // database.publications = updatedDatabase;

    //make publication equals to zero IN book database
const updatedBooks = await BookModel.updateMany(
    {
        publication: parseInt(req.params.id)  
    },
    {
        publication:0
    },
    {new:true}
)

    // database.books.forEach((book)=> {
    //     if(book.publication === parseInt(req.params.id)) {
    //         book.publication = 0;
    //         return;
    //     }
    // });

    res.json({
        books: updatedPublication,
        publication: updatedBooks,
        message: "publication deleted successfully"
    })
})

app.listen(3000,() => {
    console.log('server is running at port 3000');
})

   //  BOOK   // 
//POST 
// create a New book  -- DONE 

//PUT 
// update book details -- DONE
// update/ADD new author -- DONE

//DELETE 
// delete a book  -- DONE
// delete a author from a book -- DONE 

   //  AUTHOR   // 
//POST 
// create a New Author -- DONE

//PUT 
// Author details  USING ID  -- DONE 

//DELETE 
// delete an author  -- DONE


   //  PUBLICATION   // 
//POST 
// create a New Publication  -- DONE

//PUT 
// publication details NAME USING ID  -- DONE
//update/add new book to publication  -- 
// delete a publication           --DONE
//delete a book from publication  -- DONE
