import jwt from 'jsonwebtoken';

const auth=(req,res,next)=>{
    try {
        const token=req.header("Authorization");
        if(!token) return res.status(400).json({msg:"Invalid Authentication"});

        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
            if(err) return res.status(400).json({msg:"Invalid Authentication"});

            req.user=user;
            next(); //sử dụng để truy xuất node dữ liệu sau mỗi lần resume việc verify
        })
    } catch (error) {
        return res.status(500).json({msg:error.message});
    }
}

export default auth;