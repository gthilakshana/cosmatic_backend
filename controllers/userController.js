import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; 

export function createUser(req, res) {
  
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

   
    const user = new User({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: hashedPassword
    });

    
    user.save()
        .then(() => {
            res.json({
                message: "User created successfully"
            });
        })
        .catch((err) => {
            res.status(500).json({
                message: "Failed to create user",
                error: err.message
            });
        });
}

export function loginUser(req, res) {
    User.findOne({
        email: req.body.email
    }).then((user) => {
        if (user == null) {
            res.json({
                message: "User not found"
            })
        }else {
            const isPasswordMatching = bcrypt.compareSync(req.body.password, user.password);
            if (isPasswordMatching){
                
                const token = jwt.sign({
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    isEmailVerified: user.isEmailVerified,
                }, 
                "jwt-secret"
            )
       
                res.json({
                    message: "Login successfully",
                    token: token
                    
                })

                
            }else {
                res.json({
                    message: "Invalid Password"
                })
            }
        }
    })
}
