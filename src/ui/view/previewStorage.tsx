export default class PreviewStorage {

  fileId = ''

  constructor({ fileId }) {
    this.fileId = fileId
  }

  getFileKeyTemplate = (fileId) => `--preview-${fileId}-`;

  savePreviewPageData = ({ dumpJson, comlibs }) => {
    localStorage.setItem(`--preview-${this.fileId}-`, JSON.stringify(dumpJson))
    localStorage.setItem(`--preview--comlibs--${this.fileId}-`, JSON.stringify(comlibs))
  }

  getPreviewPageData = () => {
    let dumpJson: any = localStorage.getItem(`--preview-${this.fileId}-`)
    let comlibs: any = localStorage.getItem(`--preview--comlibs--${this.fileId}-`)

    try {
      dumpJson = JSON.parse(dumpJson)
    } catch (ex) {
      console.log(ex)
      throw ex
    }

    try {
      comlibs = JSON.parse(comlibs)
    } catch (error) {
      console.log(error)
      throw error
    }

    return { dumpJson, comlibs }
  }
}

