import toMap from 'util/toMap'

export const ROLE_STATUS = [
  { label: '启用', value: '1' },
  { label: '停用', value: '0' },
]
export const USER_STATUS = ROLE_STATUS

export const ROLE_STATUS_MAP = toMap(ROLE_STATUS)
export const USER_STATUS_MAP = ROLE_STATUS_MAP

export const GENDER = [{ value: '1', label: '男' }, { value: '2', label: '女' }]
export const GENDER_MAP = toMap(GENDER)
