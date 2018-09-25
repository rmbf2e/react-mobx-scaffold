import React from 'react'
import { toJS } from 'mobx'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import { Button, Card, Modal } from 'antd'
import AnimateTable from 'share/component/AnimateTable'
import FormModal from './Form'

@inject('store')
@observer
class Site extends React.Component {
  static propTypes = {
    store: PropTypes.shape({
      site: PropTypes.shape({
        fetchSites: PropTypes.func,
        sites: PropTypes.shape({
          dataSource: PropTypes.array,
          pagination: PropTypes.object,
        }),
        on: PropTypes.func,
        removeListener: PropTypes.func,
        showFormModal: PropTypes.func,
      }),
    }).isRequired,
  }

  constructor(props) {
    super(props)
    const {
      store: { site },
    } = this.props
    this.store = site
  }

  componentDidMount() {
    // 该页面没有搜索表单，所以手动获取一下列表
    this.search()
  }

  onEdit = e => {
    const { index } = e.target.dataset
    const site = this.store
    const data = toJS(site.sites.tableProps.dataSource)[index]
    site.setSite({ data })
    site.showFormModal()
  }

  get columns() {
    return [
      {
        title: '名称',
        key: 'name',
        dataIndex: 'name',
      },
      {
        title: '全称',
        key: 'fullName',
        dataIndex: 'fullName',
      },
      {
        title: '操作',
        key: 'operation',
        render: (_, record, index) => (
          <Button size="small" data-index={index} onClick={this.onEdit}>
            编辑
          </Button>
        ),
      },
    ]
  }

  search = () => {
    this.store.fetchSites()
  }

  showDestroyConfirm = () => {
    const {
      store: { site },
    } = this.props
    const modal = Modal.confirm({
      title: '确认删除选中的站点？',
      confirmLoading: site.destroyingSite,
      onOk: () => {
        site.destroySite(toJS(site.sites.checkedKeys))
        modal.destroy()
      },
      onCancel: () => {
        modal.destroy()
      },
    })
  }

  render() {
    const site = this.store
    const tableProps = toJS(site.sites.tableProps)
    return (
      <Card
        title={(
          <Button.Group>
            <Button type="primary" onClick={site.showFormModal}>
              新增
            </Button>
            <Button
              onClick={this.showDestroyConfirm}
              disabled={!site.sites.hasCheckedKeys}
              type="danger"
            >
              删除
            </Button>
          </Button.Group>
)}
      >
        <AnimateTable columns={this.columns} {...tableProps} />
        <FormModal />
      </Card>
    )
  }
}
export default Site
