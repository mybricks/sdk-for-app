import React from 'react';
import { notification } from "antd";
import css from "./index.less";

const initialLockPrompt = (params) => {
  const { type, onClose } = params;
  const key = `open${Date.now()}`

  if (!type || type === "spa") {
    notification.open({
      key,
      className: "fangzhou-theme",
      top: 45,
      style: {
        marginRight: -8
      },
      message: (<h2 className={css.h2}>请注意</h2>),
      description: (
        <div className={css.notification}>
          <div>当前应用未上锁</div>
          <div className={css.name}>
            - 如果需要编辑保存内容
            <span className={css.reason}>请点击右上角头像上锁</span>
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
        marginRight: -8
      },
      message: (<h2 className={css.h2}>请注意</h2>),
      description: (
        <div className={css.notification}>
          <div>当前没有应用和画布区块的编辑权限</div>
          <div className={css.name}>
            - 应用配置编辑
            <span className={css.reason}>请点击右上角头像上锁</span>
          </div>
          <div className={css.name}>
            - 画布区块编辑
            <span className={css.reason}>请点击左上角画布和区块申请权限</span>
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