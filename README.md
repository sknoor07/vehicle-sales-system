Step 1 : Run "npm install" in the client and server directory
Step 2 : Go to the client directory and run "npm start"
Step 3 : Go to the server directory and run "npm sart"

The project should start working on port 3000;

For Creating the admin for the first time send a post request via postman on "http://localhost:5000/api/auth/setup"
The Json Body should be as below
Body
{
  "username":"admin name",
  "email": "admin email",
  "password": "admin password",
  "role": "admin"
}
Once admin is created login into the user panel as admin and then more admin and users can be created.



The project was created for fun as a college project 
