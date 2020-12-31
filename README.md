## All of GraphQL features've been implemented in this project

The Project has twice approach 
1) using pure javascript client - server 
2) using Apollo graphql library client - server


### LIVE

NodeJs GraphQL server hosted on Heroku
 
- https://akb-first-graphql-server.herokuapp.com/graphql  
 
Client serving from Vercel (nextjs)
 
- https://akb-first-graphql-client.now.sh


### SETUP

**Bundle pure-server**

```npm i -g @zeit/ncc```

```cd server```

```ncc build pure-server.js```

After above commands executed, it is gonna create index.js in build folder which is bundled all dependency for pure-server.js 

