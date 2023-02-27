import axios from 'axios'

export default function staticServer({content, folderPath, fileName}) {
  const blob = new Blob([content])
  const formData = new FormData()
  formData.append('file', blob, fileName)
  formData.append('folderPath', folderPath)

  return new Promise((resolve, reject) => {
    axios({
      method: "post",
      url: '/paas/api/flow/saveFile',
      data: formData
    }).then(({ data }) => {
      if (data.code === 1 && data.data) {
        resolve(data.data)
      } else {
        reject('上传失败')
      }
    })
  })
}
