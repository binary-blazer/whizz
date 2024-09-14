import http from "../core/getHTTP";
import https from "../core/getHTTPS";
import protocol from "../handlers/protocol.js";

interface RequestOptions {
  secure?: boolean;
  timeout?: number;
  [key: string]: any;
}

interface Response {
  data: any;
  request: {
    headers: any;
    statusCode: number;
    ok: boolean;
  };
  statusCode: number;
  ok: boolean;
}

export default async function connect(
  url: string,
  {
    secure = true,
    timeout = 5000,
    ...options
  }: RequestOptions = {},
): Promise<Response> {
  return new Promise((resolve, reject) => {
    const transportProtocol = secure ? https : http;
    url = protocol(url, secure);

    const req = transportProtocol.request(
      url,
      {
        method: "CONNECT",
        ...options,
      },
      (res) => {
        let data: any[] = [];
        res.on("data", (chunk) => {
          data.push(chunk);
        });
        res.on("end", () => {
          const buffer = Buffer.concat(data);
          const contentType = res.headers['content-type'] || '';

          let parsedData: any;
          if (contentType.includes('application/json')) {
            try {
              parsedData = JSON.parse(buffer.toString());
            } catch (e) {
              parsedData = buffer.toString();
            }
          } else if (contentType.includes('text/')) {
            parsedData = buffer.toString();
          } else {
            parsedData = buffer;
          }

          resolve({
            data: parsedData,
            request: {
              headers: res.headers,
              statusCode: res.statusCode || 0,
              ok: (res.statusCode ? (res.statusCode >= 200 && res.statusCode < 300) : false) ? true : false,
            },
            statusCode: res.statusCode || 0,
            ok: (res.statusCode ? (res.statusCode >= 200 && res.statusCode < 300) : false) ? true : false,
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