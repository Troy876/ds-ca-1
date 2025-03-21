## Serverless REST Assignment - Distributed Systems.

__Name:__ Troy Barrett

__Demo:__ https://youtu.be/q9k4HAdTZCw

### Context.

Context: Games

+ id - number
+ title - String
+ description - string
+ mature - boolean

Context: Game Studio

+ gameId - number
+ studioName - string
+ primaryGenre - string

### App API endpoints.

+ GET /games - view all games in the game table
+ GET /games/studio?gameId={partition-key} - get the game studio associated with the game
+ POST /games - add a new game to the game table
+ PUT /games/update - updates an existing game
+ GET /games/{partition-key}/translate?lang={language-code} - translates the game into the chosen language
 
### Features.

#### Translation persistence

I first installed the AWS Translation Client and then created a translation lambda to get a game object and translate it's strings into the chosen language and return them. Then I created a translation table to cache the translations to avoid excessive translation calls and to improve performance. I then called the lambda in the stack, connected it to the table for caching, and added the relevant permissions and endpoints. I then ran into an issue with authorisation, so I needed to add an IAM policy to the stack to give it permission to call the AWS Translation Service. And that solved my issue and translations occured on my game objects.

+ gameId - number
+ languageCode - string
+ title - string
+ description - string

#### API Keys

First an API key needs to be created which can be done on the AWS API Gateway Console. Once that is done, a Usage Plan needs to be created in order to associate the /dev stage of the API with the generated API key. Then the POST and PUT endpoints need to be told to look for an API key before allowing a request to occur, which was implemented like so:

~~~ts
gamesEndpoint.addMethod(
      "POST",
      new apig.LambdaIntegration(newGameFn, { proxy: true }),
      { apiKeyRequired: true } // Requests API before POSTing
    );
~~~

~~~ts
updateGameEndpoint.addMethod(
      "PUT",
      new apig.LambdaIntegration(updateGameFn, { proxy: true }),
      { apiKeyRequired: true } // Requests API before PUTting
    );
~~~

Then, in Postman, an API header needed to be added which was done with "x-api-key" as the "Key" value and the created API Key value as the "Value". Running POST and PUT requests now work as normal.
