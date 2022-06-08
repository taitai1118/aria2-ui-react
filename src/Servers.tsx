import { useMemo, useState } from "react"
import { useInput } from "./hooks"


export default function Servers() {
  var ip: any = useInput('')
  var port: any = useInput('')
  var secret: any = useInput('')

  var aria2Servers = useMemo(() => {

    return JSON.parse(localStorage.ARIA2_SERVERS ?? '[]')

  }, [])

  var [servers, setServers] = useState(aria2Servers)

  function addServer() {
    var newServers = [...servers, {
      ip: ip.value,
      port: port.value,
      secret: secret.value,
    }]

    setServers(newServers)

    localStorage.ARIA2_SERVERS = JSON.stringify(newServers)

    ip.clear()
    port.clear()
    secret.clear()
  }

  return (
    <div>
      <h2>服务器管理</h2>
      <ul>
        {
          servers.map((server:any, idx: number) => {
            return (
              <li key={idx}>
                <div>ip: {server.ip}</div>
                <div>port: {server.port}</div>
                <div>secret: {server.secret}</div>
              </li>
            )
          })
        }
      </ul>
      <div>ip: <input type="text" {...ip} /></div>
      <div>port: <input type="text" {...port} /></div>
      <div>secret: <input type="text" {...secret} /></div>
      <button onClick={addServer}>添加</button>
    </div>
  )
}
