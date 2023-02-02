import {isEnvOfBrowser, isEnvOfDev} from "../env";
import {initForBrowser} from "../initForBrowser";

export default function init() {
  if (isEnvOfDev()) {
    if (isEnvOfBrowser()) {
      initForBrowser({
        fileId: '-mock-'
      })
    }
  }
}