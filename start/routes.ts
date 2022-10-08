/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
Route.post('/signup', 'UsersController.signup')
Route.post('/login', 'UsersController.login')
Route.group(()=>{
  Route.resource('/transaction','TransactionsController').apiOnly().except(['show','index'])
  Route.post('/sign','TransactionsController.createSign')
  Route.post('/type','TransactionsController.createType')
  Route.get('/balance','TransactionsController.viewBalance')
  Route.get('/view','TransactionsController.viewTransactions')
  Route.get('/view/:range','TransactionsController.viewTransactionsRange')
  Route.post('/analytics','TransactionsController.viewAnalytics')
}).middleware('auth')
