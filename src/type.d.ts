declare module '*.less' {
  const classes: { [key: string]: string };
  export default classes;
}

declare let PKG : {
  name: string,
  version: string,
}