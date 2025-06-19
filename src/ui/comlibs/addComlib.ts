import { message } from 'antd'
import { myRequire } from './utils'
import { upgradeExternal, getCssDeps } from './getComlibs'
import { ComLib_Edit } from "./constants";

export const addComlib = async (ctx: Record<string, any>, newComlib: Record<string, any>) => {
    const { id, namespace, version } = newComlib
    if(!namespace) return message.error('缺少物料namespace')
    try {
        const material = await upgradeExternal({ namespace, version, appType: ctx.appType })
        const { styles } =  await myRequire({
            urls: [material.editJs],
            ctx
        }, (error) => {
            Promise.reject(error)
        })
        const cssLinks = getCssDeps([material]);
        ctx.comlibs.push(Object.assign(newComlib, material));
        const loadedComlib = window[ComLib_Edit].find(lib => lib.namespace===namespace);
        loadedComlib.id = id;
        loadedComlib._styleAry = styles.concat(cssLinks);
        return loadedComlib
    } catch (error) {
        throw error
    }
   
}