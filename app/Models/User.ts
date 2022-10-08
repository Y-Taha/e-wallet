import { DateTime } from 'luxon'
import Hash  from '@ioc:Adonis/Core/Hash';
import { BaseModel, column , beforeSave, hasMany, HasMany} from '@ioc:Adonis/Lucid/Orm'
import Transaction from './Transaction';
import TransactionTypesAndCategory from './TransactionTypesAndCategory';
import TransactionTypeSign from './TransactionTypeSign';

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  
  @column()
  public name: string;
  
  @column()
  public password: string;
  
  @column()
  public email: string;
  
  @column()
  public balance: number;

  @column()
  public phone_number: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Transaction,{
    foreignKey:'user_id'
  })
  public transaction: HasMany<typeof Transaction>

  @hasMany(() => TransactionTypesAndCategory,{
    foreignKey:'user_id'
  })
  public transactionVariable: HasMany<typeof TransactionTypesAndCategory>

  @hasMany(() => TransactionTypeSign,{
    foreignKey:'user_id'
  })
  public transactionSign: HasMany<typeof TransactionTypeSign>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
