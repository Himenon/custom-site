import { HtmlMetaProperties, ScriptHTMLAttributes } from "@rocu/page";
import * as React from "react";

export interface DryScriptCheck {
  src: string;
  isLocal: boolean;
}

export const trimScriptSourcePath = (src: string, isLocal: boolean): string => {
  if (isLocal && src.match(/^\//)) {
    return src.replace(/^\//, "./");
  }
  if (isLocal && !src.match(/^\.\//)) {
    return `./${src}`;
  }
  if (!isLocal && src.match(/^\.\//)) {
    return src.replace(/^\.\//, "/");
  }
  if (!isLocal && !src.match(/^\//)) {
    return `/${src}`;
  }
  return src;
};

const isIncludes = (target: DryScriptCheck[], searchElement: DryScriptCheck): boolean => {
  const hitElements = target.filter(elem => elem.isLocal === searchElement.isLocal && elem.src === searchElement.src);
  hitElements.forEach(element => {
    console.error(`[Duplicated Error]: Scope: ${element.isLocal ? "local" : "global"}, src: ${element.src}`);
  });
  return hitElements.length > 0;
};

const getMakeScriptTag = (dryScriptCheck: DryScriptCheck[]) => (
  attribute: ScriptHTMLAttributes | string,
  isLocal: boolean,
): JSX.Element | undefined => {
  if (typeof attribute === "string") {
    const trimSrc = trimScriptSourcePath(attribute, isLocal);
    if (isIncludes(dryScriptCheck, { src: attribute, isLocal })) {
      return;
    } else {
      dryScriptCheck.push({
        src: attribute,
        isLocal,
      });
    }
    return <script src={trimSrc} key={trimSrc} />;
  }
  if (!attribute.src) {
    return;
  }
  const src = trimScriptSourcePath(attribute.src, isLocal);
  if (isIncludes(dryScriptCheck, { src, isLocal })) {
    return;
  } else {
    dryScriptCheck.push({
      src,
      isLocal,
    });
  }
  return <script {...{ ...attribute, src }} key={src} />;
};

export const generateScriptTag = ({ localScripts, globalScripts }: HtmlMetaProperties): JSX.Element[] => {
  const scriptTagElements: JSX.Element[] = [];
  const dryScriptCheck: DryScriptCheck[] = [];
  const makeScriptTag = getMakeScriptTag(dryScriptCheck);
  if (globalScripts) {
    globalScripts.forEach(attribute => {
      const tagElement = makeScriptTag(attribute, false);
      if (tagElement) {
        scriptTagElements.push(tagElement);
      }
    });
  }
  if (localScripts) {
    localScripts.forEach(attribute => {
      const tagElement = makeScriptTag(attribute, true);
      if (tagElement) {
        scriptTagElements.push(tagElement);
      }
    });
  }
  return scriptTagElements;
};
