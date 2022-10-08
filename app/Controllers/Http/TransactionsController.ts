import httpServices from 'App/utils/HttpServices';
import transactionServices from 'App/utils/TransactionServices';
import typeServices from 'App/utils/TypeServices';
import userServices from 'App/utils/UserServices';
import AnalyticsViewValidator from 'App/Validators/AnalyticsViewValidator';
import TransactionValidator from 'App/Validators/TransactionValidator';
import TransactionVariableValidator from 'App/Validators/TransactionVariableValidator';

export default class TransactionsController {

  public async createType({ request, response, auth }) {
    const user = await auth.user!
    const payload = await request.validate(TransactionVariableValidator)
    payload.user_id = user.id;
    try {
      await typeServices.create_type(payload)
      return httpServices.respond(response, 'Type Added', payload, 201)
    } catch (e) {
      console.log(e)
      return httpServices.respond(response, 'Type creation failed', payload, 400)
    }
  }
  public async store({ request, response, auth }) {
    const user = await auth.user!
    const payload = await request.validate(TransactionValidator)
    if (!transactionServices.amount_validator(payload.amount)) return httpServices.respond(response, 'Invalid amount', payload, 400)
    if (!await typeServices.type_validator(payload.transaction_type)) return httpServices.respond(response, 'Invalid transaction type', payload, 400)
    await transactionServices.create_category_if_not_exists(request, payload, user)
    if (! await typeServices.category_validator(payload.transaction_category, payload.transaction_type, user)) return httpServices.respond(response, 'Invalid transaction category add "create":"y" to add new category', payload, 400)
    await transactionServices.amount_sanitizer(payload)
    payload.user_id = user.id;
    delete payload.create
    try {
      await transactionServices.create_transaction(user, payload)
      return httpServices.respond(response, 'Transaction Added', payload, 201)
    } catch (error) {
      return httpServices.respond(response, 'Transaction creation failed', payload, 400)
    }
  }
  public async update({ request, response, params, auth }) {
    const user = await auth.user!
    const payload = await request.validate(TransactionValidator)
    if (!transactionServices.amount_validator(payload.amount)) return httpServices.respond(response, 'Invalid amount', payload, 400)
    payload.user_id = user.id;
    if (! await typeServices.type_validator(payload.transaction_type)) return httpServices.respond(response, 'Invalid transaction type', payload, 400)
    await transactionServices.create_category_if_not_exists(request, payload, user)
    if (! await typeServices.category_validator(payload.transaction_category, payload.transaction_type, user)) return httpServices.respond(response, 'Invalid transaction category add "create":"y" to add new category', payload, 400)
    await transactionServices.amount_sanitizer(payload)
    var transactions = await transactionServices.find_user_transactions(user)
    if (!transactions) return httpServices.respond(response, 'You have no transactions', params, 200)
    if (!await transactionServices.is_owner(user, params)) return httpServices.respond(response, 'Not Allowed', params, 403)
    try {
      await transactionServices.update_user_transaction(user, params, payload)
      await transactionServices.update_balance(user.id)
      return httpServices.respond(response, 'Transaction Updated', payload, 200)
    } catch (error) {
      return httpServices.respond(response, 'Not Found', payload, 404)
    }
  }
  public async destroy({ response, params, auth }) {
    const user = await auth.user!
    var transactions = await transactionServices.find_user_transactions(user)
    if (!transactions) return httpServices.respond(response, 'You have no transactions', params, 200)
    if (!await transactionServices.is_owner(user, params)) return httpServices.respond(response, 'Not Allowed', params, 403)
    try {
      await transactionServices.delete_user_transaction(user, params)
      await transactionServices.update_balance(user.id)
      return httpServices.respond(response, 'Transaction Delted', params, 200)
    } catch (error) {
      return httpServices.respond(response, 'Not Found', params, 404)
    }
  }
  public async viewBalance({ response, auth }) {
    const user = await auth.user!
    await transactionServices.update_balance(user.id)
    const balance = await userServices.find_user(user)
    return httpServices.respond(response, 'Current Balance', balance.balance, 200)
  }
  public async viewTransactions({ response, auth }) {
    const user = await auth.user!
    const transactions = await transactionServices.find_user_last_10_transactions(user)
    if (!transactions.length) return httpServices.respond(response, 'No transactions in this last 10 days', transactions, 404)
    return httpServices.respond(response, 'Last 10 Transactions', transactions, 200)
  }
  public async viewTransactionsRange({ response, auth, params }) {
    var range = transactionServices.range_sanitizer(params)
    if (range === '') return httpServices.respond(response, 'Enter a valid range', params.range, 400)
    const user = await auth.user!
    const dates: Array<any> = await transactionServices.find_user_transaction_in_range(user, range)
    if (!dates.length) return httpServices.respond(response, 'No transactions in this time period', dates, 404)
    return httpServices.respond(response, 'Last ' + range + ' Transactions', dates, 200)
  }
  public async viewAnalytics({ response, request, auth }) {
    const user = await auth.user!
    const payload = await request.validate(AnalyticsViewValidator)
    const transactions: Array<any> = await transactionServices.find_user_transaction_in_timestamp(user, payload)
    if (!transactions.length) return httpServices.respond(response, 'No transactions in this time period', payload, 404)
    return httpServices.respond(response, 'Transactions found in this time period', transactions, 200)
  }
}
