import Admin from "App/Models/Admin";

export default class adminServices{
    public static async create_admin(payload){
        await Admin.create(payload)
    }
    public static async find_admin(user:{id:number}){
        return await Admin.findByOrFail('id',user.id)
    }
}