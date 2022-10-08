import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Hash  from '@ioc:Adonis/Core/Hash';
import TransactionTypeSign from './TransactionTypeSign';

export default class Admin extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({})
  public username:string
  
  @column({})
  public password:string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => TransactionTypeSign,{
    foreignKey:'user_id'
  })
  public transactionSign: HasMany<typeof TransactionTypeSign>

  @beforeSave()
  public static async hashPassword(admin: Admin) {
    if (admin.$dirty.password) {
      admin.password = await Hash.make(admin.password)
    }
  }
}
