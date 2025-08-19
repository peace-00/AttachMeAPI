const mongoose=require('mongoose')
const Schema=mongoose.Schema

// user schema
const userSchema=new Schema({
    name:{type:String,required:true},
    email:{type:String, required:true,unique:true},
    password:{type:String,required:true,unique:true},
    phone:{type:"String",required:true},
    dateOfBirth:{type:Date},
    profilePhoto:{type:String,default:null},
    role:{type:String,enum:['student','company','admin'],required:true},
    isActive:{type:Boolean,default:true},
    company:{type:mongoose.Schema.Types.ObjectId,ref:"Company",default:null},
    student:{type:mongoose.Schema.Types.ObjectId,ref:"Student",default:null}
},{timestamps:true})

// student schema
const studentSchema=new Schema({
    name:{type:String},
    nationalId:{type:Number,required:true,unique:true},
    universityName:{type:String,required:true},
    courseName:{type:String,required:true},
    yearOfStudy:{type:Number,required:true},
    skills:[{type:String}],
    resume:{type:String},
    linkedIn:{type:String},
    isApproved:{type:Boolean,default:true}
},{timestamps:true})

//Company schema
const companySchema=new Schema({
    companyName:{type:String},
    registrationNumber:{type:String},
    location:{type:String,requires:true},
    description:{type:String},
    industry:{type:String},
    isVerified:{type:Boolean,default:true},
    website:{type:String,default:null}
},{timestamps:true})

// job listing schema
const jobListingSchema=new Schema({
    companyId:{type:mongoose.Schema.Types.ObjectId,ref:"Company",default:null},
    jobTitle:{type:String},
    description:{type:String},
    location:{type:String},
    requirements:[{type:String}],
    deadline:{type:Date},
    isApproved:{type:Boolean,default:true}
},{timestamps:true})

// application schema
const applicationSchema = new Schema({
    studentId:{type:mongoose.Schema.Types.ObjectId,ref:"Student",default:null,required:true},
    jobId:{type:mongoose.Schema.Types.ObjectId,ref:"JobListing",default:null,required:true},
    status:{type:String,enum:['Pending','Accepted','Rejected'],default:"Pending..."},
    coverLetter:{type:String,default:null},
    appliedAt:{type:Date,default:Date.now}
},{ timestamps: true }
);

const User=mongoose.model("User",userSchema)
const Student=mongoose.model("Student",studentSchema)
const Company=mongoose.model("Company",companySchema)
const JobListing=mongoose.model("JobListing",jobListingSchema)
const Application=mongoose.model("Application",applicationSchema)

module.exports={User,Student,Company,JobListing,Application}