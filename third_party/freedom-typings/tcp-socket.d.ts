// Typescript file for core.tcpsocket in:
// https://github.com/freedomjs/freedom/blob/master/interface/core.js

/// <reference path="../../../build/third_party/typings/es6-promise/es6-promise.d.ts" />
/// <reference path='freedom-common.d.ts' />

// The data types used by TcpSocket
//declare module freedom {
  declare module freedom_TcpSocket {
    interface DisconnectInfo {
      errcode :string;
      message :string;
    }

    interface ReadInfo {
      data :ArrayBuffer;
    }

    interface WriteInfo {
      bytesWritten :number;
    }

    interface SocketInfo {
      connected :boolean;
      localAddress ?:string;
      localPort ?:number;
      peerAddress ?:string;
      peerPort ?:number;
    }

    interface ConnectInfo {
      socket :number;
      host :string;
      port :number;
    }

    // The TcpSocket class (freedom['core.TcpSocket'])
    interface Socket {
      listen(address:string, port:number) : Promise<void>;
      connect(hostname:string, port:number) : Promise<void>;
      secure() : Promise<void>;
      write: freedom.Method1<ArrayBuffer,WriteInfo>;
      pause: freedom.Method0<void>;
      resume: freedom.Method0<void>;
      getInfo() : Promise<SocketInfo>;
      close() : Promise<void>;
      // TcpSockets have 3 types of events:
      on(type:'onConnection', f:(i:ConnectInfo) => void) : void;
      on(type:'onData', f:(i:ReadInfo) => void) : void;
      off(type:'onData', f:(i:ReadInfo) => void) : void;
      on(type:'onDisconnect', f:(i:DisconnectInfo) => void) : void;
      on(eventType:string, f:(i:Object) => void) : void;
      off(eventType:string, f:(i:Object) => void) : void;
    }
  }  // module TcpSockets
// }
