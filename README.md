tiny-asset-pipeline
=====
*tiny-asset-pipeline* is a node library for compiling and serving web assets. 
It features dependency management for JavaScript and CSS assets, as well as Less.

install:
=====
`[sudo] npm install -g tiny-asset-pipeline`

features:
======
1. **Dependency management for Less(or CSS):** support mixture @import of  .css and .less. CSS file is processed just as less(merge all @import recursively, compile it by lessc). Note that this project includes a modified version of lessc(see *modules/less*).
2. **Dependency management for JavaScript:** using `require("root/subDir/foo.js")` to require foo.js.
3. **Note:** you `require` a js from the root assets directoty, but the css(less) `@import` is using relative path, such as `@import ../plugin/foo.css` 

usage:
=====
1. for **development env** , start server(as assets pipeline server, compile .less, concat .css and .js *per request* ): `tiny-asset-pipeline -start  [-port 8888] [-root yourAssetsRoot]`
2. for **production env** , batch process before deploy assets to *production env* : `tiny-asset-pipeline -from sourceDir -to destinationDir [-verbose or -v] [-noRewriteFileName]`
3. default will rewrite asset file name(append md5 hash to name,such as `foo-1d5a631226eed334.js`), you can prevent it by  pass the `-noRewriteFileName` option.
4. all other assets, such as images and fonts, are copied and renamed to destination directoty. All reference urls of images and fonts in the .less(.css) are renamed automatically(such as `url(icon-update-3da2da84f7287796.png)` or `url(icon-update.png?v=3da2da84f7287796)` if given the `-noRewriteFileName` option ).
   

