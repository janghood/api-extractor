/**
 * @description vscode vetur creator to create tags and attributes of components
 * @author youus
 * @date 2024/2/22 23:27
 * @version v1.0.0
 *
 * Hello, humor
 */
import { JhAPI } from '../../../types/janghood-api-extractor';
import { jWarn } from '../../common/console';
import { VeturAttribute, VeturAttributes } from '@janghood/config';
import { clearDefault, formatTypes } from '../../common/utils';

export const veturDataCreator = () => {
  const generateVeturTag = (api: JhAPI) => {
    if (!api) {
      return;
    }
    const { children, doc } = api;

    const attributes: string[] = []
    if (!children || children.length === 0) {
      jWarn('no doc error!');
    } else {
      // maybe someday we need merge doc ,so use for()
      for (const child of children) {
        if (child.children) {
          if (child.name.includes('Prop')) {
            for (const c of child.children) {
              attributes.push(c.name);
            }
            break;
          }
        }
      }
    }
    return {
      [doc?.name ?? '']: {
        attributes,
        description: `${doc?.docDescription}\n[docs](${doc?.docUrl})`
      }
    }
  }

  const BASE_TYPES = ['string', 'number', 'boolean', 'null', 'undefined'];

  const isBaseTypes = (type: string) => {
    return BASE_TYPES.some(baseType => type.includes(baseType));
  }

  const handleType = (type: string) => {
    if (!type.includes('|') || isBaseTypes(type)) {
      return type;
    }
    const [currentStrList, typeList] = formatTypes(type)
    if (currentStrList.length > 0) {
      return currentStrList;
    }
    return typeList;
  };

  const childToAttribute = (identifierAPI: JhAPI): VeturAttribute => {
    const { doc, name } = identifierAPI;
    const attribute = {} as VeturAttribute;
    if (doc) {
      const type = handleType(doc.type)
      attribute.type = doc.type;
      if (Array.isArray(type)) {
        attribute.type = 'string';
        attribute.options = type;
      }
      attribute.default = clearDefault(doc.default);

      if (doc.description) {
        attribute.description = doc.description;
      }
    }

    return attribute;
  };

  const generateVeturAttributes = (api: JhAPI) => {
    if (!api) {
      return;
    }
    const { children, doc } = api;

    const attributes: VeturAttributes = {}
    if (!children || children.length === 0) {
      jWarn('no doc error!');
    } else {
      // maybe someday we need merge doc ,so use for()
      for (const child of children) {
        if (child.children) {
          if (child.name.includes('Prop')) {
            for (const c of child.children) {
              attributes[`${doc?.name}/${c.name}`] = childToAttribute(c);
            }
            break;
          }
        }
      }
    }
    return attributes
  }

  return {
    generateVeturTag,
    generateVeturAttributes
  }
}
