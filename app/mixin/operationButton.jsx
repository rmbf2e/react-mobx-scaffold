import React from 'react'
import { Button } from 'antd'

// Role与User组件共享按钮，依据角色或用户类型显示
const operationButton = (self, text, record, index) => [
  <Button
    type="primary"
    key="jdCategory"
    data-index={index}
    data-type={1}
    onClick={self.showCategory}
  >
    配置自营品类
  </Button>,
  <Button
    type="primary"
    key="jdBrand"
    data-index={index}
    data-type={2}
    onClick={self.showBrand}
  >
    配置自营品牌
  </Button>,
  <Button
    type="primary"
    key="7freshCategory"
    data-index={index}
    data-type={7}
    onClick={self.showCategory}
  >
    配置7fresh品类
  </Button>,
  <Button
    type="primary"
    key="7freshBrand"
    data-index={index}
    data-type={8}
    onClick={self.showBrand}
  >
    配置7fresh品牌
  </Button>,
]

export default operationButton
