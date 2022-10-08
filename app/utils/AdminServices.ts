import Admin from "App/Models/Admin";

export default class adminServices{
    public static async create_admin(payload){
        await Admin.create(payload)
    }
}