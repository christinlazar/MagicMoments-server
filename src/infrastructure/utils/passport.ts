const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
import User from "../../domain/user"
import { userModel } from "../database/userModel"

passport.use(new GoogleStrategy({
    clientID:'497491388921-al3gve5htq5eud8mod07j6tol11mrcvg.apps.googleusercontent.com',
    clientSecret:'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',
    callbackURL:'/auth/google/callback'
},
async (accessToken:any,refreshToken:any,profile:any,done:any) =>{
  
}
))

passport.serializeUser((user:any,done:any)=>{
    done(null,user.id)
})

passport.deserializeUser((id:any,done:any)=>{
   userModel.findById(id,(err:any,user:any)=>{
    done(err,user)
   })
})

export default passport