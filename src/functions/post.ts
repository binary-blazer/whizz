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

export default async function post(
  url: string,
  data: any,
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
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(String(data)),
        },
        ...options,
      },
      (res) => {
        let responseData: any[] = [];
        res.on("data", (chunk) => {
          responseData.push(chunk);
        });
        res.on("end", () => {
          const buffer = Buffer.concat(responseData);
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

    req.write(data);
    req.end();
  });
}