import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'transaction_type_signs'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('admin_id').notNullable()
      table.string('type').unique().notNullable()
      table.string('sign').notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.primary(['type','sign'])
      table.foreign('admin_id').references('admins.id')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
