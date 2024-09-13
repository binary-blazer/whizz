import get from "./functions/get.js";
import post from "./functions/post.js";
import put from "./functions/put.js";
import { delete_, del } from "./functions/delete.js";
import patch from "./functions/patch.js";
import head from "./functions/head.js";
import options from "./functions/options.js";
import trace from "./functions/trace.js";
import connect from "./functions/connect.js";

export {
  get,
  post,
  put,
  delete_ as delete,
  del,
  patch,
  head,
  options,
  trace,
  connect,
};
