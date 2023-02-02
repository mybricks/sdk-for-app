import css from './css.less'
import {useMemo} from "react";
import init from "../../api/init";

export default function View({children}) {
  useMemo(()=>{
    init()
  },[])

  return (
    <div className={css.view}>
      {children}
    </div>
  )
}