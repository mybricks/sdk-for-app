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
import publish from './publish'
import getFileTreeMapByFile from './getFileTreeMapByFile'
import getFiles from './getFiles'
import getHierarchy from './getHierarchy'

import getFileInfoByBaseFileIdAndRelativePath from './getFileInfoByBaseFileIdAndRelativePath'
import batchPublishService from './batchPublishService'
import getLatestModulePubByProjectId from "./getLatestModulePubByProjectId";
import getFileRoot from "./getFileRoot";
import getLatestPub from './getLatestPub'
import getFile from './getFile'
import getCooperationUser from './getCooperationUser'
import createCooperationUser from './createCooperationUser'
import updateCooperationUser from './updateCooperationUser'
import getSaveVersions from './getSaveVersions'

const File = {
  getLatestPub,
  getLatestModulePubByProjectId,
  getFullFile,
  getAll,
  getTemplates,
  save,
  create,
  createByTemplate,
  delete: deleteFile,
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
  getFileInfoByBaseFileIdAndRelativePath,
  getFile,
  getCooperationUser,
  createCooperationUser,
  updateCooperationUser
}

export default File