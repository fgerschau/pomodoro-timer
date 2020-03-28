const WebPageTest = require('webpagetest');
const util = require('util');

const PUBLIC_URL = 'https://pomodoro-timer.app';
const wpt = new WebPageTest('https://www.webpagetest.org/', process.env.WPT_API_KEY);

const isCI = process.env.CI;

const reportError = (err, id) => {
  console.error('\x1b[31m%s\x1b[0m', `
    Error in ${id}:
      ${err}
  `);
};

const runTest = () => {
  return new Promise((resolve, reject) => {
    wpt.runTest(PUBLIC_URL, {
      runs: 1,
      firstViewOnly: false,
    }, (err, result) => {
      //console.log(err || result);
      if (result && result.data) {
        return resolve(result.data);
      } else {
        reportError(err, 'runTest');
        return reject(err);
      }
    });
  });
};

const waitForResult = (testId) => {
  return new Promise((resolve, reject) => {
    let nDots = 1;
    let interval = 1_000;
    if (isCI) {
      interval = 10_000;
    }
    const intervalId = setInterval(() => {
      wpt.getTestStatus(testId, (err, result) => {
        if (result && result.statusCode !== 200) {
          const stdout = process.stdout;
          if (!isCI) {
            stdout.clearLine();
            stdout.cursorTo(0);
          } else {
            // print less often because lines can't be cleared
            // in travis CI
            console.log('\n');
            interval = 10_000;
          }

          nDots = (nDots + 1) % 4;
          const dots = new Array(nDots + 1).join('.');
          stdout.write('\033[35m' + '    ' + result.statusText + dots + '\033[0m');
        }

        if (result && result.statusCode === 200) {
          clearInterval(intervalId);
          console.log('\n');
          return resolve();
        }

        if (err) {
          clearInterval(intervalId);
          reportError(err, 'waitForResult');
          reject(err);
        }
      });
    }, interval);
  });
};

const getTestResult = (testId) => {
  return new Promise((resolve, reject) => {
    wpt.getTestResults(testId, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        reportError(err, 'getTestResult');
        return reject(err);
      }
    });
  });
};

const main = async () => {
  try {
    console.clear();
    console.log('\x1b[35m%s\x1b[0m', `
    Starting WebPageTest:
      URL: ${PUBLIC_URL}
      CI: ${isCI}
    `);

    const result = await runTest();
    if (!result || !result.testId) return reportError(result);

    const testId = result.testId;
    await waitForResult(testId);
    const finalResult = await getTestResult(testId)

    if (isCI) {
      console.log('Final result:\n', util.inspect(finalResult, false, null, true));
    }

    console.log('Summary:', finalResult.data.summary);
    console.log('ID:', finalResult.data.id);
    console.log('Location:', finalResult.data.location);
    const ttfrTimer =
      finalResult.data &&
      finalResult.data.average &&
      finalResult.data.average.firstView &&
      finalResult.data.average.firstView['userTime.timer-screen'];
    console.log('Time to first render - Timer screen: %sms', ttfrTimer);
    // too slow, process failed
    if (ttfrTimer > 1200) {
      process.exit(1);
    }
  } catch (e) {
    reportError(e, 'main');
  }
};

main();
