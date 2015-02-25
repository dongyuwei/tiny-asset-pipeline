tiny-asset-pipeline
=====
*tiny-asset-pipeline* is a node library for compiling and serving web assets. 
It features dependency management for JavaScript and CSS assets, as well as Less. It's suitable for multi-page applications. Forget Grunt and Gulp,forge configuration.

Install:
=====
`[sudo] npm install -g tiny-asset-pipeline`

Features:
======
1. **Dependency management for Less(or CSS):** support mixture @import of .css and .less. All *.css file is processed __same__ as Less file(merge all @import recursively, compile it by lessc). It use the latest(v2.3.1) [Less.js](https://github.com/less/less.js).
2. **Dependency management for __JavaScript__:** using `require("../subDir/foo.js")` to require foo.js. Note it's not a CMD or AMD package manager, it just loads/merge the required Javascript file. It use [UglifyJS](https://github.com/mishoo/UglifyJS) to process the javascripts.
3. It integrated with [__autoprefixer__](https://github.com/postcss/autoprefixer). So you can write your CSS rules without vendor prefixes (in fact, forget about them entirely).
4. **Note:** both `require`(for js) and `@import`(for css and less) are using __relative path__, such as `@import ../plugin/foo.css`. Images and fonts also use relative path.
5. It will __rename__ asset(append md5 hash to name,such as `foo-1d5a631226eed334.js`).
6. All other assets except js/css/less, such as images and fonts, are copied and renamed to deploy directoty. All reference urls of images and fonts in the *.less/*.css are renamed automatically(such as `url(icon-update-3da2da84f7287796.png)`).
7. A **md5_mapping.json** will be generated under the root of destination directoty, you can set the `-mappingFile` option to config the file path and name.


Tips:
======
1. All *.js , *.less * and *.css will be processed.
2. For __partials files__: any file(or directory) start with `_ `or `.` will be ignorged(does not been processed), such as `_sub.js` or `_partial.less` or `_child.css` or `_foobar_directory/`.
   
usage:
=====
1. For **development environment** , start server(as assets pipeline server, compile .less, concat .css and .js *per request* ): `tiny-asset-pipeline -start  [-port 8888] [-root yourAssetsRoot]`
2. For **production environment** , batch process before deploy assets to *production env* : `tiny-asset-pipeline -from sourceDir -to destinationDir [-verbose or -v]` . Finally it will generate a **md5_mapping.json** under the root of destination directoty, you can read the content to find the md5 hash of a special file.


Why not Grunt or Gulp?
======
1. Because I hate to write many configuration.


