import PropTypes from 'prop-types'
import { Switch } from 'antd'
import React from 'react'
import { inject, observer } from 'mobx-react'
import defaultTheme from 'style/default.theme.less'
import darkTheme from 'style/dark.theme.less'

@inject('store')
@observer
class Theme extends React.Component {
  static propTypes = {
    store: PropTypes.shape({
      lang: PropTypes.object,
    }).isRequired,
  }

  toggleTheme = use => {
    if (use) {
      defaultTheme.use()
      darkTheme.unuse()
    } else {
      darkTheme.use()
      defaultTheme.unuse()
    }
  }

  render() {
    const {
      store: {
        locale: { lang },
      },
    } = this.props
    return (
      <Switch
        checkedChildren={lang.Theme.turnOn}
        unCheckedChildren={lang.Theme.turnOff}
        defaultChecked
        onChange={this.toggleTheme}
      />
    )
  }
}

export default Theme
