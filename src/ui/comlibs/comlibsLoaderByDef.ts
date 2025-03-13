import API from "../../api";

const comlibsLoaderByDef = async (defs: Array<{ namespace: string; version: string; }>, config: { app: string; appType }) => {
  const comlibs = await Promise.all(defs.map((def) => {
    return API.Material.getMaterialContent(def);
  }))
  const comlibEditUrlSet = new Set<string>();
  const externalUrlSet = new Set<string>();
  externalUrlSet.add(`${config.app}/public/react@18.0.0.production.min.js`);
  externalUrlSet.add(`${config.app}/public/react-dom@18.0.0.production.min.js`);
  comlibs.forEach((comlib) => {
    const { editJs, externals } = comlib[config.appType];
    comlibEditUrlSet.add(editJs);
    externals.forEach(({ urls }) => {
      urls.forEach((url) => {
        externalUrlSet.add(`${config.app}/${url.replace(/^\//, "")}`);
      })
    })
  })
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
  const iframeDocument = iframe.contentDocument!;

  const externalUrls = Array.from(externalUrlSet);
  while (externalUrls.length) {
    await new Promise((resolve) => {
      const url = externalUrls.shift() as string;
      const script = iframeDocument.createElement('script');
      script.src = url;
      script.onerror = () => {
        resolve(true);
      }
      script.onload = () => {
        resolve(true);
      }
      iframeDocument.head.appendChild(script);
    })
  }

  await Promise.all(Array.from(comlibEditUrlSet).map((url) => {
    return new Promise((resolve) => {
      const script = iframeDocument.createElement('script');
      script.src = url;
      script.onerror = () => {
        resolve(true);
      }
      script.onload = () => {
        resolve(true);
      }
      iframeDocument.head.appendChild(script);
    })
  }))

  const __comlibs_edit_ = (iframe as any).contentWindow.__comlibs_edit_;

  document.body.removeChild(iframe);

  return __comlibs_edit_;
}

export default comlibsLoaderByDef;
