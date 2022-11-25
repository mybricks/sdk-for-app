import {forwardRef, Fragment, ReactElement, useMemo} from "react";

import css from './View.less'

/**
 * 前端全局拦截，注入相关能力
 * @param props
 * @param ref
 * @constructor
 */
export function View(props, ref) {
  const {children} = props
  useMemo(() => {
    ref({
      user: {},
      fileId: {},
      getFileContent() {
///TODO
      }, save() {
////TODO
      }
    })
  }, [])

  return (
    <div className={css.view}>
      {children}
    </div>
  )
}

export default forwardRef(View)