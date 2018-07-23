module.exports = {
  data: [
    {
      name: '跟价管理',
      children: [
        {
          name: '商品跟价',
          to: '/helper',
          // to: 'followPrice',
        },
        {
          name: '黑名单管理',
          to: '/blacklist',
        },
      ],
    },
    {
      name: '评价审核',
      children: [
        {
          name: '人工审核',
          to: '/manualAudit',
        },
      ],
    },
    {
      name: '调价监控',
      children: [
        {
          name: '调价历史查询',
          to: '/history',
        },
      ],
    },
    {
      name: '系统设置',
      children: [
        {
          name: '自动跟价开关',
          to: '/aotuFollowPrice',
        },
        {
          name: '更新分类',
          to: '/updateCategory',
        },
        {
          name: '用户权限管理',
          to: '/userPrivilege',
        },
      ],
    },
  ],
}
