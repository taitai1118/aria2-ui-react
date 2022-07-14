import { memo, useImperativeHandle } from "react";
import { useContext } from "react";
import { forwardRef } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { RefObject } from "react";
import { useState } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { Link } from "react-router-dom";
import { useTasks2 } from "./hooks";

import { State } from "./store";
import { SelectedTasksContext } from "./hooks"
import { Progress } from "antd";
import Aria2Client from "./aria2-client";

interface IProps {
  client: Aria2Client,
  speed: number
}

function Stopped({ client ,speed}: IProps, ref: React.Ref<any>) {
  var [clickli,setClickli] = useState('')
 
  var tasksContext = useContext(SelectedTasksContext)
  var {selectedTasks,setSelectedTasks,tasksType,setTasksType} = tasksContext
  var dispatch = useDispatch();
  useEffect(() => {
    setSelectedTasks([])
   setTasksType('stopped')
  },[])


  var stoppedTasks = useSelector((state: State) => {
    return state.stoppedTasks
  })
  // function selectTask(e: any, gid: string) {
  //   if (e.target.checked) {
  //     setSelectedTasks([...stoppedTasks, gid])
  //     // console.log('选中' + functasks)
  //     dispatch({
  //       type: 'updateStoppedTasks',
  //       tasks: selectedTasks
  //     })
  //   } else {

  //     setSelectedTasks(selectedTasks.filter(it => it !== gid))
  //     dispatch({
  //       type: 'updateStoppedTasks',
  //       tasks: selectedTasks
  //     })
  //   }
  // }

  var tasks = useTasks2(() => {
    return client.ready().then((client: any) => client.tellStopped(0, 100))
  }, 1000)

  useImperativeHandle(ref, () => ({
    selectAll: function () {
      if (selectedTasks.length !== tasks.length) {
        setSelectedTasks(tasks.map(it => it.gid)) // 为了切换下方的多选框
      } else {
        setSelectedTasks([]) // 为了切换下方的多选框
      }
    },
  }))
  var Regex = /[^/]+(?!.*\/)/
  function goClick(gid:number) {
    debugger
   let gids
   if(!selectedTasks.includes(gid)){
    gids = [...selectedTasks,gid] 
   } else {
    gids = selectedTasks.filter(it => it!==gid)
   
   }
   dispatch({
    type: 'updateStoppedTasks',
    task:gids,
   })
   setSelectedTasks(gids)
   
  }
  function changeno(){

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
           <div></div>
           <div style={{color: 'blue'}}>已完成</div>
          </div>
        })
      }

    </div> 



  )
}
export default memo(forwardRef(Stopped))
