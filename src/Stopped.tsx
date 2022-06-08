import { useImperativeHandle } from "react";
import { useContext } from "react";
import { forwardRef } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { RefObject } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { SelectedTasksContext, useTasks2 } from "./hooks";
import { IProps } from "./NewTask";



function Stopped({client}: IProps, ref: React.Ref<any>) {
  var [selectedGids, setSelectedGids] = useState<string[]>([])

  var gidRef = useRef<string[]>()
  gidRef.current = selectedGids

  function selectTask(e: any, gid: string) {
    var gids

    if (e.target.checked) {
      gids = [...selectedGids, gid]
    } else {
      gids = selectedGids.filter(it => it !== gid)
    }

    setSelectedGids(gids)
    if (typeof ref === 'object') {

      ref?.current?.onSelectedTaskChanged?.(
        gids.map(gid => {
          return tasks.find(task => task.gid === gid)
        }).filter(it => it)
      )
    }
  }

  useImperativeHandle(ref, () => ({
    selectAll: function () {
      setSelectedGids(tasks.map(it => it.gid)) // 为了切换下方的多选框
    },

    // getSelectedTasks() {
    //   return selectedGids.map(gid => {
    //     return tasks.find(task => task.gid === gid)
    //   }).filter(it => it)
    // },

    onSelectedTaskChanged: null
  }), [])

  var tasks = useTasks2(async () => {
    await client.ready()
    // @ts-ignore
    return client.tellStopped(0, 100)
  }, 1000, client)



  return (
    <div>
      已停止...
      <ul>
        {
          tasks.map(task => {
            return <li key={task.gid}>
              <input type="checkbox" checked={selectedGids.includes(task.gid)} onChange={(e) => selectTask(e, task.gid)}/>
              |
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


export default forwardRef(Stopped)
