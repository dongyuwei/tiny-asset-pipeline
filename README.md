tiny-asset-pipeline
=====
*tiny-asset-pipeline* is a node library for compiling and serving web assets. 
It features dependency management for JavaScript and CSS assets, as well as Less. It's suitable for multi-page applications. Forget Grunt and Gulp,forge configuration.

install:
=====
`[sudo] npm install -g tiny-asset-pipeline`

features:
======
1. **Dependency management for Less(or CSS):** support mixture @import of .css and .less. All *.css file is processed same as Less file(merge all @import recursively, compile it by lessc). It use the latest(v2.3.1) [lessc compiler](https://github.com/less/less.js).
2. **Dependency management for JavaScript:** using `require("../subDir/foo.js")` to require foo.js. Note it's not a CMD or AMD package manager, it just loads/merge the required Javascript file. It use [UglifyJS](https://github.com/mishoo/UglifyJS) to process the javascripts.
3. **Note:** both `require`(for js) and `@import`(for css and less) are using relative path, such as `@import ../plugin/foo.css` 
4. default will rewrite asset file name(append md5 hash to name,such as `foo-1d5a631226eed334.js`).
5. all other assets, such as images and fonts, are copied and renamed to destination directoty. All reference urls of images and fonts in the .less(.css) are renamed automatically(such as `url(icon-update-3da2da84f7287796.png)`).
6. a **md5_mapping.json** will be generated under the root of destination directoty, you can set the `-mappingFile` option to config the file path and name.


tips:
======
1. all *.js , *.less * and *.css will be processed.
2. for __partials files__: any file(or directory) start with `_ `or `.` will be ignorged(does not been processed), such as `_sub.js` or `_partial.less` or `_child.css` or `_foobar_directory/`.
   
usage:
=====
1. for **development env** , start server(as assets pipeline server, compile .less, concat .css and .js *per request* ): `tiny-asset-pipeline -start  [-port 8888] [-root yourAssetsRoot]`
2. for **production env** , batch process before deploy assets to *production env* : `tiny-asset-pipeline -from sourceDir -to destinationDir [-verbose or -v]` . Finally it will generate a **md5_mapping.json** under the root of destination directoty, you can read the content to find the md5 hash of a special file.


Why not Grunt or Gulp?
======
1. Because I hate to write many configuration.


