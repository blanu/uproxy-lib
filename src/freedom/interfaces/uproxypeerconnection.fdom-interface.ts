// This file defines the API for uProxy's peerconnection Freedom module.
// It should be incorporated as part of re-building Freedom in order
// for it to be made available as a core provider.
// For docs, see:
//   ../providers/uproxypeerconnection.ts

/// <reference path="../../freedom/typings/freedom.d.ts" />
/// <reference path="../coreproviders/uproxypeerconnection.ts" />

declare var fdom:freedom.CoreProviderEnv.Fdom;

fdom.apis.set('core.uproxypeerconnection', {
  'constructor': {
    value: 'object'
  },

  ////////
  // Signalling channel.
  ////////

  'negotiateConnection': {
    type: 'method',
    value: [],
    ret: 'object',
    err: { 'message': 'string' }
  },

  'close': {
    type: 'method',
    value: [],
    err: { 'message': 'string' }
  },

  'handleSignalMessage': {
    type: 'method',
    value: ['object']
  },

  'signalForPeer': {
    type: 'event',
    value: 'object'
  },

  'onceConnected': {
    type: 'method',
    value: [],
    ret: 'object',
    err: { 'message': 'string' }
  },

  'onceConnecting': {
    type: 'method',
    value: [],
    err: { 'message': 'string' }
  },

  'onceDisconnected': {
    type: 'method',
    value: [],
    err: { 'message': 'string' }
  },

  ////////
  // Data channels.
  ////////

  'openDataChannel': {
    type: 'method',
    value: ['string'],
    err: { 'message': 'string' }
  },

  'closeDataChannel': {
    type: 'method',
    value: ['string']
  },

  'onceDataChannelOpened': {
    type: 'method',
    value: ['string'],
    err: { 'message': 'string' }
  },

  'onceDataChannelClosed': {
    type: 'method',
    value: ['string']
  },

  'peerOpenedChannel': {
    type: 'event',
    value: 'string'
  },

  'dataFromPeer': {
    type: 'event',
    value: {
      'channelLabel': 'string',
      'message': {
        'str': 'string',
        'buffer': 'buffer'
      }
    }
  },

  'send': {
    type: 'method',
    value: [
      'string',
      { 'str': 'string',
        'buffer': 'buffer' }
    ],
    err: { 'message': 'string' }
  }
});

fdom.apis.register('core.uproxypeerconnection',
    freedom_UproxyPeerConnection.FreedomPcImpl);
