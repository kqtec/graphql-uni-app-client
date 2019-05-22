# graphql-uni-app-client
GraphQL client for uni-app

> [GraphQL](http://graphql.cn/learn/) 既是一种用于 API 的查询语言也是一个满足你数据查询的运行时。 GraphQL 对你的 API 中的数据提供了一套易于理解的完整描述，使得客户端能够准确地获得它需要的数据，而且没有任何冗余，也让 API 更容易地随着时间推移而演进，还能用于构建强大的开发者工具。

# install
```js
npm i kqtec/graphql-uni-app-client --save
```

# usege
```
import client from graphql-uni-app-client

const client = new client({
  uri: 'https://api.graph.cool/simple/v1/movies'
});

const query = `
    query UserQuery {
    Movie(title: "Inception") {
      releaseDate
      actors {
        name
      }
    }
  }
`
client.query(query).then(result => {
    console.log(result.allFilms);
});
```

```js
//自定义请求器
let _transport=(function() {
  function transport(url) {
    if(!(instanceof transport)){
        return new transport()
    }
    
    this.$uri=url;
  }
  
  transport.prototype.send=function(query,variables) {
      return new Promise((resolve, reject) => {
          console.log(query,variables);
          resolve("cust send return");
      });
  }
})()
const client = new client({
  transport: new _transport('https://api.graph.cool/simple/v1/movies')
});
```

## Core API
### Basic Querying
Then you can invoke a simple query like this:
(This query will get titles of all the Star Wars films)

```js
const query = `
    query UserQuery {
    Movie(title: "Inception") {
      releaseDate
      actors {
        name
      }
    }
  }
`
client.query(query).then(result => {
    console.log(result.allFilms);
});
```

### Using Fragments
You can also create fragments and use inside queries.

Let's define a fragment for the `Film` type.

```js
const filmInfo = `
  fragment on Film {
    title,
    director,
    releaseDate
  }
`;
```

Let's query all the films using the above fragment:

```js
client.query(`
  {
    allFilms {
      films {
        ...${filmInfo}
      }
    }
  }
`).then(result => {
  console.log(result.allFilms.films);
});
```

> We can also use fragments inside fragments as well. Client will resolve fragments in nested fashion.

### Mutations
### Query Variables

## Cache API
### watchQuery()

This API allows to watch a query. First it will fetch the query and cache it. When the cache updated, it'll notify the change. Here's how to use it.

```js
// create a query with query variables (query variables are not mandatory)
const query = `
  query _($message: String!) {
    echo(message: $message)
  }
`;
// object pass as the query variables
const vars = {message: 'Hello'};

// create a lokka client with a transport
const client = new client({...});

// watch the query
const watchHandler = (err, payload) => {
  if (err) {
    console.error(err.message);
    return;
  }

  console.log(payload.echo);
};
const stop = client.watchQuery(query, vars, watchHandler);

// stop watching after a minute
setTimeout(stop, 1000 * 60);
```
### refetchQuery()

Refetch a given query and update the cache:

```js
client.refetchQuery(query, {message: 'Hello Again'});
```

This will notify all the watch handlers registered with `BlogSchema.watchQuery`.

### cache.getItemPayload()

Get the item inside the cache for a query.

```js
const payload = client.cache.getItemPayload(query, vars);
```

### cache.setItemPayload()

Set the item inside the cache. New value will be send to all registered watch handlers.

```js
client.cache.setItemPayload(query, vars, payload);
```

> Payload must to identical to what's receive from the GraphQL.

### cache.removeItem()

With this we can remove the query and vars combo from the cache. But this won't notify watch handers.

```js
client.cache.removeItem(query, vars);
```

### cache.fireError()

Fire an error for all the registered watchHandlers.

```js
client.cache.fireError(query, vars, new Error('some error'));
```


