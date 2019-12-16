const superagent = require('superagent');

function loop(func, interval) {
  func(); // call immediately
  const handle = setInterval(func, interval * 1000);

  return {
    handle,
    stop() {
      setTimeout(() => clearTimeout(handle));
    },
  };
}

async function request({
  method = 'GET',
  url,
  query,
  header,
  body,
  timeout,
}) {
  let promise = superagent[method.toLowerCase()](url);
  promise = query ? promise.query(query) : promise;
  promise = header ? promise.set(header) : promise;
  promise = body ? promise.send(body) : promise;
  promise = timeout ? promise.timeout(timeout) : promise;

  let response;
  try {
    response = await promise;
  } catch (e) {
    response = e.response;
  }
  return response;
}

module.exports = {
  loop,
  request,
};
