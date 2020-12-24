import axios from "axios";

const BASE_URL =
  process.env.REACT_APP_API_URL || "https://api.instantwebtools.net/v1";

const getUri = (suffix: string) => `${BASE_URL}${suffix}`;

export const getTableDataFact = (page: number, size: number) => {
  // /passenger can also be stored seperately in const files.
  const endPoint = getUri("/passenger");
  return axios.get(endPoint, {
    params: {
      page,
      size,
    },
  });
};

export const getXHRErrorMeta = (err: any) => {
  // Messages can be stored in seperate constant files or in internationalization files
  const msg = err && err.message ? err.message : "There is some server issue";
  const statusCode = err && err.statusCode ? err.statusCode : "Unknown";
  return {
    msg,
    statusCode,
  };
};
