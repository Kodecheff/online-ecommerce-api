
## Routes: signupRoutes, loginRoutes, userRoutes, productRoutes

### signupRoutes
1. Get sign up page
{
  Usage: Sign up user,
  Url: http://127.0.0.1/signup,
  Method: GET,
  Access: PUBLIC
}

### loginRoutes
1. Get login page
{
  Usage: Login user,
  Url: http://127.0.0.1/login,
  Method: GET,
  Access: PUBLIC
}


### userRoutes
1. Get all users
{
  Usage: Fetch all users,
  Url: http://127.0.0.1/user,
  Method: GET,
  Access: PRIVATE
}

2. Get a user
{
  Usage: Fetch a user,
  Url: http://127.0.0.1/user/:id,
  Method: GET,
  Access: PRIVATE
}

3. Sign up user
{
  Usage: Sign up user,
  Url: http://127.0.0.1/user/create,
  Method: POST,
  Fields: first name, last name, email, password,
  Access: PUBLIC
}

4. Login user
{
  Usage: Login user,
  Url: http://127.0.0.1/user/login,
  Method: POST,
  Fields: email, password,
  Access: PUBLIC
}


### productRoutes
1. Create a product
{
  Usage: Create new product,
  Url: http://127.0.0.1/product/create,
  Method: POST,
  Fields: product name, description, price, base quantity, quantity, images(limit: 4), type
  Access: PRIVATE
}

2. Get a product
{
  Usage: Fetch a product,
  Url: http://127.0.0.1/product/:id,
  Method: GET,
  Access: PUBLIC
}


## Database Setup
Database: shopping-api
Tables: user, product
User Table: id, firstName, lastName, email, password, avatar, isAdmin, createdAt, updatedAt
Product Table: name, description, price, baseQuantity, quantity, images(limit: 4), type, createdAt, updatedAt


## Server-side Modules
express
cors
jsonwebtoken
express-validator
bcryptjs
gravatar
dotenv
mongoose

@types/node
@types/express
@types/cors
@types/jsonwebtoken
@types/express-validator
@types/bcryptjs
@types/gravatar
@types/dotenv
@types/mongoose