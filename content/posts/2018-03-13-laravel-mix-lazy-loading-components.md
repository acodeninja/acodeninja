---
title: "laravel mix - lazy loading Vue components"
date: 2018-03-13
draft: false
toc: true
keywords:
    - lazy loading
    - frontend
    - vuejs
    - laravel
    - laravel mix
aliases:
    - /laravel-mix-lazy-loading-components/
---

## why?
Lazy loading components gives a great performance improvement. Larger components
can take ages to load and result in an unusable page for a few seconds while the
massive app.js file is loaded.

## how?
You can follow these steps on the 
[tutorial repo](https://github.com/acodeninja/laravel-mix-lazy-loading-vue-components).

### 1. babel plugins
You will need to add both the babel-plugin-dynamic-import-webpack  and 
babel-plugin-syntax-dynamic-import  packages to your package.json

```shell script
$ npm install --save-dev \ 
    babel-plugin-dynamic-import-webpack \
    babel-plugin-syntax-dynamic-import
```

**[tutorial commit](https://github.com/acodeninja/laravel-mix-lazy-loading-vue-components/commit/5bb734eb3e802fac9dc66acef52c95288e9d06f0)**

### 2. bable config
Create a file in the root of your Laravel application called .babelrc  with the
following contents.

```json
{
    "plugins": ["syntax-dynamic-import"]
}
```


**[tutorial commit](https://github.com/acodeninja/laravel-mix-lazy-loading-vue-components/commit/74a2fd135c4916dc8515dcc07839b9697b51520c)**

### 3. webpack config
Update your webpack.mix.js file to the following:

```javascript
let mix = require('laravel-mix');

// Override mix internal webpack output configuration
mix.config.webpackConfig.output = {
    chunkFilename: 'js/[name].bundle.js',
    publicPath: '/',
};

mix.js('resources/assets/js/app.js', 'public/js')
   .sass('resources/assets/sass/app.scss', 'public/css')
   .version(); 
```


**[tutorial commit](https://github.com/acodeninja/laravel-mix-lazy-loading-vue-components/commit/52116781379d3f829909cc21bd8bd3f8ce1e2676)**

### 4. app.js
Instead of loading components in the standard way,

```javascript
Vue.component(
    'example-component',
    require('./components/ExampleComponent.vue') 
);
```

We need to use the lazy loading import method.

```javascript
Vue.component(
    'example-component', 
    () => import(
        /* webpackChunkName: "example-component" */
        './components/ExampleComponent.vue'
    )
);
```

The [`import()`](https://github.com/tc39/proposal-dynamic-import) function will
load the Vue component in dynamically, so it is only loaded by the browser when
actually used.

`/* webpackChunkName: "example-component" */`  is used to specify the name of 
the bundle file webpack generates. In this instance a file called 
`example-component.bundle.js` is created in the `public/js/` directory.

**[tutorial commit](https://github.com/acodeninja/laravel-mix-lazy-loading-vue-components/commit/75b15fcabf9b9a7b84fb8c3f43f358e624a2e194)**

### 5. done
Now you have lazy loading components, your application will be a little more
responsive on first load and when each Vue component initialises, the browser
will load the component's file chunk.

## a note on sub-components
Sub-components will be included in the bundle of the parent component they are
imported into.

Say we add a new component to `ExampleComponent.vue`

```javascript
import ExampleSubComponent from './ExampleSubComponent.vue'; 

export default {   
    components: {    
        ExampleSubComponent,
    },   
    mounted() {
        console.log('Component mounted.')   
    } 
};
```

The `ExampleSubComponent` will be included in `public/js/example-component.bundle.js` 
rather than `public/js/app.js`.
