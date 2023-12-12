import React, { useState } from 'react';
import { Popover, Modal, Divider } from 'antd';
import { FileIcon, keyIcon, optIcon } from './Icons';
import { infoList, optList } from './constants';
import css from './index.less'

interface TipsProps {
  docLink?: string
  opt?: Opt[];
  info?: Opt[];
}

interface Opt {
  name?: string,
  keys?: any[];
}

export default ({ 
  docLink = 'https://docs.qingque.cn/f/eZQC4aflzXiNHfZaZrwRwqtpF?identityId=20b8F4mmCiS',
  opt = optList,
  info = infoList
}: TipsProps) => {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const infoListRender = ((list)=>{
    return (
      <div className={css.infoItem}>
        {list.map((item)=>{
          return(
            <div className={css.itemList}>
              <div className={css.itemListLeft}>
                {item.name}
              </div>
              <div className={css.itemListRight}>
                {item.keys.map((key)=>{
                  if(key!=='/'){
                    return (<div className={css.liBtn}>{key}</div>)
                  }else{
                    return (<div>{key}</div>)
                  }
                })}
              </div>
            </div>
          )
        })}
      </div>
      
    )
  })
  
  const optListRender = ((list)=>{
    return (
      <div className={css.optItem}>
        {list.map((item)=>{
          return(
            <div className={css.itemList}>
              <div className={css.itemListLeft}>
                {item.name}
              </div>
              <div className={css.itemListRight}>
                {item.keys.map((key)=>{
                  return (<div className={css.liOpt}>{key}</div>)
                  })}
              </div>
            </div>
          )
        })}
      </div>
    )
  })


  return (
    <div>
      <div className={css.tipsPosition}>
        <div onClick={()=>{setIsInfoModalOpen(true)}} className={css.item}>
          <Popover
            placement='bottom'
            overlayClassName={css.overlayFilePopover}
            content={()=>{
              return (
                <div className={css.fileInfo}>
                  快捷键和常规操作
                </div>
              )
            }}>
            <div className={css.filePosition}>
              {keyIcon}
            </div>
          </Popover>
        </div>

        <div onClick={()=>{window.open(docLink)}} className={css.item}>
          <Popover
            placement='bottom'
            overlayClassName={css.overlayFilePopover}
            content={()=>{
              return (
                <div className={css.fileInfo}>
                  帮助文档
                </div>
              )
            }}
          >
            <div className={css.filePosition}>
              {FileIcon}
            </div>
          </Popover>
        </div>
        <Divider type="vertical" />
      </div>

      {/* 快捷键 */}
      <Modal
        visible={isInfoModalOpen}
        title={'快捷键和常规操作'}
        footer={null}
        onCancel={() => setIsInfoModalOpen(false)}
        width={1060}
      >
        <div className={css.itemContent}>
          {infoListRender(info)}
          <Divider type="vertical" style={{height: 'inherit'}}/>
          {optListRender(opt)}
        </div>
      </Modal>
    </div>
  )
}