<template>
  <div>
    <h4 class="card-title">Chat room</h4>

    <div class="chat-messages" ref="messages">
      <div v-for="message in messages" class="card">
        <div class="card-block row" :class="[message.from === 'remote' ? 'justify-content-start' : 'justify-content-end']">
          <span class="badge" :class="[message.from === 'remote' ? 'badge-default' : 'badge-primary']">{{ message.payload }}</span>
        </div>
      </div>
    </div>

    <form v-on:submit.prevent class="form-inline justify-content-center mt-2">
      <div class="input-group">
        <input v-model="message" @keyup.enter.stop.prevent="sendChatMessage" class="form-control" type="text" placeholder="Enter a message">
        <span class="input-group-btn">
          <button @click="sendChatMessage" class="btn btn-primary" type="button" :disabled="message === ''">Send</button>
        </span>
      </div>
    </form>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'chat-room',
    computed: mapState({
      messages: state => state.chatroom.messages
    }),
    data () {
      return {
        message: ''
      }
    },
    watch: {
      messages: function () {
        // Scroll the messages' list to the bottom when new messages are received
        this.$nextTick(() => {
          this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight
        })
      }
    },
    methods: {
      sendChatMessage () {
        console.log('ChatRoom: sendChatMessage: message', this.message)

        let peer = window.clientPeer._pcReady ? window.clientPeer : window.hostPeer

        let message = {
          type: 'CHAT_MESSAGE',
          payload: this.message
        }

        peer.send(JSON.stringify(message))

        this.$store.commit('PUSH_TO_CHATROOM_MESSAGES', {
          payload: message.payload,
          from: 'local'
        })
      }
    }
  }
</script>

<style scoped>
  .badge {
    line-height: inherit;
    white-space: normal;
  }

  .chat-messages {
    max-height: 256px;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .chat-messages .card {
    border: none;
  }

  .chat-messages .card-block {
    padding: 0.5em 1.25rem;
  }
</style>
