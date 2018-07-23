import React from 'react'
import PropTypes from 'prop-types'
import { toJS } from 'mobx'
import { inject, observer } from 'mobx-react'
import { Modal, Spin, Card } from 'antd'
import Tree from 'component/Tree'

@inject('store')
@observer
export default class Category extends React.Component {
  static propTypes = {
    store: PropTypes.shape({
      user: PropTypes.shape({
        formModal: PropTypes.bool,
      }),
    }).isRequired,
  }

  submit = () => {
    const {
      store: { user },
    } = this.props
    const keys = toJS(user.checkedCategoryKeys)
    return user
      .updateCategory(
        {
          dataResType: user.currentType,
          dataResourceId: keys,
        },
        { userId: user.user.userId },
      )
      .finally(() => {
        user.hideCategoryModal()
      })
  }

  render() {
    const {
      store: { user },
    } = this.props
    const checkedKeys = toJS(user.checkedCategoryKeys)
    const data = toJS(user.category)
    return (
      <Modal
        visible={user.categoryModal}
        onCancel={user.hideCategory}
        destroyOnClose
        title={`配置用户数据资源 姓名: ${user.user.name} / 帐号: ${
          user.user.erp
        }`}
        onOk={this.submit}
      >
        <Spin spinning={user.fetchingCategory}>
          <Card>
            <Tree
              onCheck={user.setCheckedCategoryKeys}
              checkedKeys={checkedKeys}
              data={data}
            />
          </Card>
        </Spin>
      </Modal>
    )
  }
}
