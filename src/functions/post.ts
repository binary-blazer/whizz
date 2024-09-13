import http from "../core/getHTTP";
import https from "../core/getHTTPS";
import protocol from "../handlers/protocol.js";

interface RequestOptions {
  secureProtocol?: string;
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

export default async function post(
  url: string,
  data: any,
  {
    secure = true,
    secureProtocol = "TLSv1_2_method",
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
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(String(data)),
        },
        ...options,
      },
      (res) => {
        let responseData = "";
        res.on("data", (chunk) => {
          responseData += chunk;
        });
        res.on("end", () => {
          resolve({
            data: responseData,
            statusCode: res.statusCode || 0,
            headers: res.headers,
            json: () => ({
              data: JSON.parse(responseData),
              statusCode: res.statusCode || 0,
              headers: res.headers,
            }),
            text: () => responseData,
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
