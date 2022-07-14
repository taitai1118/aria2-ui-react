import { Form, Input, Select } from "antd"
import { useMemo, useState } from "react"
import { useInput } from "./hooks"
import ShowServer from "./ShowServer";


export default function Servers() {
  let [showServerIdx, setShowServerIdx] = useState(0)
  var ip: any = useInput('')
  var port: any = useInput('')
  var secret: any = useInput('')

  var aria2Servers = useMemo(() => {
  
    return JSON.parse(localStorage.ARIA2_SERVERS ?? '[]')

  }, [])

  var [servers, setServers] = useState(aria2Servers)

  // function addServer() {
  //   var newServers = [...servers, {
  //     ip: ip.value,
  //     port: port.value,
  //     secret: secret.value,
  //   }]

  //   setServers(newServers)

  //   localStorage.ARIA2_SERVERS = JSON.stringify(newServers)

  //   ip.clear()
  //   port.clear()
  //   secret.clear()
  // }
  const [componentSize, setComponentSize] = useState('default');
  //@ts-ignore
  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };

  function addServer() {
    setServers([
      ...servers,
      {
        ip: '',
        port: '',
        secret: ''
      }
    ])
    setShowServerIdx(servers.length)
  }

  function checkServer(idx: number) {
    setShowServerIdx(idx)
  }
  function deleteserver(e:React.MouseEvent<HTMLSpanElement, MouseEvent>,idx: number){
    console.log(idx)
    console.log(servers)
    servers.splice(idx, 1)
    localStorage.ARIA2_SERVERS = JSON.stringify(servers)
  }
  return (
    <div>
      <ul className="serverlist">
        <li className="global" key="global">全局</li>
        {
          servers.map((server: any, idx: number) => {
            return (
              <li key={server.ip} id={'li'+idx} className={"server" + (showServerIdx === idx ? ' checkedServer' : '')}onClick={() => checkServer(idx)} >
                <a className='pointer-cursor'><span className='nav-tab'>RPC {server.name ?? (server.ip ?? server.ip+':'+server.port)}</span><span onClick={(e) =>deleteserver(e,idx)} className="iconfont">&#xe640;</span></a>
              </li>
            )
          })
        }
        <li key="addServer" className='add-server' onClick={(e) => addServer()}><span className="iconfont">&#xea73;</span></li>
      </ul>
      {
      servers.map((server: any, idx: number) => {
        return (
          <div key={server.ip} className={idx === showServerIdx ? '' : 'hide'}>
            {/* <ShowServer server={server}></ShowServer> */}
            <ShowServer server={server??server}></ShowServer> 
          </div>
        )
      })
    }

    </div>

  )
}

