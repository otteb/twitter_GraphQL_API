# twitter_GraphQL_API

# INSTALLATION:

[1] Clone repo into local folder - git clone https://github.com/otteb/twitter_GraphQL_API.git
[2] run cmd: "npm install" - this will download all dependencies.
[3] run cmd: "npm start" - this starts the server on PORT 8000 - go to:
    "http://localhost:8000/graphql" in your Chrome Browser.

# REQUIREMENTS:

[1]   Authentication is provided using the npm package: jsonwebtoken. The credentials
      are signed and verified. The token can be input in json format as
      {"authorization" : "{token}"} in HTTP HEADERS section at the bottom-left
      corner of the graphql-browser interface.

[2]   The API leverages GraphQL - all files containing schemas, resolvers, and
      models are located in the src folder.

[3]   The data is not stored in a persistent database, but a file
      (./src/models/index.js). The original plan was to utilize a postrgreSQL DB.
      I ran into a bug, which exhausted my 4 hr limit faster than I expected. The
      models folder contains empty files (message.js and user.js) that were
      originally designed to incorporate postrgreSQL database structures.

[4.1] Below is a valid mutation to register a new test user:

      mutation {
        register(username: "test", email: "test@test.com", password: "testPassword"){
          id
          username
          email
          password
        }
      }

      should expect a result like this:

      {
        "data": {
          "register": {
            "id": "ea9a3a70-9c75-45a9-987c-85a59765eac8",
            "username": "test",
            "email": "test@test.com",
            "password": "testPassword"
          }
        }
      }

[4.2] Login new test user:

      BONUS: test permissions by running the following cmd in the GraphQL browser:

      {
        getUserMessages{
          text
          id
        }
      }

      This should respond with:

      {
        "errors": [
          {
            "message": "Not Authorized",
            ...}
      }

      This is an unauthorized action without a token corresponding to a valid
      user within the database.

      To login, implement the following in the GraphQL Browser:

      mutation {
        login(email: "test@test.com", password: "testPassword")
      }

      should expect a response similair to this:

      {
        "data": {
          "login": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiZWE5YTNhNzAtOWM3NS00NWE5LTk4N2MtODVhNTk3NjVlYWM4IiwidXNlcm5hbWUiOiJ0ZXN0In0sImlhdCI6MTU2NDA1MzU1NCwiZXhwIjoxNTk1NjExMTU0fQ.953fYfESim9h0nkUxlACO5oG1HV3KRrLTTRKJlB-ELM"
        }
      }

      ^ At this point, proceed to the HTTP HEADERS and copy and paste the format from requirements [1].
      Then, copy the token from the response and paste, between quotes, into the {token} field.

      Now, test permissions by executing the following query:

      {
        me{
          username
          id
        }
      }

      ^This query retrieves the information of the current user (if authorized), and should look something
      like this:

      {
        "data": {
          "me": {
            "username": "test",
            "id": "ea9a3a70-9c75-45a9-987c-85a59765eac8",
            "email": "test@test.com"
          }
        }
      }


[4.3] Posting a Message Linked to the User:

      In this section, it is assumed that the test user is still logged-in and that its authorization
      headers are still input in the HTTP HEADERS section. Create a message query similair to the following:

      mutation {
         createMessage(text: "Kenan's first message"){
           id
           text
           user{
             username
             id
           }
         }
       }

       ^Yields results:

       {
        "data": {
          "createMessage": {
            "id": "8804b82b-b433-4f0d-a272-37f9666c8db4",
            "text": "Kenan's first message",
            "user": {
              "username": "test",
              "id": "5fedbda1-cd44-4830-ac56-1ad51a7e5ceb"
            }
          }
        }
      }

[4.4] Retrieving all messages that a user post:

      This call does not allow the user to retrieve messages for any user - only the logged in user.
      In future iterations, this will be expanded to provide users with the ability to see all messages
      of their contacts, but those relationships have yet to be built. This is only a personal history.

      Query GraphQL Browser with:

      {
        getUserMessages{
          text
          id
        }
      }

      Expect results similair to this (assuming you ran the createMessage call 3 times):

      {
        "data": {
          "getUserMessages": [
            {
              "text": "Kenan's first message",
              "id": "63df75e2-2f57-43fa-932a-7b773bffce71"
            },
            {
              "text": "Kenan's second message",
              "id": "8804b82b-b433-4f0d-a272-37f9666c8db4"
            },
            {
              "text": "Kenan's third message",
              "id": "99b618bd-ce6f-4ed1-918d-8b60c36e3a70"
            }
          ]
        }
      }


      The query can be altered to send back the user information for each of the messages;
      reference ./schema/user.js for structure.


[5.1] Advantages: This API was intentionally designed to be modular. The components of GraphQL - resolvers
      and type defintions - are purposed separateded to increase organization. In terms of technology, GraphQL
      has a few distinct benefits. First, Declarative Data Fetching allows queries and mutations to retrieve and
      manipulate data in one step; the client is easily aware of the data provided, and the server knows the data
      structures as well as the sources. Second, there is no overfetching - in GraphQL, clients can choose a
      different set of fields, so it can fetch only the information needed at any given time. Third, GraphQl's
      schema stitching allows modular construction of a single, overall, schema. This is excellent for microservice
      architectural design, as division of computation is specific to each domain. Lastly, the strongly typed
      architectural makes it difficult to make long-lasting bugs, and speeds up production (I have no hard evidence
      of this - it just seems like a logical conclusion).

[5.2] Disadvantages: On the development side, there are potential drawbacks to using GraphQL: Caching is difficult,
      rate limiting is more difficult, and immense query complexity. In GraphQL, caching is troublesome, because
      queries are not directly linked with a specific domain/endpoint. This method requires a more complex cache
      to be able to handle data from multiple sources... and still limit redundant calls. Rate limiting is challenging,
      because rates have to be calculated by query depths rather than times called like tradtional REST. The Query
      complexity is difficult for frontend development engineers to ascertain, and thus it is likely that the client
      side will unwittingly slow down the application with overally burdomson calls.

[6]   BONUS: Deleting a message:

      (1) Register and (2) Login as a new user. (3) insert authorization token in the HTTP Headers section.
      (4) create a message. (5) take message ID:
      {
        "data": {
          "getUserMessages": [
            {
              "text": "Hello World",
              **"id": "1"**
            }
          ]
        }
      }

      (5) Call the deleteMessage mutation, and pass in the id:
      mutation {
        deleteMessage(id: "1")
      }

      Response:

      {
        "data": {
          "deleteMessage": true
        }
      }

      Check user's messages:

      {
        getUserMessages{
          text
          id
        }
      }

      and get Result:

      {
        "data": {
          "getUserMessages": []
        }
      }

#CONCLUSION:

[7]   This was a good first iteration of the project - GraphQL is great! Next is to add bcrypt, a postrgress or MongoDB,
      define more relationships and include a thread/board object in the schema.
