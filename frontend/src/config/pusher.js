// Pusher configuration
// src/config/pusher.js

const PUSHER_CONFIG = {
  appId: process.env.REACT_APP_PUSHER_APP_ID || '1978163',
  key: process.env.REACT_APP_PUSHER_KEY || '2baff66ce4eb56c9ecc1',
  cluster: process.env.REACT_APP_PUSHER_CLUSTER || 'us2',
  encrypted: true
};

export default PUSHER_CONFIG;
