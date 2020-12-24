import axios from 'axios';

const BASE_URL = 'https://api.instantwebtools.net/v1';

export const getTableDataFact = (page: number, size: number) => {
  const endPoint = `${BASE_URL}/passenger`;
  return axios.get(endPoint, {
    params: {
      page,
      size,
    }
  })
};

export const getXHRErrorMeta = (err: any) => {
  const msg = err && err.message ? err.message : 'There is some server issue';
  const statusCode = err && err.statusCode ? err.statusCode : 'Unknown';
  return {
    msg,
    statusCode,
  }
};