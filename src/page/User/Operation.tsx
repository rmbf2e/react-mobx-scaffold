import { UserStore } from 'store/interface'
import { Button } from 'antd'
import { inject, observer } from 'mobx-react'
import { toJS } from 'mobx'
import React from 'react'
import { CardTitle } from 'component/CardTitle'
import { ConfirmButton } from 'component/ConfirmButton'

interface IProp {
  store?: {
    user: UserStore
  }
}

@inject('store')
@observer
class Operation extends React.Component<IProp> {
  private store: UserStore

  constructor(props: IProp) {
    super(props)
    const { user } = this.props.store!
    this.store = user
  }

  destroy = () => {
    const user = this.store
    user.destroyRecord({ body: toJS(user.list.checkedKeys) })
  }

  render() {
    const user = this.store
    const { list } = user
    return (
      <CardTitle>
        <Button onClick={user.showFormModal}>添加</Button>
        <ConfirmButton
          type="danger"
          disabled={!list.hasCheckedKeys}
          onConfirm={this.destroy}
        >
          删除
        </ConfirmButton>
      </CardTitle>
    )
  }
}

export default Operation
