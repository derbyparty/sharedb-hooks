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

## MIT License
Copyright (c) 2014 by Artur Zayats

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

