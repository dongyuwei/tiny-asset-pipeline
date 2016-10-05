var foo = require('./_foo.js');
console.log(foo);
console.log(foo.hi());
console.log('foobar');

console.assert(foo.hi() === 'foo bar' );
console.assert(foo.name === 'foofoo');
