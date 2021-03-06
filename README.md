# What is Observable connection?

It is a registry for observable strams. Features:

- it manages dependent observables
- pretend to be small

## What it won't do

- dictate app architechture (hornestly, already does)
- dictate DOM framework to use (initially developed with Angular 1.x, React is welcome too)

## Possible applications

Real-time or polling web apps or applications with many different events to handle.

# API draft

### Define connection

```javascript
class MyConnection extends Connection;
const connection = new MyConnection(options);
```

### Define new observable

```javascript
const Rx = require('rxjs');

const plugin = function userSelection() {
  return new Rx.BehaviorSubject([]);
}
const connection = new MyConnection({
  plugins: {plugin}
});
```

### Reading - Observable subscribtion

```javascript
connection.userSelection.subscribe(selection => {
  console.log('your selection: ', selection);
})
```

### Writing - Subject next()

```javascript
const Rx = require('rxjs');

const plugin = function userSelection() {
  const _secretValue = []; // immutable, if you want
  const subject = new Rx.BehaviorSubject(_secretValue);
  subject.add = (item) => {
    // type check if you want
    _secretValue.push(item);
    subject.next(_secretValue);
  }
  return subject;
}
// ...
connection.userSelection.add('foo');


```
