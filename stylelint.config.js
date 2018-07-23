module.exports = {
  extends: [
    'stylelint-config-recommended',
    'stylelint-config-property-sort-order-smacss',
  ],
  rules: {
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global'],
      },
    ],
    'at-rule-no-unknown': false,
  },
}
