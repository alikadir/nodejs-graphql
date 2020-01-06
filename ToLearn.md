# To Learn;

- what is fragment type and where do use?

- subscription

- query and mutation with multiple parameters

```
query($userId: String) {
    getSingleUser(userId: $userId)
}
<Query query={GET_SINGLE_USER} variables={{userId: state.userId}}>
```

- query and mutation with onComplete onError event

```
<Mutation onComplete={e=>{}} onError={e=>{}}>
```

- dynamically pass parameters to Query and Mutation component

- authentication
