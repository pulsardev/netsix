# Netsix



## Bug Fixes
  - check if we're not finishing to append a segment before requesting new segments
  ([805c737b](https://mmorainville@bitbucket.org/mathieumorainville/netsix-vue/commits/805c737b8faf63331340e374d3b9e5cf40c13da0))
  - display an error if Electron doesn't find the command to execute
  ([ae0007fd](https://mmorainville@bitbucket.org/mathieumorainville/netsix-vue/commits/ae0007fd3968f40f9043eaa11f43c549997d6ae0))
  - wait for the clientPeer's initial signal te be generated before using a received answer
  ([b32cf6e5](https://mmorainville@bitbucket.org/mathieumorainville/netsix-vue/commits/b32cf6e5472ecb91dab45311e25482e451ddb1fd))
  - convert the local storage value of `useSignaling` to boolean before using it
  ([4dc57c69](https://mmorainville@bitbucket.org/mathieumorainville/netsix-vue/commits/4dc57c69a45db5b177e3a7bfd5a33b07d3e2fabc))
  - correctly handle the received signaling messages
  ([c1219bab](https://mmorainville@bitbucket.org/mathieumorainville/netsix-vue/commits/c1219bab9ca9fd928b1c14ec2036191071d61fda))
  - monitor the amount of data in the buffer when sending chunks
  ([7cb5df02](https://mmorainville@bitbucket.org/mathieumorainville/netsix-vue/commits/7cb5df026a3275e70ff8b2eb6709943f4072e136))
  - generate unique UUIDs for each collection
  ([cef02b5b](https://mmorainville@bitbucket.org/mathieumorainville/netsix-vue/commits/cef02b5bdc689f2ecd116e30e0d86e042b7ffa0d))
  - change the default value of the collections in the concerned vuex module
  ([f064aa6c](https://mmorainville@bitbucket.org/mathieumorainville/netsix-vue/commits/f064aa6cf898be7517953393438b650e9b52e48c))
  - use active class on links only when the target is exactly matching a specific route
  ([4ed48b5a](https://mmorainville@bitbucket.org/mathieumorainville/netsix-vue/commits/4ed48b5a97df9531148bda0f9c73ebb64fe76d3c))




## Features
  - display last notifications as they arrive
  ([99ea1f3a](https://mmorainville@bitbucket.org/mathieumorainville/netsix-vue/commits/99ea1f3a74d2f2e2a88fc1d722584479c3505863))
  - add a Notifications component
  ([0efb5e39](https://mmorainville@bitbucket.org/mathieumorainville/netsix-vue/commits/0efb5e39ad59aca3827eddd1c07359bc11a0cad6))
  - display some statistics on the video and the transfer's state
  ([0a5896a5](https://mmorainville@bitbucket.org/mathieumorainville/netsix-vue/commits/0a5896a55425e54b636970233496c6fed9ddcf92))
  - the client peer can now receive video chunks
  ([53851796](https://mmorainville@bitbucket.org/mathieumorainville/netsix-vue/commits/538517963b739d6bb8539548126aa279102513f7))
  - switch packager from electron-packager to electron-builder
  ([fcba0650](https://mmorainville@bitbucket.org/mathieumorainville/netsix-vue/commits/fcba065036d052aac8c7e62b5db4c7c81381929b))
  - handle the remote collections received via WebRTC
  ([35f72f5b](https://mmorainville@bitbucket.org/mathieumorainville/netsix-vue/commits/35f72f5b69fcbb09d639654262968b5570803ebd))
  - use the no-signaling connection strategy by default
  ([6c261343](https://mmorainville@bitbucket.org/mathieumorainville/netsix-vue/commits/6c26134384318de9717d8be4a917e087fc86c425))
  - send the local collections from the host peer upon connection
  ([9613c155](https://mmorainville@bitbucket.org/mathieumorainville/netsix-vue/commits/9613c1552b47c02a0202a4f9c70514eb71d7913d))
  - add the possibility to manually (without a signaling server) connect to a peer
  ([89cc476e](https://mmorainville@bitbucket.org/mathieumorainville/netsix-vue/commits/89cc476e8e7c05152d435b787e3b67630a13f243))
  - handle the "sourceBuffer is full" error (loosely based on https://github.com/nickdesaulniers/netfix/blob/gh-pages/demo/bufferWhenNeeded.html)
  ([a12a1544](https://mmorainville@bitbucket.org/mathieumorainville/netsix-vue/commits/a12a15443877428f3b88e196d8c8ad023b95ce35))
  - fragment mp4 files and read them chunk by chunk before appending the chunks to a MediaSource object
  ([59e13f94](https://mmorainville@bitbucket.org/mathieumorainville/netsix-vue/commits/59e13f94c3e27d82670844129d1ee0c09676d2ee))
  - add the possibility to read local files
  ([0003001e](https://mmorainville@bitbucket.org/mathieumorainville/netsix-vue/commits/0003001ecdb83404a0a5fffff3b8a56c7c36e2b8))
  - add the possibility to delete local collections
  ([fc1448fa](https://mmorainville@bitbucket.org/mathieumorainville/netsix-vue/commits/fc1448fa295b595bd2d7e0df79bdf77dffcf123a))
  - manage local collections
  ([d0f8861e](https://mmorainville@bitbucket.org/mathieumorainville/netsix-vue/commits/d0f8861e82f89c8b568e89142fd7d99a3e0a870c))
  - split the sidebar in different components and handle the collections as objects
  ([96cb3893](https://mmorainville@bitbucket.org/mathieumorainville/netsix-vue/commits/96cb389394c3e3816d9b8389be29c96df1689e10))
  - store the localPeerId into the localStorage
  ([4d76fc5a](https://mmorainville@bitbucket.org/mathieumorainville/netsix-vue/commits/4d76fc5ac52810a48c63141a7240d8237691503f))
  - add the VideoPlayer component
  ([a1407bd9](https://mmorainville@bitbucket.org/mathieumorainville/netsix-vue/commits/a1407bd99d9786be71d6698af174347d7661fa3f))
  - begin to add the connection module to the state
  ([34937025](https://mmorainville@bitbucket.org/mathieumorainville/netsix-vue/commits/349370258f53386049e1b71675882613a5bd0516))
  - put the sidebar in a component and display a notification when copying the local Peer ID
  ([4bd9ba59](https://mmorainville@bitbucket.org/mathieumorainville/netsix-vue/commits/4bd9ba59dec694d50c6d31e9d62d618983072406))




## Refactor
  - put isElectron in the state and remove the ESLint check when instantiating notifications
  ([ce5b901b](https://mmorainville@bitbucket.org/mathieumorainville/netsix-vue/commits/ce5b901b0f582b3bf1e91a3af5fa9e1d67f50e08))




## Style
  - add the Netsix logo
  ([5ea4acc9](https://mmorainville@bitbucket.org/mathieumorainville/netsix-vue/commits/5ea4acc9af7f2d4a7e6353686762fb1b0fb09083))
  - fix the layout of the PeerConnection component on small screens
  ([0dc13814](https://mmorainville@bitbucket.org/mathieumorainville/netsix-vue/commits/0dc13814bcba9d0c5c174ff5e4268a7149bfd35b))




## Chore
  - add GNU GPLv3 license file
  ([6c1b42ee](https://mmorainville@bitbucket.org/mathieumorainville/netsix-vue/commits/6c1b42ee42b742f041a7f20924183216badaf5b1))
  - some cleanup
  ([c87bc3d8](https://mmorainville@bitbucket.org/mathieumorainville/netsix-vue/commits/c87bc3d889219755d2dfab166e776f3e108ff0b9))
  - clean up the PeerConnection component
  ([04c9eeb0](https://mmorainville@bitbucket.org/mathieumorainville/netsix-vue/commits/04c9eeb0b9ab97c6577637e23255afa9dae76cc1))
  - update the README with the Git Commit Guidelines
  ([603541e8](https://mmorainville@bitbucket.org/mathieumorainville/netsix-vue/commits/603541e827f2665f076c036c5a05ca5d988f62bf))
  - initial commit
  ([59e70c51](https://mmorainville@bitbucket.org/mathieumorainville/netsix-vue/commits/59e70c515aa4f24f67492c8f453b4826db683a7e))





---
<sub><sup>*Generated with [git-changelog](https://github.com/rafinskipg/git-changelog). If you have any problems or suggestions, create an issue.* :) **Thanks** </sub></sup>
