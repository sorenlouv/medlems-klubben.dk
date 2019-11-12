const http = require('http');
const static = require('node-static');
const uuidv4 = require('uuid/v4')
const jsonBody = require('body/json')
const sendJson = require('send-data/json')
const puppeteer = require('puppeteer');

const hostname = '0.0.0.0';
const port = 8080;

const file = new static.Server('./build');
let browsers = {};

async function browser(username, password) {
  const puppet = await puppeteer.launch({
    slowMo: 250, // slow down by 250ms
    timeout: 60000,
    //headless: false,
  });
  const page = await puppet.newPage();
  page.setDefaultTimeout(60000);
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  await page.tracing.start({ path: 'trace.json', screenshots: true });
  try {
    await page.goto('https://www.odensebib.dk/gatewayf/login?destination=frontpage');
    await page.waitForSelector('iframe#nemid_iframe');
    const frame = page.frames().find(frame => frame.name() === 'nemid_iframe');
    await frame.waitForSelector('.userid-pwd input:focus', { visible: true });
    await page.keyboard.type(username);
    await page.keyboard.press('Tab');
    await page.keyboard.type(password);
    await page.keyboard.press('Enter');
  }
  finally {
    await page.tracing.stop();
  }
  return page;
}

async function otpRequest(page) {
  await page.waitForSelector('iframe#nemid_iframe');
  const frame = page.frames().find(frame => frame.name() === 'nemid_iframe');
  await frame.waitForSelector('button', { visible: true });
  otp = await frame.$('input.otp-input:focus', { visible: true });
  if (!otp) {
    // Switch from app to otp card mode.
    await frame.click('a.link')
    otp = await frame.waitForSelector('input.otp-input:focus', { visible: true });
  }
  otp_query = await otp.evaluate((node) => node.parentNode.previousSibling.innerText);
  return otp_query;
}

async function submitOTP(code) {
  await page.keyboard.type(code);
  await page.keyboard.press('Enter');
}

const server = http.createServer((req, res) => {
  function start(err, body) {
    if (err) {
      res.statusCode = 500;
      return res.end("Bad JSON");
    }

    let id = uuidv4();
    browsers[id] = {
      unreadMessages: null,
      otpRequestCode: null,
      waitingForAppAck: false,
      page: null
    };
    sendJson(req, res, { id });

    browser(body.username, body.password).then(page => {
      browsers[id].page = page;
      otpRequest(page).then(otpRequestCode => {
        browsers[id].otpRequestCode = otpRequestCode;
      });
    });
  }
  function poll(err, body) {
    if (err) {
      res.statusCode = 500;
      return res.end("Bad JSON");
    }

    let id = body.id;

    if (!browsers[id]) {
      res.statusCode = 404;
      return res.end("Not Found");
    }

    const {
      unreadMessages, otpRequestCode, waitingForAppAck, page
    } = browsers[id];
    sendJson(req, res, { unreadMessages, otpRequestCode, waitingForAppAck });
  }
  function responseCode(err, body) {
    if (err) {
      res.statusCode = 500;
      return res.end("Bad JSON");
    }

    let id = body.id;
    let responseCode = body.responseCode;
    submitOTP(brower[id].page, responseCode).then(() => {
      browsers[id].unreadMessages = 1336;
      browsers[id].page.close();
      browsers[id].unreadMessages = 1337;
    });
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
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
