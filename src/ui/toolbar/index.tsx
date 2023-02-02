import css from './css.less'
import {GoBack} from "../Icons";
import React from "react";

export default function ({title, btns}: { title: string, btns }) {
  return (
    <div className={css.toolbar}>
      <div className={css.left}>
        <div className={css.back} onClick={() => window.history.back()}>
          {GoBack}
        </div>
      </div>
      <div className={css.right}>
        {btns}
      </div>
    </div>
  )
}