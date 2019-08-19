const fs = require('fs').promises
const path = require('path')
const parse = require('markdown-parse')

const generatePostList = async () => {
  console.log('Generating published post lists ...')

  const publishedPath = path.resolve(__dirname, 'contents/posts/published')
  let result = await Promise.all((await fs.readdir(publishedPath, 'utf-8')).map(async res => ({
    [res]: (await fs.lstat(path.resolve(publishedPath, res))).isDirectory()
  })))

  result = result.filter(res => res[Object.keys(res)[0]] === true)

  result = await Promise.all(result.map(async res => {
    const name = Object.keys(res)[0]
    const post = await fs.readFile(path.resolve(publishedPath, name, 'index.md'), 'utf-8')
    return new Promise(resolve => {
      parse(post, (err, { attributes }) => {
        resolve({ name, date: attributes.date })
      })
    })
  }))

  result = result.sort((a, b) => (a.date.getTime() < b.date.getTime()) ? 1 : -1)
  result = `/* eslint-disable */\n// THIS IS AN AUTOGENERATED FILE.\n// DON'T EDIT THIS FILE DIRECTLY.\n\nexport default ${JSON.stringify(result)}`

  fs.writeFile(path.resolve(publishedPath, 'index.js'), result)
  console.log('Done generate published post lists\n')
}

generatePostList()
