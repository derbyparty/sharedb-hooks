var _ = require('lodash')
module.exports = function(backend) {
  backend.hook = hook.bind(backend);
  backend.onQuery = onQuery.bind(backend);
};

function onQuery(collectionName, cb) {
  var backend = this;

  backend.use('query', function (shareRequest, next) {

    var session = shareRequest.agent.connectSession;

    if (collectionName === '*') {
      return cb(shareRequest.collection, shareRequest.query, session, next);
    }

    if (shareRequest.collection !== collectionName) return next();

    cb(shareRequest.query, session, next);

  });
}


function hook(method, pattern, fn) {
  var backend = this;

  backend.use('apply', function(shareRequest, done) {
    const stream = shareRequest.agent.stream || {}

    const opData = shareRequest.op
    const snapshot = shareRequest.snapshot

    if (!opData.create && !opData.del && !shareRequest.originalSnapshot){
      shareRequest.originalSnapshot = _.cloneDeep(snapshot)
    }

    done()
  })

  backend.use('after submit', function (shareRequest, next) {
    var collectionName, firstDot, fullPath, matches, regExp, relPath, segments, op;

    var opData = shareRequest.opData || shareRequest.op;
    var snapshot = shareRequest.snapshot;
    var docName = shareRequest.docName || shareRequest.id;
    var backend = shareRequest.backend;
    var session = shareRequest.agent.connectSession;

    if (method === 'update') {
      if (shareRequest.collection !== pattern) return next()
      fn(docName, snapshot.data, shareRequest.originalSnapshot && shareRequest.originalSnapshot.data, session, backend);
      return next()
    }
    if (opData.del || opData.create) {
      collectionName = pattern;
      if (collectionName !== shareRequest.collection) return next();
    } else {
      firstDot = pattern.indexOf('.');
      if (firstDot === -1) {
        if (!patternToRegExp(pattern).test(shareRequest.collection)) return next();
      } else {
        collectionName = pattern.slice(0, firstDot);
        if (collectionName !== shareRequest.collection) return next();
      }
    }

    switch (method) {
      case 'del':
        if (!opData.del) return next();
        fn(docName, shareRequest, session, backend);
        break;
      case 'create':
        if (!opData.create) return next();
        fn(docName, shareRequest.snapshot.data, session, backend);
        break;
      case 'change':
        var ops = opData.op;
        if (ops) {
          for (var i = 0; i < ops.length; i++) {
            op = ops[i];
            segments = op.p;
            if (op.si || op.sd) segments = segments.slice(0, -1);

            relPath = segments.join('.');
            fullPath = collectionName + '.' + docName + '.' + relPath;
            regExp = patternToRegExp(pattern);
            matches = regExp.exec(fullPath);
            if (matches) {
              fn.apply(null, Array.prototype.slice.call(matches.slice(1)).concat([lookup(segments, snapshot.data)], [op], [session], [backend]));
            }
          }
        }
    }
    next();
  });
}


function patternToRegExp(pattern) {
  var end;
  end = pattern.slice(pattern.length - 2, pattern.length);
  if (end === '**') {
    pattern = pattern.slice(0, pattern.length - 2);
  } else {
    end = '';
  }
  pattern = pattern.replace(/\./g, "\\.").replace(/\*/g, "([^.]*)");
  return new RegExp(pattern + (end ? '.*' : '$'));
}

function lookup(segments, doc) {
  var curr, part, _i, _len;
  curr = doc;
  for (_i = 0, _len = segments.length; _i < _len; _i++) {
    part = segments[_i];
    if (curr !== void 0) {
      curr = curr[part];
    }
  }
  return curr;
}
