const CONTROLLER_WATERMARK = '__controller__';
const HOST_METADATA = 'host';
const PATH_METADATA = 'path';
const SCOPE_OPTIONS_METADATA = 'scope:options';
const VERSION_METADATA = '__version__';
const isString = (val: any): val is string => typeof val === 'string';
const isUndefined = (obj: any): obj is undefined =>
  typeof obj === 'undefined';

export function MController(
  prefixOrOptions?: any,
  _config?: { namespace?: string }
) {
  const defaultPath = '/';

  const [path, host, scopeOptions, versionOptions] = isUndefined(
    prefixOrOptions,
  )
    ? [defaultPath, undefined, undefined, undefined]
    : isString(prefixOrOptions) || Array.isArray(prefixOrOptions)
    ? [prefixOrOptions, undefined, undefined, undefined]
    : [
        prefixOrOptions.path || defaultPath,
        prefixOrOptions.host,
        { scope: prefixOrOptions.scope, durable: prefixOrOptions.durable },
        Array.isArray(prefixOrOptions.version)
          ? Array.from(new Set(prefixOrOptions.version))
          : prefixOrOptions.version,
      ];

  return (target: object) => {
    let newPath = path;
    if(_config && _config.namespace){
      if(path.startsWith('/')){
        newPath = `/${_config.namespace}` + path;
      } else {
        newPath = `/${_config.namespace}/` + path
      }
    }
    console.log('path是:', target, newPath);
    (Reflect as any).defineMetadata(CONTROLLER_WATERMARK, true, target);
    (Reflect as any).defineMetadata(HOST_METADATA, host, target);
    (Reflect as any).defineMetadata(PATH_METADATA, newPath, target);
    (Reflect as any).defineMetadata(SCOPE_OPTIONS_METADATA, scopeOptions, target);
    (Reflect as any).defineMetadata(VERSION_METADATA, versionOptions, target);
  };
}