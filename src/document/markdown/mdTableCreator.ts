/**
 * @description markdown form creator
 * @author 阿怪
 * @date 2022/4/9 9:05 PM
 * @version v1.0.0
 *
 * 江湖的业务千篇一律，复杂的代码好几百行。
 */
import type { JhAPI } from "../../../types/janghood-api-extractor";
import { jError } from "../../common/console";

const propMDTableTitle = '|title|type|default|required|description|';
const propMDTableSplit = '|---|---|---|---|---|';

/**
 * @description markdown table creator
 * @param document means one file, maybe include multiple md table
 */
export const mdTableCreator = (document: JhAPI) => {
  if (!document) {
    jError('document is null');
    return [];
  }

  const { children: forms } = document;
  // make it strong
  if (forms && forms.length > 0) {
    return forms.map(form => {
      const { children: props, name } = form;
      // to support more types
      if (name.includes('Prop') && props && props.length > 0) {
        return {
          table: [propMDTableTitle, propMDTableSplit, ...props.map(prop => toFormItem(prop))].join('\n'),
          name: form.name
        }
      }
    }).filter(e => e) || [];
  }
  return [];
}

const formatType = (type: string) => type.replaceAll('|', '&#124;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

const toFormItem = (prop: JhAPI): string => {
  const { name, doc } = prop;
  const formItem: MarkdownFormItem = {
    title: name || '',
    type: formatType(doc?.type ?? ''),
    default: doc?.default ?? '',
    required: doc?.required !== 'false',
    remark: doc?.description?.replaceAll('\n', '<br/>') ?? '',
  }
  return `|${Object.values(formItem).map(e => e || '-').join('|')}|`;
}

export type MarkdownFormItem = {
  title: string,
  type: string,
  default: string,
  required: boolean,
  remark: string
}
