const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: true  // to support parsing of application/x-www-form-urlencoded data
}));

// currently saving data in a list for now; later we will use MongoDB
const productData = [];

// Start the server
app.listen(2000, () => {
    console.log("Server is running on port 2000");
});

// POST API to add a product
app.post('/api/products', (req, res) => {

    // Check if data is being received
    console.log("Received Data:", req.body, req.query);

    // Create the product object from body or query parameters
    const pddata = {
        "id": productData.length + 1,  // Increment ID based on array length
        "pname": req.body.pname || req.query.pname,  // Support both body and query params
        "pprice": req.body.pprice || req.query.pprice,
        "pdesc": req.body.pdesc || req.query.pdesc
    };

    // Check if pname, pprice, and pdesc are undefined (invalid input)
    if (!pddata.pname || !pddata.pprice || !pddata.pdesc) {
        return res.status(400).send({
            "status code": 400,
            "message": "Invalid product data"
        });
    }

    // Store product data in the list
    productData.push(pddata);
    console.log('Final Product:', pddata);

    // Return success response
    res.status(200).send({
        "status code": 200,
        "message": "Product added successfully",
        "product": pddata
    });
});

// GET API to retrieve all products
app.get('/api/getProduct', (req, res) => {

    // If there are products, return them
    if (productData.length > 0) {
        return res.status(200).send({
            "status code": 200,
            "products": productData
        });
    }

    // If no products exist, return an empty list
    return res.status(200).send({
        "status code": 200,
        "products": []
    });
});

//update api
app.put('/api/update/:id', (req, res) => {
    // find the product by id
    let productId = req.params.id * 1;  //here we are getting the productId from the route and *1 is used to convert it from string to integer
    
    //below we get that specific product from the list
    let productToUpdate = productData.find(p=> p.id === productId);  //this p will ittrate all the products in over list and here we finding object .id where it match exectly with the id we get from our url and after it is fetch it will be saved into productToUpdate

    //after that we need to find the index of that object means 'productToUpdate'
    let index = productData.indexOf(productToUpdate);

    //below what ever data is recived i am setting at in this place
    productData[index]= req.body;

    //after thatv we will respond back

    res.status(200).send({
        'status': 'success',
        'message': 'Product updated successfully'
    })

})

// DELETE API to delete a product
app.delete('/api/deleteProduct/:id', (req, res) => {
    let productId = Number(req.params.id);
    let productToDelete = productData.find(p => p.id === productId);

    if (!productToDelete) {
        return res.status(404).send({
            status: 'fail',
            message: 'Product not found'
        });
    }

    let index = productData.indexOf(productToDelete);
    productData.splice(index, 1); // delete product

    res.status(200).send({
        status: 'success',
        message: 'Product deleted successfully'
    });
});
