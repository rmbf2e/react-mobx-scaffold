import Enzyme from 'enzyme'
import { configure } from 'mobx'
import Adapter from 'enzyme-adapter-react-16'
import { JSDOM } from 'jsdom'
import 'core-js/shim'
import 'isomorphic-fetch'
import 'localstorage-polyfill'

configure({ enforceActions: 'always' })

const jsdom = new JSDOM('<!doctype html><html><body></body></html>')
const { window } = jsdom
function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .reduce(
      (result, prop) => ({
        ...result,
        [prop]: Object.getOwnPropertyDescriptor(src, prop),
      }),
      {},
    )
  Object.defineProperties(target, props)
}

global.window = window
global.document = window.document
copyProps(window, global)

Enzyme.configure({ adapter: new Adapter() })
