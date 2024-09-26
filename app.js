const express = require("express");
const app = express();
const path = require('path');
const port = 3000;

const fs = require("fs");
const filePath = './libraryData.json'

app.use(express.json());


if(!fs.existsSync(filePath)){
    

    fs.writeFileSync(filePath, '', 'utf-8');
    console.log("File created")
}else{
    console.log('File already exists.');
}



app.get('/', (req, res) => {
    
    fs.readFile(filePath, 'utf-8', (err, data) =>{
        if(err){
            return res.status(500).json({ message: "error to read file", error:err})
        }

        const books = JSON.parse(data);
        res.json(books);
    })
    
})

app.get('/:id', (req, res) =>{

    const bookId = req.params.id;

    fs.readFile(filePath, "utf-8", (err, data) =>{
        if (err) {
            return res.status(500).json({message: "Error to read file", error: err})
        }

        const books = JSON.parse(data);

        const book = books.find(b => b.id === bookId);

        if (book) {
            res.json(book);
        }else{
            res.status(404).json({ massage: "book not find"});
        }
    })
    
})

app.post('/', (req, res) =>{

    const dataFromBody = req.body;

    const filePath = path.join(__dirname, 'libraryData.json');

    fs.writeFile(filePath, JSON.stringify(dataFromBody, null, 2), (err) =>{
        if(err){
            console.error('Error writing to file', err)
            return res.status(500).json({ message: 'Failed to save data'})
        }

    console.log('Data successfully written to file');
    res.json({ message: 'Data saved to JSON file', data: dataFromBody})

    });
});

app.put('/:id', (req, res) => {
    const bookId = req.params.id;
    const updatedBookData = req.body;
  
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ message: 'Error reading file', error: err });
      }
  
      const books = JSON.parse(data);
      const bookIndex = books.findIndex(b => b.id === bookId);
  
      if (bookIndex !== -1) {
        // Update the book's properties
        const updatedBook = { ...books[bookIndex], ...updatedBookData };
  
        // Update the book in the array
        books[bookIndex] = updatedBook;
  
        // Write the updated array back to the file
        fs.writeFile(filePath, JSON.stringify(books, null, 2), (writeErr) => {
          if (writeErr) {
            return res.status(500).json({ message: 'Error writing file', error: writeErr });
          }
          res.json({ message: 'Book updated successfully!', data: updatedBook });
        });
      } else {
        res.status(404).json({ message: 'Book not found' });
      }
    });
  });


app.patch('/', (req, res) =>{
    
})

app.delete('/:id', (req, res) =>{
    
    const bookId = req.params.id;

    fs.readFile(filePath, 'utf-8', (err, data) =>{
        if (err) {
            return res.status(500).json({ message: 'Error reading file', error: err });
        }

        let books = JSON.parse(data);
        const initialLength = books.length;

        books= books.filter(b => b.id !== bookId);

        if(books.length < initialLength){
            fs.writeFile(filePath, JSON.stringify(books, null, 2), (writeErr) => {
                if(writeErr){
                    return res.status(500).json({ message: 'Error writing file', error: writeErr });
                }
                res.json({ message: 'Book deleted successfully'});
            });
        }else{
            res.status(404).json({ message: 'Book not found'})
        }
    });
});

app.listen(port, () =>{
    console.log(`Server running at http://localhost:${port}/`);
})