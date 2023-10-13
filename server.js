const mongoose = require("mongoose");
const dotenv = require("dotenv").config();


const app = require("./app");


//database connection
mongoose.connect(process.env.DATABASE,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    writeConcern: {
        w: 'majority',
    },
}).then(()=>{
    console.log(`Database connection is successfull!!`)
})

//server
const port = process.env.PORT || 5000;


app.listen(port, () => {
    console.log(`App is running on port ${port}`);
}).on('error', (err) => {
    console.error(`Server listen error: ${err}`);
});

