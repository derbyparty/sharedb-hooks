## Derby-hook

The way to hook db-interactions on the server

### Ussage

First you should require the package and init it:

server.js

```js
  // ...
  
  var derbyHook = require('derby-hook');
  
  // Add 'hook' and 'onQuery' functions to the store 
  derbyHook(store);
  
  // ...
```

then you can use the function to hook model events, for example:

```js
  
  store.hook('create', 'todos', function(docId, value, session, backend) {
    model = store.createModel();
    model.fetch ('todos.'+docId, function(err){
      var time = +new Date();
      model.set('todos.'+docId+'.ctime', time);
    })
  });
  
  store.hook('change', 'users.*.location', function(docId, value, op, session, backend){
    model = store.createModel()
    console.log('User change location HOOK');
    
    // ....
    
  });
  
  store.hook('del', 'todos', function(docId, value, session, backend) {
    model = store.createModel();
    
    // ....
    
  });
  
  
```

