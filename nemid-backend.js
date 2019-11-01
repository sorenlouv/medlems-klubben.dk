const http = require('http');
const static = require('node-static');
const uuidv4 = require('uuid/v4')

const hostname = '127.0.0.1';
const port = 8080;
const file = new static.Server('./public');
var browsers = {};

function async browser(username, password) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  await page.goto('https://www.odensebib.dk/gatewayf/login?destination=frontpage');
  const frame = page.frames().find(frame => frame.name() === 'nemid_iframe');
  await frame.waitForSelector('.userid-pwd input:focus', { visible: true, timeout: 5000 });
  await page.keyboard.type(username);
  await page.keyboard.press('Tab');
  await page.keyboard.type(password);
  await page.keyboard.press('Enter');

  return page;
}

function async otpRequest(page) {
  const frame = page.frames().find(frame => frame.name() === 'nemid_iframe');
  await frame.waitForSelector('button', { visible: true, timeout: 2000 });
  otp = await frame.querySelector('input.otp-input:focus', { visible: true });
  if (!otp) {
    frame.click('a.link')
    await frame.waitForSelector('input.otp-input:focus', { visible: true });
    otp = await frame.querySelector('input.otp-input:focus', { visible: true });
  }
  otp_query = await otp.evaluate((node) => node.parentNode.previousSibling.innerText);
  return otp_query;
}

function async submitOTP(code) {
  await page.keyboard.type(code);
  await page.keyboard.press('Enter');
}

const server = http.createServer((req, res) => {
  function start(err, body) {
    if (err) {
      res.statusCode = 500;
      return res.end("Bad JSON");
    }

    var id = uuidv4();
    browsers[id] = browser(body.username, body.password);

    res.setHeader("content-type", "application/json")
    res.end({ id });
  }
  function poll(err, body) {
    if (err) {
      res.statusCode = 500;
      return res.end("Bad JSON");
    }
    var otpRequestCode = null;
    var waitingForAppAck = false;
    var unreadMessages = null;
    var id = body.id;

    if (browsers[id]) {
      var page = browsers[id];
      otpRequestCode = await otpRequest(page);
    }
    else {
      unreadMessages = 1;
    }
    res.end({ unreadMessages, otpRequestCode, waitingForAppAck });
  }
  function responseCode(err, body) {
    if (err) {
      res.statusCode = 500;
      return res.end("Bad JSON");
    }

    var id = body.id;
    var responseCode = body.responseCode;
    var page = browsers[id];
    await submitOTP(page, responseCode);
    browsers[id].close();
    browsers[id] = true;
    res.end();
  }

  if (req.url === "/start") {
    jsonBody(req, {}, start);
  } else if (req.url === "/poll") {
    jsonBody(req, {}, poll);
  } else if (req.url === "/responseCode") {
    jsonBody(req, {}, responseCode);
  } else {
    file.serve(req, res);
  }
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World!\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
