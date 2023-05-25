import React, { useMemo } from 'react'
import { Dropdown, Menu, message } from 'antd';

import Button from './button'

import css from './index.less'

interface SaveButtonProps {
  disabled?: boolean
  loading?: boolean
  onClick: (p: any) => void
  envList: { type: string, label: string }[]
}

export default ({
  disabled = false,
  loading = false,
  onClick,
  envList = []
}: SaveButtonProps) => {
  const menu = useMemo(() => {
		return (
			<Menu>
        {
          envList?.map(env => {
            return (
              <Menu.Item 
                disabled={disabled}
                onClick={() => {
                  onClick ? onClick(env.type) : null
                }}>
                <p>{env.label}</p>
              </Menu.Item>
            )
          })
        }
			</Menu>
		);
	}, []);

  return (
    <>
      <Dropdown 
        overlay={menu} 
        trigger={['click']} 
        placement="bottomRight"
      >
        <Button
          disabled={disabled}
          loading={loading}
        >
          <div className={css.publishBtn}>
            发布
            <svg
              viewBox="32 32 960 960"
              focusable="false"
              width="1em"
              height="1em"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M512 651.43c11.3 0 22.19-4.48 30.17-12.5l193.49-193.49a42.62 42.62 0 10-60.33-60.33L512 548.44 348.63 385.1a42.62 42.62 0 10-60.29 60.33l193.5 193.5a42.5 42.5 0 0030.16 12.5"
              ></path>
            </svg>
          </div>
        </Button>
      </Dropdown>
    </>
  );
}
