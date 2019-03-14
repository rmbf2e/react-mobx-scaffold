import { UserStore } from 'store/interface'
import { Button, Table } from 'antd'
import { propertyOf } from 'lodash'
import { computed, toJS } from 'mobx'
import React from 'react'
import { inject, observer } from 'mobx-react'
import { ConfirmButton } from 'component/ConfirmButton'
import { GENDER_MAP } from 'src/constant'

interface IProp {
  store?: {
    user: UserStore
  }
}

@inject('store')
@observer
class List extends React.Component<IProp> {
  private store: UserStore

  constructor(props: IProp) {
    super(props)
    const { user } = this.props.store!
    this.store = user
  }

  componentWillUnmount() {
    this.store.restoreList()
  }

  @computed
  get columns() {
    return [
      {
        title: '帐号',
        dataIndex: 'account',
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '性别',
        dataIndex: 'gender',
        render: propertyOf(GENDER_MAP),
      },
      {
        title: '邮箱',
        dataIndex: 'mail',
      },
      {
        title: '手机',
        dataIndex: 'mobile',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text: string, record: any, index: number) => (
          <>
            <Button size="small" data-index={index} onClick={this.onEdit}>
              编辑
            </Button>
            <ConfirmButton
              type="danger"
              data-id={record.id}
              onConfirm={this.destroy}
              size="small"
            >
              删除
            </ConfirmButton>
          </>
        ),
      },
    ]
  }

  destroy = (e: React.MouseEvent) => {
    this.store.destroyRecord({
      body: [(e.target as HTMLButtonElement).dataset.id],
    })
  }

  onEdit = (e: React.MouseEvent) => {
    const index = Number((e.target as HTMLButtonElement).dataset.index!)
    const dataSource = this.store.list.tableProps.dataSource!
    const data = dataSource[index]
    this.store.list.tableProps.dataSource
    this.store.setRecord(data)
    this.store.showFormModal()
  }

  render() {
    const { list } = this.store
    const tableProps = toJS(list.tableProps)
    return <Table columns={this.columns} {...tableProps} />
  }
}
export default List
