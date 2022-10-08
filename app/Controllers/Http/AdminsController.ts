import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import adminServices from 'App/utils/AdminServices'
import httpServices from "App/utils/HttpServices"
import typeServices from 'App/utils/TypeServices'
import AdminSignupValidator from 'App/Validators/AdminSignupValidator'
import TransactionTypeSignValidator from 'App/Validators/TransactionTypeSignValidator'

export default class AdminsController {
    public async login({ request, response, auth }) {
        var { username, password } = request.only(["username", "password"])
        try {
            const token = await auth.use('admin').attempt(username, password)
            return httpServices.respond(response, 'Login Successfull', token, 200)
        } catch (e) {
            console.log(e)
            return httpServices.respond(response, 'Login Failed', { username, password }, 401)
        }
    }
    public async signup({ request, response }: HttpContextContract) {
        const payload = await request.validate(AdminSignupValidator)
        try {
            adminServices.create_admin(payload)
            return httpServices.respond(response, 'Admin created', payload, 201)
        } catch (e) {
            console.log(e)
            return httpServices.respond(response, 'Admin creation failed', payload, 400)
        }
    }
    public async createSign({ request, response, auth }) {
        const user = await auth.user!
        const payload = await request.validate(TransactionTypeSignValidator)
        payload.user_id = user.id;
        try {
          await typeServices.create_sign(payload)
          return httpServices.respond(response, 'Sign Added', payload, 201)
        } catch (error) {
          console.log(error)
          return httpServices.respond(response, 'Sign creation failed', payload, 400)
        }
      }
}
