import { HtmlMetaProperties, LinkHTMLAttributes } from "@rocu/page";
import * as React from "react";
import { normalizerSourcePath } from "./normalizer";

export interface DryCheckParameter {
  href: string;
  isLocal: boolean;
}

const isIncludes = (params: DryCheckParameter[], searchElement: DryCheckParameter): boolean => {
  const hitParams = params.filter(param => param.isLocal === searchElement.isLocal && param.href === searchElement.href);
  hitParams.forEach(element => {
    console.error(`[Duplicated Error]: Scope: ${element.isLocal ? "local" : "global"}, src: ${element.href}`);
  });
  return hitParams.length > 0;
};

const getMakeTag = (dryParameter: DryCheckParameter[] = []) => (
  attributes: LinkHTMLAttributes | string,
  isLocal: boolean,
): JSX.Element | undefined => {
  if (typeof attributes === "string") {
    const normalizedSource1 = normalizerSourcePath(attributes, isLocal);
    if (isIncludes(dryParameter, { href: attributes, isLocal })) {
      return;
    } else {
      dryParameter.push({
        href: attributes,
        isLocal,
      });
    }
    return <link href={normalizedSource1} key={normalizedSource1} />;
  }
  if (!attributes.href) {
    return;
  }
  const normalizedSource2 = normalizerSourcePath(attributes.href, isLocal);
  if (isIncludes(dryParameter, { href: normalizedSource2, isLocal })) {
    return;
  } else {
    dryParameter.push({
      href: normalizedSource2,
      isLocal,
    });
  }
  return <link {...{ ...attributes, src: normalizedSource2 }} key={normalizedSource2} />;
};

export const generateLinkElements = ({ localLinks: localStyles, globalLinks: globalStyles }: HtmlMetaProperties): JSX.Element[] => {
  const elements: JSX.Element[] = [];
  const makeTag = getMakeTag();
  if (globalStyles) {
    globalStyles.forEach(attribute => {
      const tagElement = makeTag(attribute, false);
      if (tagElement) {
        elements.push(tagElement);
      }
    });
  }
  if (localStyles) {
    localStyles.forEach(attribute => {
      const tagElement = makeTag(attribute, true);
      if (tagElement) {
        elements.push(tagElement);
      }
    });
  }
  return elements;
};
