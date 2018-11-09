import less from 'less'

// const chroma = require('chroma-js')

// 从源码里找的，没有api
// eslint-disable-next-line
const funcs = less.functions.functionRegistry._data

const headerBg = '#EEE'

const darken = number =>
  funcs
    .darken(new less.tree.Color(headerBg.slice(1)), { value: number })
    .toRGB()
// const lighten = number =>
//   funcs
//     .lighten(new less.tree.Color(headerBg.slice(1)), { value: number })
//     .toRGB()

// console.log(darken(30))
// console.log(lighten(30))

// const darktheme = (() => {
//   // 主背景色
//   const bodyBg = '#282828'
//   const brightenBg = chroma(bodyBg).brighten(1)
//   const brightenBorder = chroma(bodyBg).brighten(1)

//   // 主文字色
//   const text = '#fff'

//   // 主按钮色，金色
//   const primaryBg = '#debb6b'
//   return {
//     'layout-header-background': brightenBg,
//     'layout-header-padding': '0 2em',
//     'layout-header-height': '64px',
//     // 'layout-trigger-background': darken(40),
//     'layout-body-background': 'transparent',
//     // 'layout-trigger-color': lighten(20),
//     // 'menu-bg': headerBg,
//     // 'layout-header-height': '46px + 1rem',
//     // 'icon-url': '~"/asset/font/iconfont"',
//     'menu-collapsed-width': '50px',

//     'body-background': bodyBg,
//     'font-size-base': '12px',
//     'text-color': text,
//     'text-color-secondary': text,
//     'primary-color': primaryBg,
//     'label-color': text,
//     'component-background': bodyBg,
//     'card-head-background': bodyBg,
//     'input-bg': bodyBg,
//     'input-color': text,
//     'btn-default-color': primaryBg,
//     'btn-default-border': primaryBg,
//     'btn-default-bg': 'transparent',

//     'btn-primary-bg': primaryBg,
//     'btn-primary-color': text,
//     'btn-disable-bg': brightenBg,
//     'breadcrumb-base-color': '#ccc',
//     'popover-bg': brightenBg,
//     'table-row-hover-bg': brightenBg,
//     'table-header-bg': brightenBg,
//     'table-padding-vertical': '8px',
//     'table-padding-horizontal': '8px',
//     'table-selected-row-bg': brightenBg,
//     'table-expanded-row-bg': brightenBg,
//     'heading-color': '#ccc',
//     'border-color-split': brightenBorder,
//     'disabled-color': chroma(text).darken(2),
//     'item-hover-bg': brightenBg,
//     'item-active-bg': brightenBg,
//     'tag-default-bg': brightenBg,
//     'background-color-light': brightenBg,
//     'error-color': 'red',
//     'menu-bg': brightenBg,
//     'menu-width': '19em',
//     // 'menu-collapsed-width': '0',

//     // 分页按钮激活状态的字色
//     // button hover时候的color和border-color
//     'primary-5': primaryBg,

//     // 于偲鸿修改
//     'background-color-base': brightenBg,
//     'input-disabled-bg': bodyBg,

//     'radio-button-bg': 'none',
//     'radio-button-hover-color': primaryBg,
//   }
// })()

export default () => {
  const theme = {
    'layout-header-background': headerBg,
    'layout-header-padding': '0 2em',
    'layout-header-height': '64px',
    'layout-trigger-background': darken(40),
    'layout-body-background': 'transparent',
    'menu-bg': headerBg,
  }

  return theme
}
