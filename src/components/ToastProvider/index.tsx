import { theme } from 'antd';
import React from 'react'
import { Toaster } from 'react-hot-toast'

function ToastProvider() {
  const { token } = theme.useToken();

  return (
    <Toaster
    toastOptions={{
      style: {
        background: token.colorBgContainer,
        color: token.colorTextBase,
        boxShadow: token.boxShadow,
        // border:'.5px solid '
      },
  
    }}
  />
  
  )
}

export default ToastProvider