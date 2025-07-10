const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
require('dotenv').config()

//middleware
const app=express()
app.use(express.json())
app.use(cors())

//access static files
app.use("/uploads",express.static('uploads'))

//connecting to database
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log("MongoDB Connection failed.",err))

// server listener
const PORT=3000
 
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)

})