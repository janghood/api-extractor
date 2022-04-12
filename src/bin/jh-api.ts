/**
 * @description jh-api cli
 * @author 阿怪
 * @date 2022/4/6 11:38 AM
 * @version v1.0.0
 *
 * 江湖的业务千篇一律，复杂的代码好几百行。
 */
import { loadConfigFromFile } from "../config/config";
import { jError } from "../common/console";
import type { Documents } from "../../types/module/config";
import { getJhApi } from "../index";
import webTypes from "../document/web-types";
import markdown from "../document/markdown";

const noActiveDocument = (document: Documents) => {
  const documents = Object.values(document);

  if (documents.length < 1) {
    return true;
  }
  return !documents.some(e => e.active);
}

const documents = [webTypes, markdown];

// run jh-api
const run = async () => {
  // resolve janghood.config, such as default value....
  const jhConfigInfo = await loadConfigFromFile();
  if (!jhConfigInfo) {
    jError('can not find janghood.config');
    return;
  }
  const { config } = jhConfigInfo;


  const document = config.apiExtractor?.document;
  if (!document || noActiveDocument(document)) {
    console.log('can not found document in config or not have any active document');
    return;
  }
  // get jh api
  const apis = await getJhApi(config);

  // call documents
  documents.forEach(document => {
    document(apis, config);
  })

}

run();