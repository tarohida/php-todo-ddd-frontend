import { describe, expect, it } from 'vitest'

import { TASK_TITLE_MAX_LENGTH, validateTaskTitle } from './taskTitle.js'

describe('task title validation', () => {
  it('trims surrounding whitespace and returns the normalized title', () => {
    expect(validateTaskTitle('\t\n\u3000買い物リスト\u3000\n')).toEqual({
      title: '買い物リスト',
      error: null,
    })
  })

  it.each(['', ' \t\n', '\u3000\u3000'])(
    'rejects a whitespace-only title (%j)',
    (title) => {
      expect(validateTaskTitle(title)).toEqual({
        title: '',
        error: 'タイトルを入力してください。',
      })
    },
  )

  it.each([
    ['ASCII', 'a'],
    ['Japanese', 'あ'],
    ['emoji', '😀'],
  ])('accepts a one-code-point %s title', (_label, title) => {
    expect(validateTaskTitle(title)).toEqual({ title, error: null })
  })

  it.each([
    ['ASCII', 'a'],
    ['Japanese', 'あ'],
    ['emoji', '😀'],
  ])('accepts a %s title at the 255-code-point boundary', (_label, character) => {
    const title = character.repeat(TASK_TITLE_MAX_LENGTH)

    expect(validateTaskTitle(title)).toEqual({ title, error: null })
  })

  it.each([
    ['ASCII', 'a'],
    ['Japanese', 'あ'],
    ['emoji', '😀'],
  ])('rejects a %s title over 255 Unicode code points', (_label, character) => {
    const title = character.repeat(TASK_TITLE_MAX_LENGTH + 1)

    expect(validateTaskTitle(title)).toEqual({
      title,
      error: 'タイトルは255文字以内で入力してください。',
    })
  })

  it('counts a surrogate-pair emoji as one Unicode code point', () => {
    const title = `${'a'.repeat(TASK_TITLE_MAX_LENGTH - 1)}😀`

    expect(title).toHaveLength(TASK_TITLE_MAX_LENGTH + 1)
    expect(validateTaskTitle(title)).toEqual({ title, error: null })
  })
})
