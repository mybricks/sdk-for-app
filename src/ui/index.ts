import View from './view'
import Loading from './loading'
import Toolbar from './toolbar'
import Locker from './locker'
import { openFilePanel } from './filePanel'
import PreviewStorage from './view/previewStorage'
import DocHelper from './docHelper/index';

import * as antd from "antd";
import * as icons from "@ant-design/icons";
if (!window.antd) {
  window.antd = antd
}
if (!window.icons) {
  window.icons = icons;
}
if (!window.MyBricks_antd) {
  window.MyBricks_antd = antd;
}
if (!window.MyBricks_icons) {
  window.MyBricks_icons = icons;
}

export {
  View,
  Loading,
  Toolbar, 
  openFilePanel,
  Locker,
  PreviewStorage,
  DocHelper
}