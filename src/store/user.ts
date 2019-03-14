import { IList } from 'extendStore/interface'
import Events from 'events'
import { observe } from 'mobx'
import { user as api } from 'src/api'
import { GENDER } from 'src/constant'
import { extendStore } from 'src/extendStore'
import { queryForm } from 'store/queryForm'
import { FxiosRequestOption } from 'fxios/typings'

const defaultRecord = {
  account: '',
  name: '',
  gender: GENDER[0].value,
  mail: '',
  mobile: '',
}

abstract class AStore extends Events {
  public formModal: boolean
  public showFormModal: () => void
  public hideFormModal: () => void
  public restoreRecord: () => void

  public list: IList
  public fetchList: (v?: any) => Promise<any>
  public restoreList: () => void

  public record: any

  public setRecord: (v: any) => void
  public createRecord: (v: FxiosRequestOption) => Promise<any>
  public updateRecord: (v: FxiosRequestOption) => Promise<any>
  public destroyRecord: (v: FxiosRequestOption) => Promise<any>
}

@extendStore({
  list: [
    {
      name: 'list',
      url: api.list,
      rowKey: 'id',
      rowSelectionKey: 'name',
    },
  ],
  modal: ['form'],
  rest: [
    {
      name: 'record',
      default: defaultRecord,
      create: {
        url: api.create,
      },
      update: {
        url: api.detail,
      },
      fetch: {
        url: api.detail,
      },
      destroy: {
        url: api.list,
      },
    },
  ],
})
export class User extends AStore {}

export const user = new User()

// 关闭modal且将record还原
observe(user, 'formModal', ({ newValue }) => {
  if (!newValue) {
    user.restoreRecord()
  }
})

user.on('record:changed', () => {
  user.fetchList(queryForm.query)
})
