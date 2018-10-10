/**
 * return a english word present continuous
 * not cover every english word case, but in here is enough
 * @param {String} word to be ingify
 * @return {String} ing word
 * */

const needDoubleLastCharator = /[^aeiou][aeiou][tnm]$/

function ingify(word) {
  if (word.endsWith('ie')) {
    return `${word.slice(0, word.length - 2)}ying`
  }
  if (word.endsWith('c')) {
    return `${word}king`
  }
  if (word.endsWith('e')) {
    return `${word.slice(0, word.length - 1)}ing`
  }
  if (needDoubleLastCharator.test(word)) {
    const lastCharator = word[word.length - 1]
    return `${word}${lastCharator}ing`
  }
  return `${word}ing`
}

export default ingify
