require('dotenv').config();

const database = require('./database/database.js');
// import { books , authors , publications } from "./database/database.js";

const mongoose = require('mongoose');

const express = require('express');
const app = express();

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

app.get('/',(req,res)=> {
    return res.json({
        books: database.books
    })
})

/* 
    ROUTE        :  /is
    DESCRIPTION  :  get specific book
    ACCESS       :  public
    PARAMETERS   :  isbn    
    METHOD       :  GET
*/

app.get('/is/:isbn',(req,res)=> {

    const getSpecificBook = database.books.filter((book) => {
      return book.ISBN === req.params.isbn;
    })

    if(getSpecificBook.length === 0) {
        res.json({Error : `book of id ${req.params.isbn} did not found`});
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

app.get('/c/:category',(req,res)=> {
    const getAllBooksOfCategory = database.books.filter((book)=> {
        return book.category.includes(req.params.category);
    })

    if(getAllBooksOfCategory.length === 0) {
        return res.json({
            Error: `No book found for the category of ${req.param.category} `
    })
    }

    return res.json({books: getAllBooksOfCategory});
})

/* 
    ROUTE        :  /a
    DESCRIPTION  :  get list of books based on author
    ACCESS       :  public
    PARAMETERS   :  author
    METHOD       :  GET
*/

app.get('/a/:authorId',(req,res) => {
    const getAllBooksOfAuthor = database.books.filter((book)=> {
       return book.authors.includes(parseInt(req.params.authorId));
    })

    if(getAllBooksOfAuthor.length == 0) {
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
app.get('/authors',(req,res)=> {
    res.json({
        authors: database.authors
    })
})

/* 
    ROUTE        :  /authors
    DESCRIPTION  :  get specific author based on  book's isbn
    ACCESS       :  public
    PARAMETERS   :  isbn
    METHOD       :  GET
*/
app.get('/authors/:isbn',(req,res)=> {
    const getSpecificAuthors = database.authors.filter((author)=> {
        return author.books.includes(req.params.isbn);
    })

    if(getSpecificAuthors.length === 0) {
        return res.json({
            Error: `author ${req.params.isbn} did not found`
        })
    }

    res.json({
        author : getSpecificAuthors
    })
})

/* 
    ROUTE        :  /authors/a
    DESCRIPTION  :  get specific author id
    ACCESS       :  public
    PARAMETERS   :  id                // INCOMPLETE
    METHOD       :  GET
*/
app.get('/authors/a/:id',(req,res)=> {
    const author = database.authors.filter((author)=> {
       return author.id === parseInt(req.params.id)
    })
    if(author.length === 0) {
        return res.json({
            Error: `No Author found with id ${req.params.id}`
        })
    }
   
    return res.json({
        authors : author
    })

})

/* ------------------------------------------------------------------------------------------- */

                    //  PUBLICATIONS //
/* 
    ROUTE        :  /PUBLICATIONS
    DESCRIPTION  :  get all publications
    ACCESS       :  public
    PARAMETERS   :  none
    METHOD       :  GET
*/      
app.get('/publications',(req,res)=> {
    return res.json({
        publications: database.publications
    })
})

/* 
    ROUTE        :  /PUBLICATIONS
    DESCRIPTION  :  get specific publications on book's isbn 
    ACCESS       :  public
    PARAMETERS   :  name
    METHOD       :  GET
*/

app.get('/publications/:isbn',(req,res)=> {
    const publication = database.publications.filter((publication)=> {
       return  publication.books.includes(req.params.isbn);
    })

    if(publication.length === 0) {
        return res.json({
            Error: `No book found for publication ${req.params.isbn}`
        })
    }

    return res.json({
        publication : publication
    })
})

/* 
    ROUTE        :  /publications/p
    DESCRIPTION  :  get specific publication with id
    ACCESS       :  public
    PARAMETERS   :  id                // INCOMPLETE
    METHOD       :  GET
*/
app.get('/publications/p/:id',(req,res)=> {
   const publication = database.publications.filter((publication)=> {
    return publication.id === parseInt(req.params.id);
   })
   if(publication.length === 0) {
    return res.json({
        Error: `No publication found with this id of ${req.params.id} `
    })
   }

   res.json({
    publication 
   });
})



/* 
    ROUTE        :  /book/new
    DESCRIPTION  :  add new book
    ACCESS       :  public
    PARAMETERS   :  none
    METHOD       :  POST
*/
app.post('/book/new', (req,res)=> {
    const newBook = req.body ;
    database.books.push(newBook);
    res.json({
        books:database.books,
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

app.post("/author/new",(req,res)=> {
    const newAuthor = req.body;
    database.authors.push(newAuthor);
    res.json({
        authors:database.authors,
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
app.post('/publication/new',(req,res)=> {
    const newPublication = req.body ;
    console.log(newPublication);
    database.publications.push(newPublication);
    res.json({
        publications:database.publications,
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

app.put('/book/update/:isbn',(req,res)=> {
    database.books.forEach((book)=> {
        if(book.ISBN === req.params.isbn) {
            book.title = req.body.bookTitle;
            return;
        }
    });

    res.json({
        books: database.books,
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

app.put("/book/author/update/:isbn",(req,res)=> {
    // update the book database
    database.books.forEach((book)=> {
        if(book.ISBN === req.params.isbn) {
            return book.authors.push(req.body.newAuthor);
        }
    })

    //update the author database
    database.authors.forEach((author)=> {
        if(author.id === req.body.newAuthor) {
            return author.books.push(req.params.isbn);
        }
    })

    res.json({
        books : database.books,
        authors : database.authors,
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

app.put("/author/update/:id",(req,res)=> {
    database.authors.forEach((author)=> {
        if(author.id === parseInt(req.params.id)){
            author.name = req.body.name;
        }
    })

    res.json({
        authors: database.authors,
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

app.put('/publication/update/book/:isbn',(req,res)=>{
    //update publication database
    database.publications.forEach((publication)=> {
        if(publication.id === req.body.pubId) {
            publication.books.push(req.params.isbn);
            return;
        }
    })

    //update books database
    database.books.forEach((book)=> {
        if(book.ISBN === req.params.isbn) {
            book.publication = req.body.pubId;
            return;
        }
    });

    res.json({
        books: database.books,
        publications : database.publications,
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

app.put("/publication/update/name/:id",(req,res)=> {
    database.publications.forEach((publication)=> {
        if(publication.id === parseInt(req.params.id)) {
            publication.name = req.body.name
        }
    });

    res.json({
        publications : database.publications,
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

app.delete('/book/delete/:isbn',(req,res)=> {
    const updatedDatabase = database.books.filter((book)=> {
        return book.ISBN !== req.params.isbn;
    })

    database.books = updatedDatabase;

    res.json({
        books: database.books,
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
app.delete("/book/delete/author/:isbn/:authorId",(req,res)=> {

    // update book databse 
    database.books.forEach((book)=> {
        if(book.ISBN === req.params.isbn) {
            const newAuthorList = book.authors.filter((author)=> author !== parseInt(req.params.authorId));
            book.authors = newAuthorList;
        }
    }) 

    //update author database
    database.authors.forEach((author)=> {
        if(author.id === parseInt(req.params.authorId)) {
            const newBookList = author.books.filter((book)=> {
                return book !== req.params.isbn
            })
            author.books = newBookList;
            console.log(newBookList)
        }
        return;
    })

    res.json({
        book: database.books,
        author : database.authors,
        message : "author was deleted"
    })

})

/* 
    ROUTE        :  /author/delete/
    DESCRIPTION  :  delete a Author with id 
    ACCESS       :  public
    PARAMETERS   :  id
    METHOD       :  DELETE             
*/

app.delete("/author/delete/:id",(req,res)=> {
    //delete author from author databse 
    const updatedDatabase = database.authors.filter((author)=> {
        return author.id !== parseInt(req.params.id);
    })

    database.authors = updatedDatabase;

    //delete author from book databse
    database.books.forEach((book)=> {
        const author = book.authors.filter((author)=> {
            return author !== parseInt(req.params.id);
        })
        book.authors = author;
    });

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

app.delete("/publication/delete/book/:isbn/:pubId",(req,res)=> {

    //update publication databse
    database.publications.forEach((publication)=> {
        if(publication.id === parseInt(req.params.pubId)) {
            const newBookList = publication.books.filter((book)=> {
                return book !== req.params.isbn
            })

            publication.books  = newBookList;
        }
    })

    //update book databse 
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn){
            book.publication = 0;   // no publication available
            return;
        }
    })

    res.json({
        books: database.books,
        publication: database.publications
    })
})

/* 
    ROUTE        :  /publication/delete
    DESCRIPTION  :  delete a  publication
    ACCESS       :  public
    PARAMETERS   :  id
    METHOD       :  DELETE             
*/

app.delete('/publication/delete/:id',(req,res)=> {
    // delete publication from publication database 
    const updatedDatabase = database.publications.filter((publication)=> {
        return publication.id !== parseInt(req.params.id);
    })

    database.publications = updatedDatabase;

    //make publication equals to zero IN book database
    database.books.forEach((book)=> {
        if(book.publication === parseInt(req.params.id)) {
            book.publication = 0;
            return;
        }
    });

    res.json({
        books: database.books,
        publication: database.publications,
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
//update/add new book to publication  -- DONE

//DELETE 
// delete a publication           --DONE
//delete a book from publication  -- DONE
