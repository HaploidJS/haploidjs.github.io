*single-spa* is great for building front-end microservices, but barely works out of the box. 

There are many replacements of *single-spa*, some are based on it, but still miss many features and have some problems:

1. No support for multi-instances existing in one page;
2. Navigating between applications may block each other, or with problems, see [single-spa#953](https://github.com/single-spa/single-spa/issues/953);
3. No ability to safely destroy an instance;
4. No sandbox or the sandbox is not robust enough;
5. Missing more features below:
   1. `Async Navigation Cancelation`, which is introduced by *single-spa* v6, but buggy, see [single-spa#950](https://github.com/single-spa/single-spa/issues/950);
   2. `Keep Alive`
   3. `Preload`
   4. `Dead Loop Detect`
   5. and more...

**Haploid.js** is designed to solve the problems and implement the features above. It is built from scratch, avoiding *single-spa*'s imperfection as much as possible, and still compatible with *single-spa*.

Haploid.js has been tested by more than 800 cases, and is supporting dozens of applications in *kuaishou.com*.

