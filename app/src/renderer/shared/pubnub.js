import PubNub from 'pubnub'
import store from '../vuex/store'

export let pubnub = new PubNub({
  publishKey: localStorage.getItem('publishKey') ? localStorage.getItem('publishKey') : 'pub-c-8c6e4bad-f94d-4ae6-812c-adbdc6bc0090',
  subscribeKey: localStorage.getItem('subscribeKey') ? localStorage.getItem('subscribeKey') : 'sub-c-ad995684-fd0c-11e6-afcf-02ee2ddab7fe',
  uuid: store.state.connection.localPeerId
})
