import { EventEmitter } from "events"


export default class Aria2Client extends EventEmitter {
  ws: WebSocket | null
  id: number
  readyPromise: Promise<Aria2Client>

  // 该对象记录每个id的请求对应的回调函数
  // 内容为id => callback
  callbacks: {
    [id: number]: (data: any) => void
  } = {}
  //ip地址
  constructor(public ip: string = '127.0.0.1', public port: number | string, public secret: string) {
    super()
    var url = `ws://${ip}:${port}/jsonrpc`
    this.id = 1
    this.ws = null

    this.readyPromise = new Promise((resolve, reject) => {
      this.ws = new WebSocket(url)
      this.ws.addEventListener('open', e => {
        resolve(this)
      })
      this.ws.addEventListener('error', e => {
        reject(e)
      })
    })

    // @ts-ignore
    this.ws.addEventListener('message', (e) => {
      var data = JSON.parse(e.data)
      var id = data.id
      if (id) {
        var callback = this.callbacks[id]
        delete this.callbacks[id]
        callback(data)
      } else {
        // 说明是事件, onDownloadStart, onDownloadError
        var eventName = data.method.slice(8)
        this.emit(eventName, ...data.params)
      }
    })

  }

  destroy() {
    this.ws?.close()
  }

  ready() {
    return this.readyPromise
  }

  // addUri(...args: any[]) {
  //   return new Promise((resolve, reject) => {
  //     var id = this.id++

  //     function callback(data: any) {
  //       if (data.error) {
  //         reject(data.error)
  //       } else {
  //         resolve(data.result)
  //       }
  //     }

  //     this.callbacks[id] = callback

  //     this.ws.send(JSON.stringify({
  //       jsonrpc: '2.0',
  //       id: id,
  //       method: 'aria2.addUri',
  //       params: [`token:${this.secret}`, ...args]
  //     }))
  //   })
  // }

}

const aria2Methods = [
  "addUri",
  "addTorrent",
  "getPeers",
  "addMetalink",
  "remove",
  "pause",
  "forcePause",
  "pauseAll",
  "forcePauseAll",
  "unpause",
  "unpauseAll",
  "forceRemove",
  "changePosition",
  "tellStatus",
  "getUris",
  "getFiles",
  "getServers",
  "tellActive",
  "tellWaiting",
  "tellStopped",
  "getOption",
  "changeUri",
  "changeOption",
  "getGlobalOption",
  "changeGlobalOption",
  "purgeDownloadResult",
  "removeDownloadResult",
  "getVersion",
  "getSessionInfo",
  "shutdown",
  "forceShutdown",
  "getGlobalStat",
  "saveSession",
  // "system.multicall",
  // "system.listMethods",
  // "system.listNotifications"
] as const


aria2Methods.forEach(methodName => {
  // var [, methodName] = methodName.split('.')

  // @ts-ignore
  Aria2Client.prototype[methodName] = function (...args: any[]) {
    return this.ready().then(() => {
      return new Promise((resolve, reject) => {
        var id = this.id++

        function callback(data: any) {
          if (data.error) {
            reject(data.error)
          } else {
            resolve(data.result)
          }
        }

        this.callbacks[id] = callback

        // @ts-ignore
        this.ws.send(JSON.stringify({
          jsonrpc: '2.0',
          id: id,
          method: 'aria2.' + methodName,
          params: [`token:${this.secret}`, ...args]
        }))
      })
    })
  }
})


// type Aria2MethodNames = typeof aria2Methods[number]

// type Aria2Client2 = {
//   [method in Aria2MethodNames]?: () => void;
// }


// function createAria2Client(ip: string, port: string, secret: string): Aria2Client2 {
//   var client: Aria2Client2 = {}

//   var url = `ws://${ip}:${port}/jsonrpc`
//   var ws = new WebSocket(url)
//   var id = 0
//   var callbacks: any = {}
//   var readyPromise = new Promise(resolve => {

//   })

//   for (var methodName of aria2Methods) {
//     client[methodName] = function (...args: any[]) {
//       return new Promise((resolve, reject) => {

//         function callback(data: any) {
//           if (data.error) {
//             reject(data.error)
//           } else {
//             resolve(data.result)
//           }
//         }

//         callbacks[id++] = callback

//         ws.send(JSON.stringify({
//           jsonrpc: '2.0',
//           id: id,
//           method: 'aria2.' + methodName,
//           params: [`token:${secret}`, ...args]
//         }))
//       })
//     }
//   }

//   return client
// }


// var client = createAria2Client('', '', '')

// client.addMetalink!()
