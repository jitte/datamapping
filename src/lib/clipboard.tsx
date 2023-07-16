const writeClipboard = (value: string) => {
  console.log('at: writeClipboard ', value)
  navigator.clipboard
    .writeText(value)
    .then(() => {
      console.log('write success')
    })
    .catch((reason) => {
      console.log('write error', reason)
    })
}

async function readClipboard(): Promise<string> {
  console.log('at: readClipboard')
  const clipboard = await navigator.clipboard
    .readText()
    .then((value) => {
      console.log('read success', value)
      return value
    })
    .catch((reason) => {
      console.log('read error', reason)
      return ''
    })
  return clipboard
}

export { writeClipboard, readClipboard }
