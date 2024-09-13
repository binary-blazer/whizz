import http from "../core/getHTTP";
import https from "../core/getHTTPS";
import protocol from "../handlers/protocol.js";

interface RequestOptions {
  secure?: boolean;
  secureProtocol?: 'TLSv1' | 'TLSv1.1' | 'TLSv1.2' | 'TLSv1.3';
  timeout?: number;
  [key: string]: any;
}

interface Response {
  data: string;
  statusCode: number;
  headers: http.IncomingHttpHeaders;
  json: () => any;
  text: () => string;
}

export default async function options(
  url: string,
  {
    secure = true,
    secureProtocol = "TLSv1.2",
    timeout = 5000,
    ...options
  }: RequestOptions = {},
): Promise<Response> {
  return new Promise((resolve, reject) => {
    const transportProtocol = secure ? https : http;
    url = protocol(url, secure);

    if (secure) {
      options.secureProtocol = secureProtocol;
    }

    const req = transportProtocol.request(
      url,
      {
        method: "OPTIONS",
        ...options,
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          resolve({
            data,
            statusCode: res.statusCode || 0,
            headers: res.headers,
            json: () => ({
              data: JSON.parse(data),
              statusCode: res.statusCode || 0,
              headers: res.headers,
            }),
            text: () => data,
          });
        });
      },
    );

    req.on("error", (e) => {
      reject(e);
    });

    req.setTimeout(timeout, () => {
      req.destroy();
      reject(new Error("Request timed out"));
    });

    req.end();
  });
}
