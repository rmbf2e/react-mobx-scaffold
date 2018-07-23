import less from 'less'

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

export default () => {
  const theme = {
    'layout-header-background': headerBg,
    'layout-header-padding': '0 2em',
    'layout-header-height': '64px',
    'layout-trigger-background': darken(40),
    'layout-body-background': 'transparent',
    // 'layout-trigger-color': lighten(20),
    'menu-bg': headerBg,
    // 'layout-header-height': '46px + 1rem',
    'icon-url': '~"/asset/font/iconfont"',
  }

  return theme
}
