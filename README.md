
# webapp
Install node modules using node packet manager ( run command npm install )
Initialize npm within the project folder ( npm init )
Install nodemon ( npm install -g nodemon )

To start the server run ( node app.js )

Build instructions:

All API request/response payloads should be in JSON. No UI should be implemented for the application. As a user, I expect all APIs call to return with a proper HTTP status code (Links to an external site.). As a user, I expect the code quality of the application is maintained to the highest standards using the unit and/or integration tests. Your web application must only support Token-Based authentication and not Session Authentication (Links to an external site.). As a user, I must provide a basic (Links to an external site.) authentication (Links to an external site.) token when making an API call to the protected endpoint. Create a new user As a user, I want to create an account by providing the following information. 1)Email Address 2)Password 3)First Name 4)Last Name account_created field for the user should be set to the current time when user creation is successful. User should not be able to set values for account_created and account_updated. Any value provided for these fields must be ignored. Password field should never be returned in the response payload. As a user, I expect to use my email address as my username. Application must return 400 Bad Request HTTP response code when a user account with the email address already exists. As a user, I expect my password to be stored securely using BCrypt password hashing scheme (Links to an external site.) with salt (Links to an external site.). Update user information As a user, I want to update my account information. I should only be allowed to update the following fields. 1)First Name 2)Last Name 3)Password Attempt to update any other field should return 400 Bad Request HTTP response code. account_updated field for the user should be updated when the user update is successful. A user can only update their own account information. Get user information As a user, I want to get my account information. Response payload should return all fields for the user except for password.

