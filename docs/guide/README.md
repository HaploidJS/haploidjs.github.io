# Introduction

_single-spa_ is great for building front-end microservices, but barely works out of the box.

There are many replacements of _single-spa_, some are based on it, but still miss many features and have some problems:

1. No support for multi-instances existing in one page;
2. Navigating between applications may block each other, or with problems, see [single-spa#953](https://github.com/single-spa/single-spa/issues/953);
3. No ability to safely destroy an instance;
4. No sandbox or the sandbox is not robust enough;
5. Missing more features below:
   1. `Async Navigation Cancelation`, which is introduced by _single-spa_ v6, but buggy, see [single-spa#950](https://github.com/single-spa/single-spa/issues/950);
   2. `Keep Alive`
   3. `Preload`
   4. `Dead Loop Detect`
   5. and more...

**Haploid.js** is designed to solve the problems and implement the features above. It is built from scratch, avoiding _single-spa_'s imperfection as much as possible, and still compatible with _single-spa_.

Haploid.js has been tested by more than 800 cases.
