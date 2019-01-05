import { ThirdParty } from "@custom-site/page";
import * as React from "react";

/**
 * @see https://developers.google.com/analytics/devguides/collection/analyticsjs/
 * @param ua トラッキング対象の Google アナリティクス プロパティのプロパティ ID
 */
const code = (ua: string) => `
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', '${ua}', 'auto');
ga('send', 'pageview');
`;

export const generateGoogleAnalyticsElement = (params: ThirdParty["googleAnalytics"]) => {
  if (!params || !params.ua) {
    return;
  }
  const props: JSX.IntrinsicElements["script"] = {
    dangerouslySetInnerHTML: {
      __html: code(params.ua),
    },
  };
  return <script {...props} />;
};
