import { Select } from 'antd'
import { OptionProps, SelectProps } from 'antd/lib/select'
import React from 'react'
import { filterOption } from 'tool/filterOption'

interface IItem extends OptionProps {
  label: string
}

interface IProps extends SelectProps {
  options: IItem[]
  showSearch: boolean
}

const { Option } = Select

// const getPopupContainer = trigger => trigger.parentNode
/**
 * Select/Option的简化组件，只传label/value对象组成的数组即可
 * */
export class SelectOption extends React.PureComponent<IProps> {
  public static defaultProps = {
    showSearch: false,
  }

  public render() {
    const { options, showSearch, ...props } = this.props
    return (
      <Select
        {...props}
        filterOption={showSearch ? filterOption : false}
        showSearch={!!showSearch}
      >
        {options.map((item: IItem) => (
          <Option key={String(item.value)} value={item.value}>
            {item.label}
          </Option>
        ))}
      </Select>
    )
  }
}
