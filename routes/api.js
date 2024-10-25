/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

module.exports = function (app) {
  const Book = require('../models/books_model.js');

  app
    .route('/api/books')
    .get(async function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      let error;
      let result;
      try {
        result = await Book.find({}).select('-__v').exec();
      } catch (err) {
        error = err;
      }

      if (error) {
        res.status(200).json(error);
      } else {
        res.status(200).json(result);
      }
    })

    .post(async function (req, res) {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      let error;
      let newBook;
      try {
        // console.log(req.body);

        newBook = new Book({ title });
        await newBook.validate();
        await newBook.save();
      } catch (err) {
        error = err;
      }

      if (error) {
        res.status(200).type('text').send('missing required field title');
      } else {
        res.status(200).json({
          _id: newBook._id,
          title: newBook.title,
        });
      }
    })

    .delete(async function (req, res) {
      //if successful response will be 'complete delete successful'
      let error;
      let result;
      try {
        result = await Book.deleteMany({});
      } catch (err) {
        error = err;
      }

      if (error) {
        res.status(200).json(error);
      } else if (!result) {
        res.status(200).type('text').send('no book exists');
      } else {
        res.status(200).type('text').send('complete delete successful');
      }
    });

  app
    .route('/api/books/:id')
    .get(async function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      let error;
      let result;
      console.log(bookid);
      try {
        result = await Book.findById({ _id: bookid }).select('-__v').exec();
      } catch (err) {
        error = err;
      }

      if (error) {
        res.status(200).json(error);
      } else if (!result) {
        res.status(200).type('text').send('no book exists');
      } else {
        res.status(200).json(result);
      }
    })

    .post(async function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if (!comment) {
        res.status(200).type('text').send('missing required field comment');
        return;
      }
      let error;
      let result;
      try {
        result = await Book.findById({ _id: bookid }).select('-__v').exec();
        if (result) {
          result.comments.push(comment);
          await result.save();
        }
      } catch (err) {
        error = err;
      }

      if (error) {
        res.status(200).json(error);
      } else if (!result) {
        res.status(200).type('text').send('no book exists');
      } else {
        res.status(200).json(result);
      }
    })

    .delete(async function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      let error;
      let result;
      try {
        //console.log(bookid);
        if (bookid) {
          result = await Book.findByIdAndDelete({ _id: bookid }).exec();
        }
      } catch (err) {
        error = err;
      }

      if (error) {
        res.status(200).json(error);
      } else if (!result) {
        res.status(200).type('text').send('no book exists');
      } else {
        res.status(200).type('text').send('delete successful');
      }
    });
};
