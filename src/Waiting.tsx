
import { forwardRef, memo, useContext, useImperativeHandle, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SelectedTasksContext, useTasks2 } from './hooks'

import { State } from './store';
import { useEffect } from "react";
import Aria2Client from './aria2-client';
var functasks: any[] =[]
interface IProps {
  client: Aria2Client,
  speed: number
}

 function Waiting({ client,speed }: IProps, ref: React.Ref<any>) {
 
  var tasksContext = useContext(SelectedTasksContext)
  // tasksContext.setSelectedTasks(functasks)   
  var {selectedTasks,setSelectedTasks,tasksType,setTasksType} = tasksContext
  //@ts-ignore
  // console.log('listcomp'+(ref)) 
  var dispatch = useDispatch();
  
  var waitingTasks = useSelector((state: State) => {
    return state.waitingTasks
  })
  var tasks = useTasks2(() => {
    return client.ready().then((client: any) => client.tellWaiting(0, 100))
  }, 1000)


  useEffect(() => {
    tasksContext.setSelectedTasks([])
    functasks=[]
    tasksContext.setTasksType('waiting')
  },[])


  function selectTask(e: any, gid: string) {
    if (e.target.checked ){
      functasks =  [...waitingTasks,gid]
      dispatch({
        type: 'updateWaitingTasks',
        tasks:functasks
      })
    }else {
      // console.log('取消之前'+functasks)
      // console.log('取消的那个gid'+gid)
       functasks = functasks.filter(it => it !== gid);
      // console.log('取消'+functasks)
        dispatch({
          type: 'updateWaitingTasks',
          tasks:functasks
        })
    }
    tasksContext.setSelectedTasks(functasks)
  }

  //全选
  useImperativeHandle(ref, () => ({
    selectAll: function () {
      if(functasks.length !== tasks.length){
        tasksContext.setSelectedTasks(tasks.map(it => it.gid)) // 为了切换下方的多选框
        functasks = tasks.map(it => it.gid)
      } else {
        tasksContext.setSelectedTasks([]) // 为了切换下方的多选框
        functasks = []
      }
    },
   
  }),)




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
    type: 'updateWaitingTasks',
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
           <div style={{color: 'blue'}}>已暂停</div>
          </div>
        })
      }

    </div> 



  )
}
export default memo(forwardRef(Waiting))