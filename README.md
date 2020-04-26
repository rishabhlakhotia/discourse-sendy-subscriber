# discourse-sendy-subscriber

Updates the Sendy subscription list whenever a new user is created or destroyed in the Discourse. The app works on AWS Lambda to avoid running an unnecessary server on your system.

### Environment Variables
Define the following environment variables in the Lambda
* SENDY_HOST=<hostname of your sendy installation>
* SENDY_API_KEY=<your sendy api key>
* SENDY_LIST=<the hashed list id in which you will store the subscriber details>

To check if the lambda installation is working correctly, ping the app from Discourse webhook and you will receive `A ping was received from Discourse` as the response.
