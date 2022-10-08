import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserSignupValidator from 'App/Validators/UserSignupValidator'
import httpServices from 'App/utils/HttpServices'
import userServices from 'App/utils/UserServices'

export default class UsersController {
    public async login({ request, response,auth }) {
        var { uid, password } = request.only(["uid", "password"])
        try {
            const token = await auth.use('user').attempt(uid, password)
            return httpServices.respond(response,'Login Successfull',token,200)
        } catch (e) {
            console.log(e)
            return httpServices.respond(response,'Login Failed',{uid,password},401)
        }
    }
    public async signup({ request, response }: HttpContextContract) {
        const payload = await request.validate(UserSignupValidator)
        try{
            userServices.create_user(payload)
            return httpServices.respond(response,'User created',payload,201)
        }catch(e){
            console.log(e)
            return httpServices.respond(response,'User creation failed',payload,400)
        }
    }
}
