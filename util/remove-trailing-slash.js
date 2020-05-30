const fs = require('fs')
const xmldoc = require('xmldoc');

let xml = fs.readFileSync('./build/sitemap.xml').toString()
let document = new xmldoc.XmlDocument(xml.toString());
let descs = document.descendantWithPath('xml.urlset.url.loc')