import toMap from 'util/toMap'

export const CATEGORY_TYPE = [
  {
    label: '自营品类',
    value: 1,
  },
  {
    label: '自营品牌',
    value: 2,
  },
  {
    label: '7fresh品类',
    value: 7,
  },
  {
    label: '7fresh品牌',
    value: 8,
  },
]

export const CATEGORY_TYPE_MAP = toMap(CATEGORY_TYPE)

// 只针对品策
// 对应值中的数字代表数组
// [0: 自营品类，1: 自营品牌，2: 7fresh品类，3: 7fresh品牌]
export const ROLE_TYPE_BUTTONS = {
  C001: [], // 自营超管
  C002: [], // 自营采销
  C003: [0, 1], // 自营商家
  C004: [], // 7fresh超管
  C005: [], // 7fresh采销
  C006: [0], // 自营品类管理员
  C008: [1], // 自营品牌管理员
  C009: [2], // 7fresh品类管理员
  C010: [3], // 7fresh品牌管理员
}

export const ROLE_STATUS = [
  { label: '启用', value: '1' },
  { label: '停用', value: '0' },
]
export const USER_STATUS = ROLE_STATUS
export const RESOURCE_STATUS = ROLE_STATUS

export const ROLE_STATUS_MAP = toMap(ROLE_STATUS)
export const USER_STATUS_MAP = ROLE_STATUS_MAP
export const RESOURCE_STATUS_MAP = ROLE_STATUS_MAP

// sso就是京东erp用户
// passport就是京东passport用户
// 7fresh就是7fresh的erp用户
// export const userTypes = [
//   {
//     value: 'sso',
//   },
//   { value: 'passport' },
//   { value: '7fresh' },
// ];

export const RESOURCE_TYPE = [
  { value: '2', label: '菜单' },
  { value: '3', label: '按钮' },
  { value: '4', label: '请求' },
  { value: '5', label: '菜单组' },
  { value: '9', label: '其它' },
]
export const RESOURCE_TYPE_MAP = toMap(RESOURCE_TYPE)

export const GENDER = [{ value: '1', label: '男' }, { value: '2', label: '女' }]
export const GENDER_MAP = toMap(GENDER)

export const DICT_ITEM_STATUS = [
  {
    label: '可见',
    value: '1',
  },
  {
    label: '不可见',
    value: '0',
  },
]

export const DICT_ITEM_STATUS_MAP = toMap(DICT_ITEM_STATUS)
