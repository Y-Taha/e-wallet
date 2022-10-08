import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Admin from './Admin'

export default class TransactionTypeSign extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public admin_id: number

  @column({ isPrimary: true })
  public type: string

  @column({ isPrimary: true })
  public sign: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Admin, {
    localKey: 'admin_id'
  })
  public user: BelongsTo<typeof Admin>
}
