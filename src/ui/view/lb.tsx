import css from './css.less'
import {forwardRef, ForwardRefRenderFunction, useImperativeHandle, useLayoutEffect, useMemo, useState} from "react";

type T_Props = {
  onLoad: (props: {
    fileId: string;
    user: {
      id: string;
      name: string;
    }
  }) => {}
}

export default function View({onLoad, children}: T_Props) {
  const [jsx, setJSX] = useState('加载中..')
  useLayoutEffect(() => {
    setJSX(onLoad({
      user: {id: 'TODO', name: 'TODO'},
      get fileId() {
        return 'TODO';
      }
    }) as any)
  }, [])

  return (
    <div className={css.view}>
      {jsx}
    </div>
  )
}