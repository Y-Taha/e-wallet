import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'transaction_types_and_categories'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id')
      table.string('transaction_type').notNullable()
      table.string('transaction_category').unique().notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.primary(['transaction_type','transaction_category'])
      table.foreign('user_id').references('users.id')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
