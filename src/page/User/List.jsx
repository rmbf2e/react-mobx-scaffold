import { Button, Table } from 'antd'
import { propertyOf } from 'lodash'
import { computed, toJS } from 'mobx'
import React from 'react'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { ConfirmButton } from 'component/ConfirmButton'
import { GENDER_MAP } from 'src/constant'

@inject('store')
@observer
class List extends React.Component {
  static propTypes = {
    store: PropTypes.shape({
      user: PropTypes.shape({
        list: PropTypes.shape({
          dataSource: PropTypes.array,
          pagination: PropTypes.object,
        }),
        showFormModal: PropTypes.func,
        restoreList: PropTypes.func,
      }),
    }).isRequired,
  }

  constructor(props) {
    super(props)
    const {
      store: { user },
    } = this.props
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
        render: (text, record, index) => (
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

  destroy = e => {
    this.store.destroyRecord({
      body: [e.target.dataset.id],
    })
  }

  onEdit = e => {
    const { index } = e.target.dataset
    const { store } = this
    const data = store.list.tableProps.dataSource[index]
    store.setRecord(data)
    store.showFormModal()
  }

  render() {
    const { list } = this.store
    const tableProps = toJS(list.tableProps)
    // console.log(tableProps)
    return <Table columns={this.columns} {...tableProps} />
    // return null
  }
}
export default List
