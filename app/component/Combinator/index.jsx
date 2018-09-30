import React from 'react'
import { LocaleProvider } from 'antd'
import PropTypes from 'prop-types'
import { Provider } from 'mobx-react'
import { Router } from 'react-router-dom'

/**
 * 项目最外层组件，从最外层注入项目需要的依赖数据
 * 将组件功能与数据结合在一起，因此叫Combinator
 * store, router的history与locale
 * */
class Combinator extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    store: PropTypes.shape({
      app: PropTypes.object,
    }).isRequired,
    locale: PropTypes.shape({
      locale: PropTypes.string,
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func,
    }).isRequired,
  }

  render() {
    const { children, store, locale, history } = this.props
    return (
      <Provider store={store}>
        <LocaleProvider locale={locale}>
          <Router history={history}>{children}</Router>
        </LocaleProvider>
      </Provider>
    )
  }
}

export default Combinator
