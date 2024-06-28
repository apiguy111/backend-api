
# Overview


XYZ is building a backend service to assist job seekers in requesting referrals and other services from multiple companies using job description URLs. This Node.js application implements RESTful APIs to manage user data and authentication.

## Installation

Clone the repository:


```bash
git clone https://github.com/apiguy111/backend-api.git
cd backend-api

```

Install dependencies
```bash
npm install

```

Set up environment variables:


```bash
MONGO=mongodb://localhost:27017/worko
JWT=your_jwt_secret
```
    
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MONGO STRING`

`JWT_SECRET_KEY`





## API Documentation


- GET /worko/user
     
      List all users.

-GET /worko/user/:id

    Get details of a specific user.

- POST /worko/user
            
      Create a new user. Required fields: email, name, age, city, zipCode.     

- PUT /worko/user/:userId

      Update an existing user. Overwrites existing data.

- PATCH /worko/user/:userId

      Update an existing user. Partial updates allowed.

- DELETE /worko/user/:userId

      Soft delete a user from the database.


## Running Tests

To run tests, add  "scripts": {
    "test": "jest"
  } in package.json file and then run the following command

```bash
  npm test
```



## Authors

- [@Kuwar Shiv Pratap SIngh](https://github.com/apiguy111)

