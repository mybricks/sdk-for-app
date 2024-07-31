import getAll from "./getAll";
import getPublishContent from './getPublishContent'
import getPublishVersions from './getPublishVersions'
import getFullFile from './getFullFile'
import save from './save'
import create from './create'
import updateDeliveryChannel from "./updateDeliveryChannel";
import createByTemplate from './createByTemplate'
import getTemplates from './getTemplates'
import getDeliveryChannel from './getDeliveryChannel'
import deleteFile from './delete'
import deleteFileSaves from './deleteFileSaves'
import deleteMutiFileSaves from './deleteMutiFileSaves'
import publish from './publish'
import getFileTreeMapByFile from './getFileTreeMapByFile'
import getFiles from './getFiles'
import getHierarchy from './getHierarchy'

import batchPublishService from './batchPublishService'
import getLatestModulePubByProjectId from "./getLatestModulePubByProjectId";
import getFileRoot from "./getFileRoot";
import getLatestPub from './getLatestPub'
import getLatestSave from './getLatestSave'
import getFileContentByFileIdAndPubVersion from './getFileContentByFileIdAndPubVersion'
import getFile from './getFile'
import getCooperationUser from './getCooperationUser'
import createCooperationUser from './createCooperationUser'
import updateCooperationUser from './updateCooperationUser'
import getSaveVersions from './getSaveVersions'
import getPubAssetPath from './getPubAssetPath'

const File = {
  getLatestSave,
  getFileContentByFileIdAndPubVersion,
  getLatestPub,
  getLatestModulePubByProjectId,
  getFullFile,
  getAll,
  getTemplates,
  save,
  create,
  createByTemplate,
  getPubAssetPath,
  delete: deleteFile,
  deleteFileSaves,
  deleteMutiFileSaves,
  getDeliveryChannel,
  updateDeliveryChannel,
  publish,
  batchPublishService,
  getPublishContent,
  getPublishVersions,
  getSaveVersions,
  getFileTreeMapByFile,
  getHierarchy,
  getFiles,
	getFileRoot,
  getFile,
  getCooperationUser,
  createCooperationUser,
  updateCooperationUser
}

export default File