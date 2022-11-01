require('dotenv').config();

const mongoose = require('mongoose');

//Routes
const Books = require('./API/Book');
const Authors = require('./API/Author');
const Publications = require('./API/Publication');

// Initializing Express
const express = require('express');
const app = express();

// Configurations
app.use(express.json());

 mongoose.connect(process.env.MONGO_URL)
.then(()=> console.log("mongodb connected"));

app.use('/book',Books);
app.use('/author',Authors);
app.use('/publication',Publications);


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
