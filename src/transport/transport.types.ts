// Common types for the uProxy transport abstraction.

// This should match the uproxy-networking/network-typings/communications.d.ts
// type with the same name (Net.Endpoint).
export interface Endpoint {
  address:string; // IPv4, IPv6, or domain name.
  port:number;
}

// This enum describes a simple signal message protocol for establishing P2P
// connections. TODO: rename to more accurately describe the intended
// abstraction: namely: INIT, DATA, END
export enum SignalType {
  OFFER,              // INIT new connection
  ANSWER,             // ACK of new connection
  // Possible candidate types, e.g. RELAY if a host is only accessible
  // via a TURN server. The values are taken from this file; as the comment
  // suggests, not all values may be found in practice:
  //   https://code.google.com/p/chromium/codesearch#chromium/src/third_party/webrtc/p2p/base/port.cc&q=port.cc&l=107
  CANDIDATE,          // signal data to send to peer
  NO_MORE_CANDIDATES  // no more data to send to peer
}

export interface SignallingMessage {
  // TODO: make an abstraction for the data so only the signal type needs to be
  // known by consumers of this type.
  type          :SignalType
  // The |candidate| parameter is set iff type === CANDIDATE
  candidate     ?:freedom_RTCPeerConnection.RTCIceCandidate;
  // The |description| parameter is set iff type === OFFER or
  // type === ANSWER
  description   ?:freedom_RTCPeerConnection.RTCSessionDescription;
}

// Data sent to or received from a peer on a data channel in the peer
// connection.
export interface Data {
  str ?:string;
  buffer ?:ArrayBuffer;
  // TODO: add when supported by WebRtc in Chrome and FF.
  // https://code.google.com/p/webrtc/issues/detail?id=2276
  //
  // bufferView  ?:ArrayBufferView;
  // blob        ?:Blob
  // domString   ?:DOMString
}

export interface DataChannel {
  // Guarenteed to be invarient for the life of the data channel.
  getLabel : () => string;

  // Promise for when the data channel has been openned.
  onceOpened : Promise<void>;

  // Promise for when the data channel has been closed (only fulfilled after
  // the data channel has been openned).
  // NOTE: There exists a bug in Chrome prior to version 37 which prevents
  //       this from fulfilling on the remote peer.
  onceClosed : Promise<void>;

  // Data from the peer. No data will be added to the queue after |onceClosed|
  // is fulfilled.
  dataFromPeerQueue :handler.QueueHandler<Data, void>;

  // Send data; promise returns when all the data has been passed on to the
  // undertlying network layer for ending.
  send(data:Data) : Promise<void>;

  // Closes this data channel.
  // A channel cannot be re-opened once this has been called.
  close() : void;

  toString() : string;
}


// Describes the state of a P2P connection.
export enum State {
  WAITING,      // Can move to CONNECTING.
  CONNECTING,   // Can move to CONNECTED or DISCONNECTED.
  CONNECTED,    // Can move to DISCONNECTED.
  DISCONNECTED  // End-state, cannot change.
}

export interface PeerConnection<TSignallingMessage> {
  // The state of this peer connection.
  pcState :State;

  // All open data channels.
  // NOTE: There exists a bug in Chrome prior to version 37 which causes
  //       entries in this object to continue to exist even after
  //       the remote peer has closed a data channel.
  dataChannels     :{[channelLabel:string] : DataChannel};

  // The |onceConnecting| promise is fulfilled when |pcState === CONNECTING|.
  // i.e. when either |handleSignalMessage| is called with an offer message,
  // or when |negotiateConnection| is called. The promise is never be rejected
  // and is guarenteed to fulfilled before |onceConnected|.
  onceConnecting  :Promise<void>;
  // The |onceConnected| promise is fulfilled when pcState === CONNECTED
  onceConnected :Promise<void>;
  // The |onceDisconnected| promise is fulfilled when pcState === DISCONNECTED
  onceDisconnected :Promise<void>;

  // Try to connect to the peer. Will change state from |WAITING| to
  // |CONNECTING|. If there was an error, promise is rejected. Otherwise
  // returned promise === |onceConnected|.
  negotiateConnection :() => Promise<void>;

  // A peer connection can either open a data channel to the peer (will
  // change from |WAITING| state to |CONNECTING|)
  openDataChannel :(channelLabel: string,
      options?: freedom_RTCPeerConnection.RTCDataChannelInit) =>
      Promise<DataChannel>;
  // Or handle data channels opened by the peer (these events will )
  peerOpenedChannelQueue :handler.QueueHandler<DataChannel, void>;

  // The |handleSignalMessage| function should be called with signalling
  // messages from the remote peer.
  handleSignalMessage :(signal:TSignallingMessage) => void;
  // The underlying handler that holds/handles signals intended to go to the
  // remote peer. A handler should be set that sends messages to the remote
  // peer.
  signalForPeerQueue :handler.QueueHandler<TSignallingMessage, void>;

  // Closing the peer connection will close all associated data channels
  // and set |pcState| to |DISCONNECTED| (and hence fulfills
  // |onceDisconnected|)
  close: () => void;
}
