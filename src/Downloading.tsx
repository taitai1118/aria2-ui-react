
import { Progress } from "antd"
import { forwardRef, memo, useContext, useEffect, useImperativeHandle } from "react"
import { useState } from "react"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import Aria2Client from "./aria2-client"
import { SelectedTasksContext, useTasks2 } from './hooks'
import { State } from "./store"

interface IProps {
  client: Aria2Client,
  speed: number
}



var functasks: any[] = []
function Downloading({ client ,speed}: IProps, ref: React.Ref<any>) {
  var dispatch = useDispatch()
  var tasksContext = useContext(SelectedTasksContext)
  var { selectedTasks, setSelectedTasks, tasksType, setTasksType } = tasksContext
  var tasks = useSelector((state: State) => {
    return state.activeTasks
  })
  // var tasks = useTasks2(() => {
  //   return client.ready().then((client: any) => client.tellActive(0, 100))
  // }, 1000)
  // var downloadTasks = useSelector((state: State) => {
  //   return state.downloadTasks
  // })
  useEffect(() => {
    tasksContext.setSelectedTasks([])
    functasks = []
    tasksContext.setTasksType('downloading')
  }, [])

  useEffect(() => {
    debugger
    // @ts-ignore
    client.tellActive().then(tasks => {
      dispatch({
        type: 'updateActiveTasks',
        tasks: tasks,
      })
    })

    var id = setInterval(async () => {
      // @ts-ignore
      var tasks = await client.tellActive()
      // console.log('-------', tasks)
      dispatch({
        type: 'updateActiveTasks',
        tasks: tasks,
      })
    }, 1000)

    return () => clearInterval(id)
  }, [client])

  var tasks = useTasks2(() => {
    return client.ready().then((client: any) => client.tellActive())
  }, 1000)



  // function selectTask(e: any, gid: string) {
  //   if (e.target.checked) {
  //     functasks = [...downloadTasks, gid]
  //     // console.log('选中' + functasks)
  //     dispatch({
  //       type: 'updateDownloadTasks',
  //       tasks: functasks
  //     })
  //   } else {
  //     // console.log('取消之前'+functasks)
  //     // console.log('取消的那个gid'+gid)
  //     functasks = functasks.filter(it => it !== gid);
  //     // console.log('取消'+functasks)
  //     dispatch({
  //       type: 'updateDownloadTasks',
  //       tasks: functasks
  //     })
  //   }
  //   tasksContext.setSelectedTasks(functasks)

  // }
  useImperativeHandle(ref, () => ({
    selectAll: function () {
      if (functasks.length !== tasks.length) {
        tasksContext.setSelectedTasks(tasks.map(it => it.gid)) // 为了切换下方的多选框
        functasks = tasks.map(it => it.gid)
      } else {
        tasksContext.setSelectedTasks([]) // 为了切换下方的多选框
        functasks = []
      }
    },
  }))
  var Regex = /[^/]+(?!.*\/)/
  function goClick(gid: number) {
    debugger
    let gids
    if (!selectedTasks.includes(gid)) {
      gids = [...selectedTasks, gid]
    } else {
      gids = selectedTasks.filter(it => it !== gid)

    }
    dispatch({
      type: 'updateDownloadTasks',
      task: gids,
    })
    setSelectedTasks(gids)

  }
  return (
    <div id='task-table'>
      <div id='task-table-title'>
    <div>文件名<span style={{fontSize:15}} className="iconfont">&#xe600;</span></div>
        <div>大小</div>
        <div>进度</div>
        <div>剩余时间</div>
        <div>下载速度</div>
      </div>
      {
        tasks.map(task => {
          return <div id='task-table-content' key={task.gid} className={selectedTasks.includes(task.gid) ? 'clickli' : ''} onClick={(e) => goClick(task.gid)}>
           <div className='task-name'><input type="checkbox" defaultChecked={true}   />{task.files[0].path?.match(Regex)[0]}</div>
           <div className='task-alllength' >{(task.totalLength /1024).toFixed(2)}KB</div>
           <div>{((task.completedLength/task.totalLength * 100).toFixed(2))+'%'}</div>
           <div>{((task.totalLength - task.completedLength)/speed/60).toFixed(2)}min</div>
           <div style={{color: 'blue'}}>{(speed/1024).toFixed(2)}KB/s</div>
          </div>
        })
      }
      
    </div>
  )
}
export default memo(forwardRef(Downloading))