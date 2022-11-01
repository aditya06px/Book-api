const express = require('express');
const router = express.Router();

// Databse Models
const PublicationModel = require('../../database/publication');

/* 
    ROUTE        :  /publication
    DESCRIPTION  :  get all publications
    ACCESS       :  public
    PARAMETERS   :  none
    METHOD       :  GET   // INCOMPLETE 
*/      
router.get('/', async (req,res)=> {
    
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

router.get('/:isbn', async (req,res)=> {
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
router.get('/p/:id', async (req,res)=> {
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
    ROUTE        :  /publication/new
    DESCRIPTION  :  add new publication
    ACCESS       :  public
    PARAMETERS   :  none
    METHOD       :  POST
*/
router.post('/new', async (req,res)=> {
    const {newPublication} = req.body ;
    await PublicationModel.create(newPublication);
    res.json({
        message: 'new publication was added'
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

router.put('/update/book/:isbn', async (req,res)=>{
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

router.put("/update/name/:id", async (req,res)=> {
    
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
    ROUTE        :  /publication/delete/book
    DESCRIPTION  :  delete a book from publication
    ACCESS       :  public
    PARAMETERS   :  isbn , pubId
    METHOD       :  DELETE             
*/

router.delete("/delete/book/:isbn/:pubId", async (req,res)=> {

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

router.delete('/delete/:id', async (req,res)=> {
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


module.exports = router;
