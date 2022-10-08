import Transaction from "App/Models/Transaction"
import TransactionTypeSign from "App/Models/TransactionTypeSign"
import User from "App/Models/User"
import { DateTime, DateTimeUnit } from "luxon"

export default class transaction_services {
    
    public static async amount_sanitizer(payload: { transaction_type: string, amount: number }) {
        var sign = await TransactionTypeSign.query().where('type',payload.transaction_type)
        if(sign[0].sign==="-") payload.amount = (payload.amount * -1)
    }
    public static amount_validator(amount) {
        if (amount <= 0) return false
        return true
    }
    public static async update_balance(user_id) {
        var balance = 0
        const sum = await User.query().where('id', user_id).withAggregate('transaction', (query) => { query.where('user_id', user_id).sum('amount').as('amout_count') })
        balance += parseInt(sum[0].$extras.amout_count)
        balance = balance | 0
        var payload = { balance: balance }
        await User.query().where('id', user_id).update(payload)
    }
    public static async create_transaction(user, payload) {
        await Transaction.create(payload)
        await transaction_services.update_balance(user.id)
    }
    public static async find_user_transactions(user: { id: number }) {
        return await Transaction.findBy('user_id', user.id)
    }
    public static async update_user_transaction(user: { id: number }, params, payload) {
        await Transaction.query().where('user_id', user.id).andWhere('id', params.id).update(payload)
    }
    public static async delete_user_transaction(user: { id: number }, params: { id: number }) {
        return await Transaction.query().where('user_id', user.id).andWhere('id', params.id).delete()
    }
    public static async is_owner(user: { id: number }, params: { id: number }) {
        try {
            var data = await Transaction.query().where('user_id', user.id).andWhere('id', params.id)
            if (!data.length) {
                return false
            }
            return true
        } catch (e) {
            console.log(e)
        }
    }
    public static async find_user_last_10_transactions(user: { id: number }) {
        return await Transaction.query().where('user_id', user.id).limit(10)
    }
    public static async find_user_transaction_in_range(user: { id: number }, range) {
        return await Transaction.query().where('user_id', user.id).andWhere('created_at', '>', DateTime.now().startOf(range as DateTimeUnit).toSQL()).orderBy('transaction_type')
    }
    public static range_sanitizer(params) {
        var range = params.range == 1 ? 'day' : params.range == 7 ? 'week' : params.range == 30 ? 'month' : ''
        return range
    }
    public static async find_user_transaction_in_timestamp(user: { id: number }, payload: { fromDate: string, toDate: string }) {
        return await Transaction
            .query()
            .where('user_id', user.id)
            .andWhere('transaction_type', 'income')
            .andWhereBetween('created_at', [payload.fromDate, payload.toDate]).orderBy('transaction_category')
    }
}