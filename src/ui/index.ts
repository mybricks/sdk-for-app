import View from './view'
import Toolbar from './toolbar'
import Locker from './locker'
import { openFilePanel } from './openFilePanel/openPanel'
import pkg from '../../package.json'

console.log(`%c ${pkg.name} %c@${pkg.version}`, "color:#FFF;background:#fa6400", "", "")

export {
  View, Toolbar, openFilePanel,Locker
}