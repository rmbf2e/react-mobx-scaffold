// 由于引入React lazy Suspense引起的enzyme错误
// Enzyme Internal Error: unknown node with tag 13
// 解决方案
// https://github.com/airbnb/enzyme/issues/1917#issuecomment-461497779

import React from 'react'

const react = jest.requireActual('react')

const Suspense = ({ children }) => <div>{children}</div>
Suspense.displayName = 'Suspense'

module.exports = { ...react, Suspense }
