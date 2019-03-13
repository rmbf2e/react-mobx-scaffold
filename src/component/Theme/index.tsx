import { Switch } from 'antd'
import { inject, observer } from 'mobx-react'
import React from 'react'
import { LocaleStore } from 'store/interface'
import darkTheme from 'style/dark.theme.less'
import defaultTheme from 'style/default.theme.less'

interface IProp {
  store?: {
    locale: LocaleStore
  }
}

@inject('store')
@observer
export class Theme extends React.Component<IProp> {
  public toggleTheme = (use: boolean) => {
    if (use) {
      defaultTheme.use()
      darkTheme.unuse()
    } else {
      darkTheme.use()
      defaultTheme.unuse()
    }
  }

  public render() {
    const {
      locale: { lang },
    } = this.props.store!
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
