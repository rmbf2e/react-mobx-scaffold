import React from 'react'
import { mount } from 'enzyme'
import { Form, Select } from 'antd'
import SelectOption from 'component/SelectOption'

describe('component/SelectOption', () => {
  it('测试包含Option数据', () => {
    const options = [
      {
        label: 'AAA',
        value: 'aaa',
      },
      {
        label: 'BBB',
        value: 'bbb',
      },
    ]

    class TestForm extends React.PureComponent {
      render() {
        const { form } = this.props
        return (
          <Form>
            {form.getFieldDecorator('item')(<SelectOption options={options} />)}
          </Form>
        )
      }
    }

    const FormWrapper = Form.create()(TestForm)

    const app = mount(<FormWrapper />)
    const form = app
      .find(TestForm)
      .at(0)
      .prop('form')
    expect(form.getFieldsValue()).toEqual({})
    // form.setFieldsValue({ item: 'aaa' })
    const firstOption = app
      .find(Select)
      .at(0)
      .prop('children')[0]
    expect(firstOption.type).toBe(Select.Option)
    expect(firstOption.props).toEqual({
      value: 'aaa',
      children: 'AAA',
    })
    const lastOption = app
      .find(Select)
      .at(0)
      .prop('children')[1]
    expect(lastOption.type).toBe(Select.Option)
    expect(lastOption.props).toEqual({
      value: 'bbb',
      children: 'BBB',
    })
  })
})
