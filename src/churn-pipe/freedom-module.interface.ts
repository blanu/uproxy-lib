/// <reference path='../../../third_party/typings/es6-promise/es6-promise.d.ts' />

import net = require('../net/net.types');

export interface MirrorMapping {
  local: net.Endpoint;
  remote: net.Endpoint;
}

export interface freedom_ChurnPipe {
  setTransformer(transformerName :string,
      key ?:ArrayBuffer,
      config ?:string) : Promise<void>;
  bindLocal(publicEndpoint:net.Endpoint) : Promise<void>;
  addBrowserEndpoint(browserEndpoint:net.Endpoint) : Promise<void>;
  bindRemote (remoteEndpoint:net.Endpoint) : Promise<void>;
  on(name:'mappedAddress', listener:(event:MirrorMapping) => void) : void;
  on(name:string, listener:(event:Object) => void) : void;
}
