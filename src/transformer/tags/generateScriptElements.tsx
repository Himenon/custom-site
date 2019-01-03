import { HtmlMetaProperties, ScriptHTMLAttributes } from "@custom-site/page";
import * as React from "react";

export interface DryCheckParameter {
  src: string;
  isLocal: boolean;
}

const isIncludes = (params: DryCheckParameter[], searchElement: DryCheckParameter): boolean => {
  const hitParams = params.filter(param => param.isLocal === searchElement.isLocal && param.src === searchElement.src);
  hitParams.forEach(element => {
    console.error(`[Duplicated Error]: Scope: ${element.isLocal ? "local" : "global"}, src: ${element.src}`);
  });
  return hitParams.length > 0;
};

const getMakeScriptTag = (dryParameter: DryCheckParameter[] = []) => (
  attributes: ScriptHTMLAttributes | string,
  isLocal: boolean,
): JSX.Element | undefined => {
  if (typeof attributes === "string") {
    if (isIncludes(dryParameter, { src: attributes, isLocal })) {
      return;
    } else {
      dryParameter.push({
        src: attributes,
        isLocal,
      });
    }
    return <script src={attributes} key={attributes} />;
  }
  if (!attributes.src) {
    return;
  }
  if (isIncludes(dryParameter, { src: attributes.src, isLocal })) {
    return;
  } else {
    dryParameter.push({
      src: attributes.src,
      isLocal,
    });
  }
  return <script {...{ ...attributes, src: attributes.src }} key={attributes.src} />;
};

export const generateScriptElements = ({ localScripts, globalScripts }: HtmlMetaProperties): JSX.Element[] => {
  const elements: JSX.Element[] = [];
  const makeScriptTag = getMakeScriptTag();
  if (globalScripts) {
    globalScripts.forEach(attribute => {
      const tagElement = makeScriptTag(attribute, false);
      if (tagElement) {
        elements.push(tagElement);
      }
    });
  }
  if (localScripts) {
    localScripts.forEach(attribute => {
      const tagElement = makeScriptTag(attribute, true);
      if (tagElement) {
        elements.push(tagElement);
      }
    });
  }
  return elements;
};
