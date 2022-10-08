import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class TransactionTypesAndCategory extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  @column({isPrimary:true})
  public transaction_type:string

  @column({isPrimary:true})
  public transaction_category:string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User,{
    localKey:'user_id'
  })
  public user: BelongsTo<typeof User>
}
