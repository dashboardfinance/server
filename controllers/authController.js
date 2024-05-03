const User=require('../models/use')
const { hashPassword,comparePassword } = require('../helpers/auth');
const jwt=require('jsonwebtoken');

const test=(req,res)=>{
    res.json("Test is working");
}
//register endpoint
const registerUser=async (req,res)=>{
    try{
        const {name,email,password}=req.body;
        //checking name
        if(!name){
            return res.json({
                error:'name is required'
            })
        };
        //checking password
        
        if(!password || password.lenght<6){
            return res.json({
                error:"Password is required and should be at least 6 character long"
            })
        };
        //Check email
        const exist=await User.findOne({email});
        if(exist){
            return res.json({
                error:'Email is taken already'
            })
        }

       const hashedPassword =await hashPassword(password)
        //creating user

        const user=await User.create({
            name,
            email,
            password:hashedPassword,
        });

        return res.json(user)
    }catch(error){
        console.log(error);

    }

};

//login endpoint
const loginUser=async (req,res)=>{
    try{
        const {email,password}=req.body;

        //check if user exists
        const user =await User.findOne({email});
        if(!user){
            return res.json({
                error:"No user found"
            })
        }

        //check password match

        const match=await comparePassword(password,user.password)
        if(match){
            res.json('password match');
            
                // jwt.sign({email:user.email,id:user._id,name:user.name},process.env.JWT_SECRET,{},(err,token)=>{
                //     if(err) throw err;
                //     res.cookie('token',token).json(user)
                // })
            
    
        }
        if(!match){
            res.json({
                error:"Password do not match"
            })
        }

    }catch(error){
        console.log(error);

    }

}

module.exports={
    test,
    registerUser,
    loginUser
}