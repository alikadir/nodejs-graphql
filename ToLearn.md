# To Learn

[-] what is fragment type and where do use?

[-] subscription

[x] reFetch data

[x] authentication

[x] dynamically pass parameters to Query and Mutation component

[-] query and mutation with multiple parameters

```javascript
query($userId: String) {
    getSingleUser(userId: $userId)
}
<Query query={GET_SINGLE_USER} variables={{userId: state.userId}}>
```

[-] query and mutation with onComplete onError event

```javascript
<Mutation onComplete={e=>{}} onError={e=>{}}>
```
