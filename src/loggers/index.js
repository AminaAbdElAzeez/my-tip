import pino from "pino";

const send = async function (level, logEvent, a, b) {
  const url = "https://demo.parseable.io/api/v1/logstream/pinotest";

console.log({logEvent})

  const response = await fetch(url, {
    method: "POST",
    headers: {
      // Authorization: "Basic cGFyc2VhYmxlOnBhcnNlYWJsZQ=x=",
      // "Content-Type": "application/json",
    },
    body: JSON.stringify([logEvent]),
  });
  console.log(response);
};

const logger = pino({
  browser: {
    serialize: true,
    asObject: true,
    transmit: {
      send,
    },
  },
});

export default logger;