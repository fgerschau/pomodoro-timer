const WebPageTest = require('webpagetest');

const PUBLIC_URL = 'https://pomdoro-timer.app';
const wpt = new WebPageTest('https://www.webpagetest.org/', process.env.WPT_API_KEY);

const reportError = (err, id) => {
  console.error('\x1b[31m%s\x1b[0m', `
    Error in ${id}:
      ${err}
  `);
};

const runTest = () => {
  const customMetricsScript = `
    [ttfrTimer]
    var timerEntry = performance.getEntriesByName('timer-screen')[0];
    if (timerEntry) {
      return timerEntry.startTime;
    }
  `;

  return new Promise((resolve, reject) => {
    wpt.runTest(PUBLIC_URL, {
      customMetrics: customMetricsScript,
      location: 'ec2-eu-central-1',
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
    const intervalId = setInterval(() => {
      wpt.getTestStatus(testId, (err, result) => {
        if (result && result.statusCode !== 200) {
          process.stdout.clearLine();
          process.stdout.cursorTo(0)
          nDots = (nDots + 1) % 4;
          const dots = new Array(nDots + 1).join('.');
          process.stdout.write('\033[35m' + result.statusText + dots + '\033[0m');
        }

        if (result && result.statusCode === 200) {
          clearInterval(intervalId);
          console.clear();
          return resolve();
        }

        if (err) {
          clearInterval(intervalId);
          reportError(err, 'waitForResult');
          reject(err);
        }
      });
    }, 1000);
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
    `);

    const result = await runTest();
    if (!result || !result.testId) return reportError(result);

    const testId = result.testId;
    await waitForResult(testId);
    const finalResult = await getTestResult(testId)

    if (finalResult.data && finalResult.data.average && finalResult.data.average.firstView){
      console.log('Time to first render - Timer screen:', finalResult.data.average.firstView.ttfrTimer);
    } else {
      console.error('Result not valid\n', finalResult);
    }
  } catch (e) {
    reportError(e, 'main');
  }
};

main();
