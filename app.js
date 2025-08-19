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

// routes
const company=require("./routes/companyRoute")
app.use("/api/company",company)

const jobListing=require("./routes/jobListingRoute")
app.use("/api/job",jobListing)

const application=require("./routes/applicationRoute")
app.use("/api/application",application)

const student=require("./routes/studentRoute")
app.use("/api/student",student)

const admin=require("./routes/adminDashRoute")
app.use("/api/admin",admin)

//connecting to database
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log("MongoDB Connection failed.",err))

// server listener
const PORT=3001
 
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)

})