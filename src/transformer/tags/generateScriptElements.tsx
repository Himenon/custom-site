import { HtmlMetaProperties, ScriptHTMLAttributes } from "@rocu/page";
import * as React from "react";
import { normalizerSourcePath } from "./normalizer";

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
    const normalizedSource1 = normalizerSourcePath(attributes, isLocal);
    if (isIncludes(dryParameter, { src: attributes, isLocal })) {
      return;
    } else {
      dryParameter.push({
        src: attributes,
        isLocal,
      });
    }
    return <script src={normalizedSource1} key={normalizedSource1} />;
  }
  if (!attributes.src) {
    return;
  }
  const normalizedSource2 = normalizerSourcePath(attributes.src, isLocal);
  if (isIncludes(dryParameter, { src: normalizedSource2, isLocal })) {
    return;
  } else {
    dryParameter.push({
      src: normalizedSource2,
      isLocal,
    });
  }
  return <script {...{ ...attributes, src: normalizedSource2 }} key={normalizedSource2} />;
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
