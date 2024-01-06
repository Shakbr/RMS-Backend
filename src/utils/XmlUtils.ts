import { XMLParser } from 'fast-xml-parser';

export class XmlUtils {
  static parse(xml: string): unknown {
    const parser = new XMLParser();
    return parser.parse(xml);
  }
}
