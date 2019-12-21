'use strict';

const path = require('path');
const fs = require('fs');
const express = require('express');
const nunjucks = require('nunjucks');
const request = require("request");
const urlencode = require('urlencode');

const basePath = process.env.BASE_PATH || '/';
const rootPath = path.resolve(__dirname, './dist/openprocure-app-main-page');

const app = express();
app.use(basePath, express.static(rootPath, {
  index: false,
  maxAge: '1d',
}));

nunjucks.configure(rootPath, {
  autoescape: true,
  express: app
});

var theme = 'govbuy';
var themeFileName = 'theme.'+theme+'.he.json';
var themeScript = '';
var themeJson = null;
// try the themes root directory first - this allows mount multiple themes in a single shared docker volume
if (fs.existsSync(path.resolve('/themes', themeFileName))) {
  themeJson = JSON.parse(fs.readFileSync(path.resolve('/themes', themeFileName)));
  // fallback to local file - for local development / testing
} else if (fs.existsSync(path.resolve(__dirname, themeFileName))) {
  themeJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, themeFileName)));
}
if (themeJson) {
  themeJson.BUDGETKEY_NG2_COMPONENTS_THEME.siteLogo = 'govbuy-invert.svg';
  for (var key in themeJson) {
    themeScript += key+"="+JSON.stringify(themeJson[key])+";";
  }
  themeScript += "BUDGETKEY_THEME_ID=" + JSON.stringify(theme) + ";";
}
themeScript += "GOVBUY_GONFIG=" + fs.readFileSync(path.resolve(rootPath, 'assets', 'configuration.json'))


app.set('port', process.env.PORT || 8000);

app.get(basePath + '*', function(req, res) {
  var filePath = path.resolve(rootPath, req.params[0]);
  if (fs.existsSync(filePath)) {
    var stats = fs.lstatSync(filePath);
    if (stats.isFile()) {
      return res.sendFile(filePath);
    }
  }

  let doc_id = 'reports/open-procure-main-page';
  request({
    url: 'https://next.obudget.org/get/' + urlencode(doc_id),
    json: true
  }, function (error, response, body) {
    if (response.statusCode === 200 && body !== null && body.value) {    
      body = body.value;
      res.render('index.html', {
        base: basePath,
        themeScript: themeScript,
        prefetchedData: JSON.stringify(body),
      });
    } else {
      res.sendStatus(response.statusCode);
    }
  });
});

app.listen(app.get('port'), function() {
  console.log('Listening port ' + app.get('port'));
});
