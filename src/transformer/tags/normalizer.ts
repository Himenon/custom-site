export const normalizerSourcePath = (src: string, isLocal: boolean): string => {
  const isIgnorePattern = !!src.match(/^https?\:\/\//);
  if (isLocal && src.match(/^\//)) {
    return src.replace(/^\//, "./");
  }
  if (isLocal && !src.match(/^\.\//) && !isIgnorePattern) {
    return `./${src}`;
  }
  if (!isLocal && src.match(/^\.\//)) {
    return src.replace(/^\.\//, "/");
  }
  if (!isLocal && !src.match(/^\//) && !isIgnorePattern) {
    return `/${src}`;
  }
  return src;
};
