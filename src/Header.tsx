import { useEffect, useState } from "react"
import { useContext } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import Aria2Client from "./aria2-client"
import { SelectedTasksContext, useTasks2 } from "./hooks"
import { State } from "./store"
import {
  PlusOutlined,
  DeleteOutlined,
  SortAscendingOutlined,
  AppstoreOutlined,
  QuestionCircleOutlined,
  PauseOutlined,
  CaretRightOutlined ,
} from '@ant-design/icons';
interface IProps {
  client: Aria2Client,
  listComp: any,

  // selectedTasks:any[],
}


export default function Header({ client ,listComp}: IProps) {
  // console.log('看看我'+client)
  // console.log('看看我'+Aria2Client)
  var tasksContext = useContext(SelectedTasksContext)
  var navigate = useNavigate()
  // var tasksContext = useContext(SelectedTasksContext)
  // var [selectedTasks, setSelectedTasks] = useState<any>([])
  var stoppedTasks = useSelector((state: State) => {
    return state.stoppedTasks
  })

  var waitingTasks = useSelector((state: State) => {
    return state.waitingTasks
  })
  // console.log(listComp.current)

  // useEffect(() => {
  //   // console.log('effect', listComp.current)

  //   if (listComp.current) {
  //     listComp.current.onSelectedTaskChanged = function (tasks: any) {
  //       // debugger
  //       // setSelectedTasks(tasks)
  //     }
  //   }

  //   return () => {
  //     if (listComp.current) {
  //       listComp.current.onSelectedTaskChanged = null
  //     }
  //   }
  // }, [listComp.current])
  function selectAll() {
    listComp.current.selectAll()
    // tasksContext.setSelectedTasks(listComp.current.tasks.map((it: { gid: any }) => it.gid))

  }

  function goNew() {
    navigate('/new')
  }
  // console.log(client)
  function goStart() {
   var tasksgid = tasksContext.selectedTasks
   for(var taskgid of tasksgid){
     // @ts-ignore
    client.unpause(taskgid)
   }
  }
  function goStop() {
    var tasksgid = tasksContext.selectedTasks
   for(var taskgid of tasksgid){
     // @ts-ignore
    client.pause(taskgid)
   }
  }
  function goRemove(){
    var tasksgid = tasksContext.selectedTasks
    for(var taskgid of tasksgid){
      if(tasksContext.tasksType === 'waiting'){
        // @ts-ignore
        client.remove(taskgid)
      } else if(tasksContext.tasksType === 'stopped'){
        // @ts-ignore
        client.removeDownloadResult(taskgid)
      } else {
        // @ts-ignore
        client.forceRemove(taskgid)
      }
    
    }
  }
  // function goRemoveCompleted(){ //清楚已经完成的任务
  //   if(tasksContext.tasksType == 'stopped'){
  //     selectAll()
  //     console.log(tasksContext.selectedTasks)
  //     var tasksgid = tasksContext.selectedTasks
  //     for(var taskgid of tasksgid){
  //       // @ts-ignore
  //       client.removeDownloadResult(taskgid)
  //     }
  //   }
  
  // }
  // console.log(tasksContext.selectedTasks)
  return (
    <div>
    {/* <ul id="nav">
    <li  onClick={goNew}><a><PlusOutlined />新建下载</a></li>
    <li className={tasksContext.selectedTasks.length <= 0 ? 'disabled' : ''} onClick={goStart}><a><CaretRightOutlined /></a></li>
    <li className={tasksContext.selectedTasks.length <= 0 ? 'disabled' : ''} onClick={goStop}><a><PauseOutlined /></a></li>
    <li  className={tasksContext.selectedTasks.length <= 0 ? 'disabled' : ''} onClick={goRemove}><a><DeleteOutlined /></a></li>
    <li onClick={selectAll}><a><AppstoreOutlined /></a></li>
    <li><a><SortAscendingOutlined /></a></li>
    <li><a><QuestionCircleOutlined /> </a></li>
  </ul> */}


<div className='header'>
<div className='new' onClick={goNew}>
  <a><span className="iconfont">&#xe72b;</span><span>新建</span></a>
</div>
<div className='divider'><span className="iconfont">&#xe63a;</span></div>
<div className={tasksContext.selectedTasks.length <= 0 ? 'disabled' : 'havetask'} onClick={goStart}>
  <span className="iconfont">&#xe68a;</span>
</div>
<div className={tasksContext.selectedTasks.length <= 0 ? 'disabled' : 'havetask'} onClick={goStop}>
 <span className="iconfont">&#xe67d;</span></div>
<div className={tasksContext.selectedTasks.length <= 0 ? 'disabled' : 'havetask'} onClick={goRemove}>
<span className="iconfont">&#xe74b;</span></div>
<div className='divider'><span className="iconfont">&#xe63a;</span></div>
<div className='all'onClick={selectAll} ><span className="iconfont">&#xe9be;</span></div>
<div className='down'><span className="iconfont">&#xeaf3;</span></div>
<div className='divider'><span className="iconfont">&#xe63a;</span></div>
<div className='help'><span className="iconfont">&#xe70f;
</span></div>
<div></div>
</div>
</div>
  )
}
