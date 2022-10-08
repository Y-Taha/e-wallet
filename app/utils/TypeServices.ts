import TransactionTypesAndCategory from "App/Models/TransactionTypesAndCategory";
import TransactionTypeSign from "App/Models/TransactionTypeSign";

export default class type_services {
    public static async create_sign(payload) {
        await TransactionTypeSign.create(payload)
    }
    public static async create_type(payload) {
        await TransactionTypesAndCategory.create(payload)
    }
    public static async type_validator(type) {
        try {
            var data = await TransactionTypeSign.query().where('type', type);
            if (!data.length) {
                return false
            }
            return true
        } catch (e) { console.log(e) }
    }
    public static async category_validator(category, type, user: { id: number }) {
        try {
            var data = await TransactionTypesAndCategory.query().where('transaction_type', type).andWhere('transaction_category', category).andWhere('user_id', user.id);
            if (!data.length) {
                return false
            }
            return true
        } catch (e) { console.log(e) }
    }
}