import { OptionProps } from 'antd/lib/select'
import React from 'react'

export const filterOption = (
  inputValue: string,
  option: React.ReactElement<OptionProps>,
) =>
  option.props.children &&
  (option.props.children as string).includes(inputValue)
