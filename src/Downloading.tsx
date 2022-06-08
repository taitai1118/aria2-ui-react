import { useEffect } from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import Aria2Client from "./aria2-client"
import { useTasks2 } from './hooks'

interface IProps {
  client: Aria2Client
}




export default function Downloading({ client }: IProps) {

  var tasks = useTasks2(() => {
    return client.ready().then((client: any) => client.tellActive())
  }, 1000)

  return (
    <div>
      下载中...
      <ul>
        {
          tasks.map(task => {
            return <li key={task.gid}>
              <input type="checkbox" />
              <span>{task.files[0].path}</span>
              |
              <span>{task.completedLength}</span>
              |
              <span>{task.downloadSpeed}B/s</span>
              |
              <Link to={"/task/detail/" + task.gid}>详情</Link>
            </li>
          })
        }
      </ul>
    </div>
  )
}
