import { toXML } from 'jstoxml';

/**
 * Generates XML for a request using jstoxml
 * Takes a JS object and turns it into XML
 * @internal
 */
export function buildRequestXml(request: object): string {
  const options = {
    header: '<?xml version="1.0" encoding="utf-8" ?>',
    indent: '    ',
    newline: '\n'
  };
  
  return toXML({ request }, options);
}
