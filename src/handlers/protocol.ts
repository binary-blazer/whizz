import { colors } from "../constants";

export default function protocol(url: string, secure: boolean): string {
  if (secure) {
    if (url.startsWith("http://")) {
      console.log(
        `${colors.warning}HTTP protocol detected in URL but secure is set to true. Defaulting to HTTPS${colors.clear}`,
      );
      return `https://${url.replace("http://", "")}`;
    }
    return url.startsWith("https://") ? url : `https://${url}`;
  } else {
    if (url.startsWith("https://")) {
      console.log(
        `${colors.warning}HTTPS protocol detected in URL but secure is set to false. Defaulting to HTTP${colors.clear}`,
      );
      return `http://${url.replace("https://", "")}`;
    }
    return url.startsWith("http://") ? url : `http://${url}`;
  }
}
