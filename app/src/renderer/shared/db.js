import low from 'lowdb'

export const db = low('netsix-db', {storage: require('lowdb/lib/storages/browser')})

db.defaults({localCollections: null, remoteCollections: null}).write()
