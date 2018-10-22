import { Menu as AntMenu, Icon } from 'antd'
import React from 'react'
import { mount } from 'enzyme'
import { render, unmountComponentAtNode } from 'react-dom'
import { toJS } from 'mobx'
// import { render, unmountComponentAtNode } from 'react-dom'
import { Router } from 'react-router-dom'
import { Provider } from 'mobx-react'
import Link from 'component/Menu/Link'
import Menu from 'component/Menu'
import menu from 'store/menu'
import router from 'store/router'

const { SubMenu } = AntMenu

const store = {
  router,
  menu,
}

const wrapper = () =>
  mount(
    <Provider store={store}>
      <Menu />
    </Provider>,
  )

describe('Menu', () => {
  beforeEach(() => {
    menu.setMenus([
      {
        name: 'parent1',
        icon: 'usergroup-add',
        children: [
          {
            name: 'child1',
            to: '/child1',
            icon: 'usergroup-add',
          },
        ],
      },
      {
        name: 'parent2',
        children: [
          {
            name: 'child2',
            to: '/child2',
            icon: 'html5',
            children: [
              {
                name: 'child4',
                to: '/child4',
                icon: 'html5',
              },
            ],
          },
        ],
      },
      {
        name: 'parent3',
      },
    ])
    menu.setCurrent({ key: 'child1' })
  })

  afterEach(() => {
    menu.restoreMenus()
  })

  it('挂载之后开始监听history', done => {
    const com = wrapper()
    const text = com.text()
    expect(text.includes('parent1')).toBe(true)
    expect(text.includes('parent2')).toBe(true)
    expect(text).not.toContain('child1')
    expect(toJS(menu.selectedKeys)).toEqual(['/'])
    const submenu = com.find(SubMenu).at(0)
    expect(submenu.prop('onTitleClick')).toBe(undefined)
    router.push('/child2')
    expect(toJS(menu.selectedKeys)).toEqual(['/child2'])
    // const spy = jest.spyOn(com, 'stopSubscribeHistory')
    // expect(spy).not.haveBeenCalled()
    com.unmount()
    // 卸载后不再监听同步menu的selectedKeys
    router.push('/child1')
    expect(toJS(menu.selectedKeys)).toEqual(['/child2'])
    done()
  })

  it('测试点击Link，to与pathname相同则拦截返回false，enzyme的不灵，上真实dom', () => {
    router.push('/')
    const A = () => (
      <Provider store={store}>
        <Router history={router.history}>
          <div>
            <Link to="/path1">path1</Link>
            <Link to="/path2">path2</Link>
          </div>
        </Router>
      </Provider>
    )
    const { document } = global
    const div = document.createElement('div')
    document.body.appendChild(div)
    render(<A />, div)
    const a = document.querySelector('a')
    const spy = jest.spyOn(router.history, 'push')
    expect(router.location.pathname).toEqual('/')
    a.click()
    expect(router.location.pathname).toEqual('/path1')
    expect(spy.mock.calls).toEqual([['/path1']])
    // 多次click，不会再执行history操作
    a.click()
    a.click()
    expect(spy.mock.calls).toEqual([['/path1']])

    unmountComponentAtNode(div)
    document.body.removeChild(div)
  })

  it('should has Icon', () => {
    const com = wrapper()
    let antMenu = com.find(AntMenu).first()

    expect(
      antMenu.props().children[0].props.children[0].props.children.props
        .children[0].props.type,
    ).toBe('usergroup-add')
    expect(
      antMenu.props().children[1].props.children[0].props.children[0].props
        .children.props.children[0].props.type,
    ).toBe('html5')
    menu.setMenus([
      {
        name: 'parent1',
        children: [
          {
            name: 'child1',
            to: '/child1',
          },
        ],
      },
      {
        name: 'parent2',
        children: [
          {
            name: 'child2',
            to: '/child2',
            children: [
              {
                name: 'child4',
                to: '/child4',
              },
            ],
          },
        ],
      },
      {
        name: 'parent3',
      },
    ])
    // menu.setCurrent({ key: 'child1' })
    com.update()
    antMenu = com.find(AntMenu).first()
    expect(
      antMenu.props().children[0].props.children[0].props.children.props
        .children[0],
    ).toBe(null)
    expect(
      antMenu.props().children[1].props.children[0].props.children[0].props
        .children.props.children[0],
    ).toBe(null)
  })
})
