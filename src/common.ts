async function transport(level: string, message: string, rest: string[]) {
  try {
    await fetch(`http://localhost:${process.env.PORT || 3000}/log`, {
      body: JSON.stringify({ level, message, rest }),
      headers: {
        Authorization: `Basic ${btoa(':' + process.env.LOG_KEY)}`,
      },
      method: 'POST',
    });

    return { message, success: true };
  } catch (err) {
    console.error(err);
    return { message, success: false };
  }
}

const log = {
  debug(message: string, ...rest: string[]) {
    const script = process.argv[1]
      .split('/')
      .pop()
      ?.replace(/\.[jt]s/, '') as string;
    const logMessage = `[${script}] ${message}`;
    transport('debug', logMessage, rest).then(() => console.debug(logMessage, ...rest));
  },
  error(message: string, ...rest: string[]) {
    const script = process.argv[1]
      .split('/')
      .pop()
      ?.replace(/\.[jt]s/, '') as string;
    const logMessage = `[${script}] ${message}`;
    transport('error', logMessage, rest).then(() => console.error(logMessage, ...rest));
  },
  info(message: string, ...rest: string[]) {
    const script = process.argv[1]
      .split('/')
      .pop()
      ?.replace(/\.[jt]s/, '') as string;
    const logMessage = `[${script}] ${message}`;
    transport('info', logMessage, rest).then(() => console.info(logMessage, ...rest));
  },
  warn(message: string, ...rest: string[]) {
    const script = process.argv[1]
      .split('/')
      .pop()
      ?.replace(/\.[jt]s/, '') as string;
    const logMessage = `[${script}] ${message}`;
    transport('warn', logMessage, rest).then(() => console.warn(logMessage, ...rest));
  },
};

const payload = process.argv[2];

export { log, payload };
