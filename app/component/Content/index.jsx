import React from 'react'
import ShareContent from 'share/component/Content'
import router from 'app/router'

const AppContent = props => (
  <ShareContent {...props}>
    {router}
  </ShareContent>
)

export default AppContent
