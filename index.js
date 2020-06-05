var Metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var layouts = require('metalsmith-layouts');
var permalinks = require('metalsmith-permalinks');
var sass = require('metalsmith-sass');
const autoprefixer = require('metalsmith-autoprefixer');
const collections = require('metalsmith-collections');
var dateFormatter = require('metalsmith-date-formatter');
var copy = require('metalsmith-copy');
const sitemap = require('metalsmith-mapsite');
const fs =require('fs')

var ampExt = require('cuid')() + '-amp.'

const siteURL = 'https://www.1vee1.com/';
console.log('cuid:', ampExt)

Metalsmith(__dirname)
  .metadata({
    title: "Beauty and the Breakpoint",
    generator: "Who cares",
    url: siteURL,
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
    file: './src/scss/index.scss',
    outputStyle: 'compressed',
    outputStyle: 'expanded',
    outputDir: 'css/'   // This changes the output dir to "build/css/" instead of "build/scss/"
  }))
  .use(autoprefixer())
  .use(copy({
    pattern: 'posts/*.md',
    transform: function (file) {
      console.log('file:', JSON.stringify(file, null, 2))
      const nameArray = file.split('.')
      const ext = nameArray.pop()
      const name = nameArray.join('.') + ampExt

      return name + ext;
    }
  }))     // add vendor prefixes to CSS rules
  .use(x => {
    const keys = Object.keys(x)
    const isAmp = keys.filter(key => key.includes(ampExt))

    keys.forEach(key => {
      x[key].ampLink = siteURL + x[key].path.replace('.md', '') + '-amp'
      x[key].nonAmpLink = siteURL + x[key].path.replace('.md', '')
    })

    isAmp.forEach(key => {
      x[key].layout = 'amp.html'
      x[key].collection = ['amp']
      x[key].imageString = x[key].image ? safeString(x[key].image) : null
      x[key].titleString = x[key].title ? safeString(x[key].title) : null

      renameKey(key, key.replace(ampExt, '-amp.'), x)
    })

    return x
  })
  .use(markdown())
  .use(permalinks())
  .use(layouts({
    engine: 'handlebars'
  }))
  .use(sitemap({
    hostname: siteURL,
    omitIndex: true
  }))
  .build(function (err, files) {
    if (err) { throw err; }
  });

const renameKey = (oldKey, newKey, obj) => {
  if (oldKey !== newKey) {
    Object.defineProperty(obj, newKey,
      Object.getOwnPropertyDescriptor(obj, oldKey));
    delete obj[oldKey];
  }
}

const safeString = (str) => {
  const needsFormatting = JSON.stringify(str)
  removeAt(str, 0)
  removeAt(str, str.length - 1)


  return str
}

const removeAt = (str, i) => {
  var minusOneStr = str.slice(0, i) + str.slice(i + 1);
  console.log(minusOneStr);
}