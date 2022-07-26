import { createLogger, format, transports } from "winston";
const { combine, timestamp, printf } = format;

const myFormat = printf(({ message, timestamp }) => {
  return `[${timestamp}]: ${message}`;
});

const logger = createLogger({
  level: "info",
  format: format.json(),
  transports: [
    new transports.File({
      filename: "logs/info.log",
      maxsize: 1024 * 1000,
      format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), myFormat),
    }),
    new transports.Console({
      format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), myFormat),
    }),
  ],
});

export default logger;
