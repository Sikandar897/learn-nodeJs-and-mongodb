const express = require("express");
const mongoose = require("mongoose");
const Product = require("./products");  // Import product schema
const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: true  // to support parsing of application/x-www-form-urlencoded data
}));

// currently saving data in a list for now; later we will use MongoDB
const productData = [];


//connect to Mongoose
mongoose.set('strictQuery', true);

mongoose.connect("mongodb+########://userNameHere:<passwordhere>@learningmongo############/Flutter").then(() => {
    console.log("DataBase Status:", "Connected to MongoDB");

    /* POST API to add a product with database */

    app.post('/api/products', async (req, res) => {
        // Check if data is being received
        console.log("Received Data:", req.body, req.query);

        // Combine both body and query parameters (query params will take precedence if provided)
        const productData = {
            pname: req.body.pname || req.query.pname,
            pprice: req.body.pprice || req.query.pprice,
            pdesc: req.body.pdesc || req.query.pdesc
        };

        // Validate that all required fields are present
        if (!productData.pname || !productData.pprice || !productData.pdesc) {
            return res.status(400).json({
                status: 'Invalid product data: pname, pprice, and pdesc are required'
            });
        }

        // Create a new product with the received data
        let data = new Product(productData);

        try {
            let dataToStore = await data.save();
            res.status(200).json(dataToStore);
        } catch (error) {
            res.status(400).json({
                status: error.message,
            });
        }
    });

    /*  --------------------------------------------------------------------*/


    /* below is post api without database*/

    // // Create the product object from body or query parameters
    // const pddata = {
    //     "id": productData.length + 1,  // Increment ID based on array length
    //     "pname": req.body.pname || req.query.pname,  // Support both body and query params
    //     "pprice": req.body.pprice || req.query.pprice,
    //     "pdesc": req.body.pdesc || req.query.pdesc
    // };

    // // Check if pname, pprice, and pdesc are undefined (invalid input)
    // if (!pddata.pname || !pddata.pprice || !pddata.pdesc) {
    //     return res.status(400).send({
    //         "status code": 400,
    //         "message": "Invalid product data"
    //     });
    // }

    // // Store product data in the list
    // productData.push(pddata);
    // console.log('Final Product:', pddata);

    // // Return success response
    // res.status(200).send({
    //     "status code": 200,
    //     "message": "Product added successfully",
    //     "product": pddata
    // });

    /*  --------------------------------------------------------------------*/


    /* Get API code with database */

    // GET API to retrieve all products
    app.get('/api/getProduct', async (req, res) => {

        try {
            //lets find first all proudct in db
            //below find all products in db
            let findProduct = await Product.find();

            //if you want to find by id a specific product then  also you have to add route in the api endpint as :id
            //let findProductById = await Product.findbyid(id);
            res.status(200).json(findProduct);

        } catch (error) {
            res.status(505).json(error.message)
        }


        /*  --------------------------------------------------------------------*/



        /*Below is code for GET api without database using list*/

        // If there are products, return them
        // if (productData.length > 0) {
        //     return res.status(200).send({
        //         "status code": 200,
        //         "products": productData
        //     });
        // }

        // // If no products exist, return an empty list
        // return res.status(200).send({
        //     "status code": 200,
        //     "products": []
        // });
    });

    /*  --------------------------------------------------------------------*/

    /* Patch API For Update */

    //lets do patch api also last time we did put api which were to update all fields now we want to update specific fields we will use patach


    /* Patch API Code */

    app.patch('/api/patch/:id', async (req, res) => {

        //find id
        let productId = req.params.id;
        let updatedData = req.body;
        let options = { new: true };

        try {
            const data = await Product.findByIdAndUpdate(productId, updatedData, options);
            res.send(data);
        } catch (error) {

            res.send(error.message);
        }

    })


    /* Patch API Code Ended */

    /*  --------------------------------------------------------------------*/



    /*update api usin put and code without database but using list */

    app.put('/api/update/:id', (req, res) => {
        // find the product by id
        let productId = req.params.id * 1;  //here we are getting the productId from the route and *1 is used to convert it from string to integer

        //below we get that specific product from the list
        let productToUpdate = productData.find(p => p.id === productId);  //this p will ittrate all the products in over list and here we finding object .id where it match exectly with the id we get from our url and after it is fetch it will be saved into productToUpdate

        //after that we need to find the index of that object means 'productToUpdate'
        let index = productData.indexOf(productToUpdate);

        //below what ever data is recived i am setting at in this place
        productData[index] = req.body;

        //after thatv we will respond back

        res.status(200).send({
            'status': 'success',
            'message': 'Product updated successfully'
        })

    })

    /*  --------------------------------------------------------------------*/

    /* DELETE API to delete a product */

    app.delete('/api/deleteProduct/:id', async (req, res) => {

        //with database code
        let id = req.params.id;
        try {
            const data = await Product.findByIdAndUpdate(id);
            res.json({
                'status': 'product deleted from database',
            })
        } catch (error) {

            res.json(error.message);

        }


        /*  --------------------------------------------------------------------*/




        /* delete api Without database code but using list */

        // let productId = Number(req.params.id);
        // let productToDelete = productData.find(p => p.id === productId);

        // if (!productToDelete) {
        //     return res.status(404).send({
        //         status: 'fail',
        //         message: 'Product not found'
        //     });
        // }

        // let index = productData.indexOf(productToDelete);
        // productData.splice(index, 1); // delete product

        // res.status(200).send({
        //     status: 'success',
        //     message: 'Product deleted successfully'
        // });
    });


    /*  --------------------------------------------------------------------*/
}).catch((err) => {
    console.error("Connection error", err);
});

/*  --------------------------------------------------------------------*/
/*  --------------------------------------------------------------------*/
/*  --------------------------------------------------------------------*/

/* putting this in last so that everything load before statritng the server */


// Start the server
app.listen(2000, () => {
    console.log("Server is running on port 2000");
});
