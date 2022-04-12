/**
 * @description web-types document creator
 * @author 阿怪
 * @date 2022/4/7 1:50 PM
 * @version v1.0.0
 *
 * 江湖的业务千篇一律，复杂的代码好几百行。
 */
import type { WebTypesTag } from "../../../types/module/web-type";
import type { JanghoodConfig, JhAPIs } from "../../../types/janghood-api-extractor";
import { loadPackage } from "./loadPackage";
import { jError } from "../../common/console";
import { webTypesTagCreator, WebTypesTagCreatorRunner } from "./webTypesTagCreator";
import { createFile } from "../../common/createFile";
import { validateDocumentConfig } from "../../config/config";

export const webTypesCreator = () => {

  let apis: JhAPIs;
  let tagCreator: {
    run: WebTypesTagCreatorRunner
  };

  const init = (apiList: JhAPIs) => {
    apis = apiList.filter(api => api.doc && api.children && api.children.length > 0);
    apis.forEach(api => {
      if (api.children && api.children.length > 0) {
        api.children = api.children.filter(item => item.name !== '')
      }
    })
  }

  const createBaseInfo = async (config: JanghoodConfig) => {
    // get package.json info
    const option = config.apiExtractor!.document!.webTypes;
    const packageJson = await loadPackage(option?.packageUrl);
    tagCreator = webTypesTagCreator(option);
    if (!packageJson) {
      jError('can not get package.json info');
    }

    return {
      "$schema": "https://raw.githubusercontent.com/JetBrains/web-types/master/schema/web-types.json",
      name: packageJson.name,
      version: packageJson.version,
      contributions: {
        html: {
          "types-syntax": "typescript",
          "description-markup": "markdown",
          tags: [] as WebTypesTag[]
        }
      },
      ...option?.webTypesInfo
    }
  }


  const run = async (config: JanghoodConfig) => {
    if (!validateDocumentConfig(config, 'webTypes')) {
      return;
    }
    const webTypesInfo = await createBaseInfo(config);
    if (!apis || !tagCreator) {
      jError('please init first');
      return;
    }
    webTypesInfo.contributions.html.tags = apis.map(api => tagCreator.run(api)).filter(e => e) as WebTypesTag[];
    return webTypesInfo;
  }

  return {
    init,
    run
  }
}

export default async function (apis: JhAPIs, option?: JanghoodConfig) {
  const w = webTypesCreator();
  w.init(apis);
  const info = await w.run(option || {});
  if (info) {
    createFile('web-types.json', JSON.stringify(info, null, 2));
  }
}