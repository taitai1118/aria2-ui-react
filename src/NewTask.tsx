import { useNavigate } from "react-router-dom"
import Aria2Client from "./aria2-client"
import { useInput } from "./hooks"


export interface IProps {
  client: Aria2Client
}

export default function NewTask({ client }: IProps) {
  var uris = useInput('')
  var downloadSpeed = useInput('')

  var navigate = useNavigate()

  function start() {
    var links = uris.value.split('\n').map(it => it.trim()).filter(it => it)
    for (var link of links) {
      // @ts-ignore
      client.addUri([link], {
        'max-download-limit': downloadSpeed.value
      })
    }
    navigate('/downloading')
  }

  return (
    <div>
      <div>
        选项
        <div>下载速度：<input type="text" {...downloadSpeed}/></div>
      </div>
      <div>
        <div>下载链接，一行一个：</div>
        <div>
          <textarea cols={60} rows={10} {...uris}></textarea>
        </div>
        <button onClick={start}>开始下载</button>

      </div>
    </div>
  )
}
