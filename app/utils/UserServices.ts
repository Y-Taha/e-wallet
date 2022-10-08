import User from "App/Models/User";

export default class userServices{
    public static async create_user(payload){
        await User.create(payload)
    }
    public static async find_user(user:{id:number}){
        return await User.findByOrFail('id',user.id)
    }
}