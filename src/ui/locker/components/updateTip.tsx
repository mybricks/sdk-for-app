import React, { ReactNode, useMemo } from 'react';
import css from "./updateTips.less"
import tipsIcon from "./icons/tips"



const updateTip = ({ message, description, showButton = true, onClose, reLoad }) => {

    return <div className={css.card}>
        <div className={css.left_content}>
            <div className={css.title}>
                <div className={css.icon}>{tipsIcon()}</div>
                <div>{message}</div>
            </div>
            <div className={css.description}>
                {description}
            </div>
            {showButton &&
                (<div className={css.bottom_content}>
                    <div className={css.button} onClick={() => {
                        reLoad()
                    }}>立即刷新</div>
                    <div className={css.button_sub} onClick={() => {
                        onClose()
                    }}>关闭页面</div>
                </div>)
            }
        </div>
    </div>
}

export default updateTip