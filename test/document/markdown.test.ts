/**
 * @description markdown test
 * @author 阿怪
 * @date 2022/4/8 3:03 PM
 * @version v1.0.0
 *
 * 江湖的业务千篇一律，复杂的代码好几百行。
 */

import { test, expect, beforeAll, describe } from 'vitest';
import { markdownCreator } from "../../src/document/markdown";
import { getJhApi } from "../../src";
import { JhAPIs } from "../../types/janghood-api-extractor";
import { mdTableCreator } from "../../src/document/markdown/mdTableCreator";

let testApiInfo: JhAPIs = [];
const option = {
  apiExtractor: {
    include: ['example/**/*.d.ts'],
    document: {
      markdown: {
        output: 'doc',
        active: true
      }
    }
  }
}
beforeAll(async () => {
  testApiInfo = await getJhApi(option);
});

describe('mdTableCreator return right', () => {
  test('return right table list', () => {
    const api = testApiInfo[0];
    expect(mdTableCreator(api)).toMatchInlineSnapshot(`
      [
        {
          "name": "ButtonProps",
          "table": "|title|type|default|required|description|
      |---|---|---|---|---|
      |border|boolean|false|-|按钮是否有边框|
      |disabled|boolean&#124;string|false|true|disable or not 是否禁用|
      |type|Array&lt;any&gt;|[]|true|button type 按钮的类型|
      |K in ButtonType|boolean|false|true|按钮类型|",
        },
        {
          "name": "ButtonTypeProps",
          "table": "|title|type|default|required|description|
      |---|---|---|---|---|
      |K in ButtonType|boolean|false|true|按钮类型|",
        },
      ]
    `);
  })

  test('test return right markdown info', () => {
    const markdownHandler = markdownCreator();
    markdownHandler.init([testApiInfo[0]]);
    const markdownInfo = markdownHandler.run(option);
    expect(markdownInfo).toMatchInlineSnapshot(`
    [
      {
        "doc": {
          "author": "阿怪",
          "date": "2022/4/19 00:08",
          "description": "merge props",
          "version": "v1.0.0",
        },
        "name": "example/merge/merge.d.ts",
        "path": {
          "directory": "doc/example/merge",
          "file": "merge.d.ts",
        },
        "tables": [
          {
            "name": "ButtonProps",
            "table": "|title|type|default|required|description|
    |---|---|---|---|---|
    |border|boolean|false|-|按钮是否有边框|
    |disabled|boolean&#124;string|false|true|disable or not 是否禁用|
    |type|Array&lt;any&gt;|[]|true|button type 按钮的类型|
    |K in ButtonType|boolean|false|true|按钮类型|",
          },
          {
            "name": "ButtonTypeProps",
            "table": "|title|type|default|required|description|
    |---|---|---|---|---|
    |K in ButtonType|boolean|false|true|按钮类型|",
          },
        ],
      },
    ]
  `);
  })

  describe('replace',()=>{
    test('replace with string', () => {
      const markdownHandler = markdownCreator();
      markdownHandler.init([testApiInfo[0]]);
      const markdownInfo = markdownHandler.run({
          apiExtractor: {
            include: ['example/**/*.d.ts'],
            document: {
              markdown: {
                output: 'doc',
                replace: 'example/',
                active: true
              }
            }
          }
        }
      );
      expect(markdownInfo[0]!.path.directory).toBe('doc/merge');
    })

    test('replace with function', () => {
      const markdownHandler = markdownCreator();
      markdownHandler.init([testApiInfo[0]]);
      const markdownInfo = markdownHandler.run({
          apiExtractor: {
            include: ['example/**/*.d.ts'],
            document: {
              markdown: {
                output: 'doc',
                replace: (dir) => dir.replace('example/', ''),
                active: true
              }
            }
          }
        }
      );
      expect(markdownInfo[0]!.path.directory).toBe('doc/merge');
    })
  })


})

