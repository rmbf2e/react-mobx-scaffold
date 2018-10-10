import React from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'

// const getPopupContainer = trigger => trigger.parentNode
/**
 * Select/Option的简化组件，只传label/value对象组成的数组即可
 * */
class SelectOption extends React.PureComponent {
  static propTypes = {
    options: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string,
      }),
    ).isRequired,
  }

  render() {
    const { options, ...props } = this.props
    return (
      <Select {...props}>
        {options.map(item => (
          <Select.Option key={item.value} value={item.value}>
            {item.label}
          </Select.Option>
        ))}
      </Select>
    )
  }
}

export default SelectOption
