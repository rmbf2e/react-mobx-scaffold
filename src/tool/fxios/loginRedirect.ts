import appConfig from 'src/config'

/**
 * 执行跳转到登录页面的行为
 * 将该功能独立出来是因为在jest测试环境中location.href为只读，
 * 需要独立模块可mock用
 * */
export const loginRedirect = () => {
  location.href = `${appConfig.loginHost}?ReturnUrl=${encodeURIComponent(
    location.href,
  )}`
}
