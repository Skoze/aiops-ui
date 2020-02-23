import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import uuid from 'uuid';

export interface IAxiosData {
  [key: string]: any;
}


const ERROR_CODE = 400;
const SUCCESS_CODE = 200;
const BASE_URL = '/aiops';
const PROXY = process.env.NODE_ENV === 'production' ? (false) : ({
  host: 'http://0.0.0.0',
  port: 8080,
});

interface IResponse {
  data: {
    code: 400 | 200;
    msg: string;
    data: any;
  };
}

const clientConfig: AxiosRequestConfig = {
  baseURL: BASE_URL,
  proxy: PROXY,
  timeout: 100000,
  withCredentials: true,
  headers: {'x-trace-id': uuid()},
};

function responseHandler(res: AxiosResponse & IResponse) {
  if (res.status === 200) {
    const { code, data, message: msg } = res.data;

    if (SUCCESS_CODE === code) {
      // 对于特殊操作只有 code 和 message
      return data || res;
    }

    if (ERROR_CODE === code || code === 403) {
      const error = {
        code,
        message: msg,
      };
      return Promise.reject(error);
    }
  }
  return res;
}

function errorHandler(err: AxiosError) {
  const error = {
    code: err.response?.status,
    message: err.response?.statusText,
  };

  return Promise.reject(error);
}

export type IResponseData<T> = {
  code: number;
  message: string;
} & T;

class Client {
  private client: AxiosInstance;

  constructor() {
    const axiosClient = axios.create(clientConfig);
    axiosClient.interceptors.response.use(responseHandler, errorHandler);
    this.client = axiosClient;
  }

  get(url: string, params = {}) {
    const options: AxiosRequestConfig = { method: 'get', url, params};

    return this.request(options) as unknown as Promise<IResponseData<any>>;
  }

  post(url: string, data: IAxiosData = {}, type = 'json') {
    const options: AxiosRequestConfig = { method: 'post', url };

    if (type === 'json') {
      options.data = data;
    }

    if (type === 'form') {
      const formData: FormData = new FormData();
      const keys = Object.keys(data);
      options.headers = {};
      options.headers['Content-Type'] = 'multipart/form-data';

      keys.forEach((key) => {
        formData.append(key, data[key]);
      });

      options.data = formData;
    }

    return this.request(options) as unknown as Promise<IResponseData<any>>;
  }

  put(url: string, data: IAxiosData = {}, type = 'json') {
    const options: AxiosRequestConfig = { method: 'put', url};

    if (type === 'json') {
      options.data = data;
    }

    if (type === 'form') {
      const formData: FormData = new FormData();
      const keys = Object.keys(data);
      options.headers = {};
      options.headers['Content-Type'] = 'multipart/form-data';

      keys.forEach((key) => {
        formData.append(key, data[key]);
      });

      options.data = formData;
    }

    return this.request(options) as unknown as Promise<IResponseData<any>>;
  }

  delete(url: string) {
    const options: AxiosRequestConfig = { method: 'delete', url};

    return this.request(options) as unknown as Promise<IResponseData<any>>;
  }

  request(options: AxiosRequestConfig) {
    return this.client.request(options).catch((err: AxiosError) => {
      if (err && err.message) {
        alert(err.message);
      }
      console.error(err);
      throw err;
    }) as unknown as Promise<IResponseData<any>>;
  }
}

export default new Client();
