## [1.4.0](https://github.com/t28hub/auto-palette-ts/compare/v1.3.4...v1.4.0) (2024-12-27)

### Features

* add support for DBSCAN++ algorithm to improve processing speed by approximately 20% ([#397](https://github.com/t28hub/auto-palette-ts/issues/397)) ([21aa581](https://github.com/t28hub/auto-palette-ts/commit/21aa5814ee0473b7410a2bd6dc2af13894583813))
* implement Weighted Farthest Point Sampling for prominent color sampling ([#402](https://github.com/t28hub/auto-palette-ts/issues/402)) ([4d17fce](https://github.com/t28hub/auto-palette-ts/commit/4d17fce58d96f61f4f502516979f6a8b91cd7d4a))

## [1.3.4](https://github.com/t28hub/auto-palette-ts/compare/v1.3.3...v1.3.4) (2024-12-22)

## [1.3.3](https://github.com/t28hub/auto-palette-ts/compare/v1.3.2...v1.3.3) (2024-12-02)

### Bug Fixes

* configure benchmarks to run only in Node.js environment ([#371](https://github.com/t28hub/auto-palette-ts/issues/371)) ([e48ecf3](https://github.com/t28hub/auto-palette-ts/commit/e48ecf38d86fac5511b055a71b3d32473b2b0bfe))
* the issue that canvas cannot draw the same size of image in img element ([#362](https://github.com/t28hub/auto-palette-ts/issues/362)) ([a098710](https://github.com/t28hub/auto-palette-ts/commit/a098710bc7d1dcfa4b8890f63eb683a76d707f85))
* update biome to 1.6.0 and correct reported errors ([11b1b5d](https://github.com/t28hub/auto-palette-ts/commit/11b1b5d7dbcd446c2baf786987e1d7e6edffb357))

### Performance Improvements

* improve tree construction performance by specifying leafSize in KDTree ([f4fd7ff](https://github.com/t28hub/auto-palette-ts/commit/f4fd7ff7e77678cc81e458685c1a2fd387e4e92a))
* optimize distance comparison in k-nearest neighbors search using KDTree ([c210d02](https://github.com/t28hub/auto-palette-ts/commit/c210d026d60b396d87bb39bc475e70078bd6f43e))

## [1.3.3](https://github.com/t28hub/auto-palette-ts/compare/v1.3.2...v1.3.3) (2024-12-02)

### Bug Fixes

* configure benchmarks to run only in Node.js environment ([#371](https://github.com/t28hub/auto-palette-ts/issues/371)) ([e48ecf3](https://github.com/t28hub/auto-palette-ts/commit/e48ecf38d86fac5511b055a71b3d32473b2b0bfe))
* the issue that canvas cannot draw the same size of image in img element ([#362](https://github.com/t28hub/auto-palette-ts/issues/362)) ([a098710](https://github.com/t28hub/auto-palette-ts/commit/a098710bc7d1dcfa4b8890f63eb683a76d707f85))
* update biome to 1.6.0 and correct reported errors ([11b1b5d](https://github.com/t28hub/auto-palette-ts/commit/11b1b5d7dbcd446c2baf786987e1d7e6edffb357))

### Performance Improvements

* improve tree construction performance by specifying leafSize in KDTree ([f4fd7ff](https://github.com/t28hub/auto-palette-ts/commit/f4fd7ff7e77678cc81e458685c1a2fd387e4e92a))
* optimize distance comparison in k-nearest neighbors search using KDTree ([c210d02](https://github.com/t28hub/auto-palette-ts/commit/c210d026d60b396d87bb39bc475e70078bd6f43e))

## [1.3.2](https://github.com/t28hub/auto-palette-ts/compare/v1.3.1...v1.3.2) (2024-02-19)


### Bug Fixes

* resolve error when using WebWorker in Next.js app ([33ad204](https://github.com/t28hub/auto-palette-ts/commit/33ad2044f0e52673b6a918f18d0512596a8785f1))

## [1.3.1](https://github.com/t28hub/auto-palette-ts/compare/v1.3.0...v1.3.1) (2024-02-09)


### Bug Fixes

* export NamedSwatch to allow it to be used from outside of library ([d4f65f2](https://github.com/t28hub/auto-palette-ts/commit/d4f65f205389546fde0efd6122e58b1e7c8a2974))

## [1.3.0](https://github.com/t28hub/auto-palette-ts/compare/v1.2.0...v1.3.0) (2024-02-09)


### Features

* add most similar color name to extracted swatches ([afaf1e3](https://github.com/t28hub/auto-palette-ts/commit/afaf1e3584d9bb39cee77dc86a42f1f8008d4b45))
* implement Cache using Least Frequently Used (LFU) cache algorithm ([c243efa](https://github.com/t28hub/auto-palette-ts/commit/c243efaa4b57109d721fae27dd72a6c6b092c285))


### Performance Improvements

* integrate LFUCache for faster color name lookup ([d80abff](https://github.com/t28hub/auto-palette-ts/commit/d80abff96cee5bc7cfe3e20c84ad919bae4d7a4b))

## [1.3.0](https://github.com/t28hub/auto-palette-ts/compare/v1.2.0...v1.3.0) (2024-02-09)


### Features

* add most similar color name to extracted swatches ([afaf1e3](https://github.com/t28hub/auto-palette-ts/commit/afaf1e3584d9bb39cee77dc86a42f1f8008d4b45))
* implement Cache using Least Frequently Used (LFU) cache algorithm ([c243efa](https://github.com/t28hub/auto-palette-ts/commit/c243efaa4b57109d721fae27dd72a6c6b092c285))


### Performance Improvements

* integrate LFUCache for faster color name lookup ([d80abff](https://github.com/t28hub/auto-palette-ts/commit/d80abff96cee5bc7cfe3e20c84ad919bae4d7a4b))

## [1.2.0](https://github.com/t28hub/auto-palette-ts/compare/v1.1.0...v1.2.0) (2024-01-14)


### Features

* change default Theme from undefined to 'basic' and refactor ThemeStrategy implementation ([1a42357](https://github.com/t28hub/auto-palette-ts/commit/1a423571a5e73953b7b9c9e1abd52b06f39b6c7f))


### Bug Fixes

* correct conditions for 'if' keyword in .github/workflows/build.yml ([12a24d6](https://github.com/t28hub/auto-palette-ts/commit/12a24d69288885aeecac795be4c30c42d0677e35))

## [1.1.0](https://github.com/t28hub/auto-palette-ts/compare/v1.0.1...v1.1.0) (2023-12-27)


### Features

* improve swatch selection algorithm by pre-filtering candidates based on theme ([c46e614](https://github.com/t28hub/auto-palette-ts/commit/c46e614887aaf60b90e15d2fd630844a0742c472))
* improve swatch selection algorithm by revising coefficients to avoid selecting the same color ([2e9ff81](https://github.com/t28hub/auto-palette-ts/commit/2e9ff8197fca0850ca4137d92a6779b5056ea99e))

## [1.0.1](https://github.com/t28hub/auto-palette-ts/compare/v1.0.0...v1.0.1) (2023-12-22)


### Bug Fixes

* resolve errors in non-browser enviroments that does not supports DOM elements ([a9fd4fd](https://github.com/t28hub/auto-palette-ts/commit/a9fd4fdfdcd53ea34fa64ea46da1b8a4ed728d44))


### Reverts

* change to actions/create-github-app-token from tibdex/github-app-token ([79ad832](https://github.com/t28hub/auto-palette-ts/commit/79ad8324926560869f040c7c55f14af782336ee3))

## 1.0.0
- An official release of the library.
