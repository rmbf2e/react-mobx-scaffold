import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import { Alert, Modal, Card, Button, Upload, Row, Col, Form } from 'antd'
import api from 'app/api'
import config from 'app/config'

@Form.create()
@inject('store')
@observer
export default class Import extends React.Component {
  static propTypes = {
    store: PropTypes.shape({
      user: PropTypes.shape({
        importModal: PropTypes.bool,
      }),
    }).isRequired,
    form: PropTypes.shape({
      getFieldDecorator: PropTypes.func,
      setFieldsValue: PropTypes.func,
    }).isRequired,
  }

  beforeUpload = file => {
    this.file = file
    return false
  }

  upload = () => {
    const {
      form,
      store: { user },
    } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        const formData = new global.FormData()
        const { file } = values.file
        formData.append('file', file)
        user.importUsers(formData).finally(() => {
          user.hideImportModal()
        })
      }
    })
  }

  hide = () => {
    const {
      store: { user },
    } = this.props
    user.hideImportModal()
  }

  render() {
    const {
      store: { user },
      form: { getFieldDecorator },
    } = this.props
    return (
      <Modal
        visible={user.importModal}
        onCancel={this.hide}
        onOk={this.upload}
        destroyOnClose
        title="批量导入用户"
        width={800}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Card title="未下载过模板？" style={{ height: '100%' }}>
              <Button
                type="primary"
                href={`${config.baseURL}${api.userImportTemplate}`}
              >
                点击下载模板
              </Button>
              <br />
              <br />
              提示：如未下载过模板文件，请先下载模板文件并编辑，然后上传。
            </Card>
          </Col>
          <Col span={12}>
            <Card title="已有模板，直接上传">
              <Form>
                <Form.Item>
                  {getFieldDecorator('file', {
                    rules: [{ required: true, message: '请添加上传文件' }],
                  })(<Upload beforeUpload={this.beforeUpload}>
                    <Button type="primary">上传文件</Button>
                  </Upload>)}
                </Form.Item>
                <br />
                <Alert
                  type="info"
                  message="注意：只能上传Excel格式文件，且文件小于5M。"
                />
                <br />
                提示：当上传文件成功后，点击提交将会覆盖并更新您当前页面中用户的查询条件和信息展示，如确认无误，您可点击提交。
              </Form>
            </Card>
          </Col>
        </Row>
      </Modal>
    )
  }
}
