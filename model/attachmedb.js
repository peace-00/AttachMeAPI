const mongoose=require('mongoose')
const Schema=mongoose.Schema

// user schema
const userSchema=new Schema({
    name:{type:String,required:true},
    email:{type:String, required:true,unique:true},
    password:{type:String,required:true,unique:true},
    phone:{type:"String",required:true}, 
    profilePhoto:{type:String,required:false, default:null},
    role:{type:String,enum:['student','company','admin'],required:true},
    isActive:{type:Boolean,default:true},
    company:{type:mongoose.Schema.Types.ObjectId,ref:"Company",default:null},
    student:{type:mongoose.Schema.Types.ObjectId,ref:"Student",default:null}
},{timestamps:true})

// student schema
const studentSchema=new Schema({
    name:{type:String},
    profilePhoto:{type:String,required:false, default:null},
    nationalId:{type:Number,required:true},
    universityName:{type:String,required:true},
    courseName:{type:String,required:true},
    yearOfStudy:{type:Number,required:true},
    skills:[{type:String,default:null}],
    resume:{type:String,default:null},
    linkedIn:{type:String,default:null},
    isVerified:{type:Boolean,default:false}
},{timestamps:true})

//Company schema
const companySchema=new Schema({
    name:{type:String},
    profilePhoto:{type:String,required:false, default:null},
    registrationNumber:{type:String},
    location:{type:String,requires:true},
    description:{type:String},
    industry:{type:String},
    isVerified:{type:Boolean,default:false},
    website:{type:String,default:null}
},{timestamps:true})

// job listing schema
const jobListingSchema=new Schema({
    jobTitle:{type:String},
    description:{type:String},
    postedBy:{type:mongoose.Schema.Types.ObjectId,ref:"Company",default:null},
    type:{type:String,enum:['attachment','internship'],required:true},
    requirements:[{type:String}],
    deadline:{type:Date},
    isApproved:{type:Boolean,default:true}
},{timestamps:true})

// application schema
const applicationSchema = new Schema({
    student:{type:mongoose.Schema.Types.ObjectId,ref:"Student",required:true},
    company:{type:mongoose.Schema.Types.ObjectId,ref:"Company",required:true},
    job:{type:mongoose.Schema.Types.ObjectId,ref:"JobListing",required:true},
    status:{type:String,enum:['Pending','Accepted','Rejected'],default:"Pending"},
    resume:{type:String,default:null},
    appliedAt:{type:Date,default:Date.now}
},{ timestamps: true }
);

const User=mongoose.model("User",userSchema)
const Student=mongoose.model("Student",studentSchema)
const Company=mongoose.model("Company",companySchema)
const JobListing=mongoose.model("JobListing",jobListingSchema)
const Application=mongoose.model("Application",applicationSchema)

module.exports={User,Student,Company,JobListing,Application}