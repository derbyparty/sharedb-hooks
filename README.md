## sharedb-hooks

The way to hook db-interactions on the server

### Usage

First you should require the package and init it:

server.js

```js
  
  // Add 'hook' and 'onQuery' functions to the backend 
  require('sharedb-hooks')(backend);
  
  // ...
```

then you can use the function to hook model events, for example:

```js
  
  backend.hook('create', 'todos', function(docId, value, session, backend) {
    model = backend.createModel();
    model.fetch ('todos.'+docId, function(err){
      var time = +new Date();
      model.set('todos.'+docId+'.ctime', time);
    })
  });
  
  backend.hook('change', 'users.*.location', function(docId, value, op, session, backend){
    model = backend.createModel()
    console.log('User change location HOOK');
    
    // ....
    
  });
  
  backend.hook('del', 'todos', function(docId, value, session, backend) {
    model = backend.createModel();
    
    // ....
    
  });
  
  
```

## MIT License 2016


