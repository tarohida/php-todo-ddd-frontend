export const TASK_TITLE_MAX_LENGTH = 255

const REQUIRED_ERROR = 'タイトルを入力してください。'
const TOO_LONG_ERROR = `タイトルは${TASK_TITLE_MAX_LENGTH}文字以内で入力してください。`

export function validateTaskTitle(input) {
  const title = typeof input === 'string' ? input.trim() : ''

  if (title === '') {
    return { title, error: REQUIRED_ERROR }
  }

  if (Array.from(title).length > TASK_TITLE_MAX_LENGTH) {
    return { title, error: TOO_LONG_ERROR }
  }

  return { title, error: null }
}
