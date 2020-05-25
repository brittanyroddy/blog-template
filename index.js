var Metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var layouts = require('metalsmith-layouts');
var permalinks = require('metalsmith-permalinks');
var sass = require('metalsmith-sass');
const autoprefixer = require('metalsmith-autoprefixer');
const collections = require('metalsmith-collections');
var dateFormatter = require('metalsmith-date-formatter')
var serve = require('metalsmith-serve');
var watch = require('metalsmith-watch');

Metalsmith(__dirname)
  .metadata({
    title: "1vee1",
    generator: "Who cares",
    url: "http://www.metalsmith.io/"
  })
  .source('./src')
  .destination('./build')
  .clean(false)
  .use(
    collections({
      posts: {
        sortBy: 'date',
        reverse: true
      }
    })
  )
  .use(dateFormatter({
    dates: [
      {
        key: 'date',
        format: 'YYYY-MM-DD'
      },
    ]
  }))
  .use(sass({
    file: './src/scss/main/index.scss',
    outputStyle: 'compressed',
    outputDir: 'css/'   // This changes the output dir to "build/css/" instead of "build/scss/"
  }))
  .use(autoprefixer())      // add vendor prefixes to CSS rules
  .use(markdown())
  .use(permalinks())
  .use(layouts({
    engine: 'handlebars'
  }))
  // .use(serve({
  //   port: 8081,
  //   verbose: true
  //   }))
  //   .use(watch({
  //     paths: {
  //       "src/**/*": true,
  //       "layouts/**/*": "**/*",
  //     }
  //   }))
  .build(function (err, files) {
    if (err) { throw err; }
  });
