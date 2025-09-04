import React from 'react';
import { notification } from "antd";
import css from "./index.less";
import {locker_header,locker_desc} from '../icons/index'

const initialLockPrompt = (params) => {
  const { type, onClose } = params;
  const key = `open${Date.now()}`

  if (!type || type === "spa") {
    notification.open({
      key,
      className: "fangzhou-theme",
      top: 45,
      style: {
        marginRight: 0,
        paddingTop: 10,
        paddingBottom: 18,
        paddingLeft: 24,
        paddingRight: 19,
        borderRadius: 12,
      },
      message: "",
      description: (
        <div className={css.notification}>
          <div className={css.title}>需要上锁才能保存</div>
          <div className={css.item}>
            <div className={css.name}>应用未上锁</div>
            <div className={css.reason}>请点击右上角头像上锁</div>
          </div>
        </div>
      ),
      duration: null,
      onClose
    });
  } else {
    notification.open({
      key,
      className: "fangzhou-theme",
      top: 45,
      style: {
        marginRight: 0,
        paddingTop: 10,
        paddingBottom: 13,
        paddingLeft: 24,
        paddingRight: 19,
        borderRadius: 12,
      },
      message: "",
      description: (
        <div className={css.notification}>
          <div className={css.title}>需要上锁才能保存</div>
          <div className={css.item}>
            <div className={css.name}>应用配置</div>
            <div className={css.reason}>点击上方头像
              <img src={locker_header} style={{height:"18px",width:"19px",margin:"0 4px"}} alt="" />
             上锁</div>
          </div>

          <div className={css.item} style={{alignItems: 'start'}}>
            <div className={css.name}>画布区块</div>
            <div className={css.reason} style={{alignItems: 'start'}}>点击左侧画布和区块菜单
              <img src={locker_desc} alt="锁图标" style={{width: '100px', height: 'auto', verticalAlign: 'middle', margin: '0 4px'}} />
              上锁</div>
          </div>
        </div>
      ),
      duration: null,
      onClose
    });
  }

  return key;
}

export {
  initialLockPrompt
}