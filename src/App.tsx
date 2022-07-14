import React, { useMemo, Component } from 'react';
import { HashRouter, NavLink, Routes, Route, useLocation } from 'react-router-dom'
import Aria2Client from './aria2-client';
import Downloading from './Downloading';
import Waiting from './Waiting';
import NewTask from './NewTask';
import Header from './Header';
import Stopped from './Stopped';
import { useState } from 'react';
import TaskDetail from './TaskDetail';
import { SelectedTasksContext, useTasks2 } from './hooks';
import { useRef } from 'react';
import Settings from './Settings';
import Servers from './Servers';
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import { State } from './store';


// @ts-ignore
globalThis.Aria2Client = Aria2Client
function App() {
  var currentServerIdx = useMemo(() => localStorage.currentServerIdx ?? 0, [])
  var aria2Servers = useMemo(() => {
    return JSON.parse(localStorage.ARIA2_SERVERS ?? '[]')
  }, [])

  var [connectState, setConnectState] = useState('连接中...')
  var [selectedIdx, setSelectedIdx] = useState(currentServerIdx)
  var [serverlist,setServerlist] = useState('')
  function showserverlist(){
    if(serverlist == 'show'){
      setServerlist('')
    }else {
      setServerlist('show')
    }
  
  }
  var [globalStat, setGlobalStat] = useState<any>({
    numActive: '0',
    numWaiting: '0',
    numStoppedTotal: '0',
    uploadSpeed: '0',
    downloadSpeed: '0',
  })

  var [aria2, setAria2] = useState(
    useMemo(() => {
      var server = aria2Servers[currentServerIdx]
      var aria2 = new Aria2Client(server.ip, server.port, server.secret)
      return aria2
    }, [])
  )

  useEffect(() => {
    aria2.ready().then(() => {
      setConnectState(connState => {
        if (connState == '连接中...') {
          return '已连接'
        } else {
          return connState
        }
      })
    }, () => {
      setConnectState(connState => {
        if (connState == '连接中...') {
          return '未连接'
        } else {
          return connState
        }
      })
    })

    var id: NodeJS.Timer
    aria2.ready().then(() => {
      id = setInterval(() => {
        // console.log('timer...')
        // @ts-ignore
        aria2.getGlobalStat().then(stat => {
          setGlobalStat(stat)
        })
      }, 1000)
    })

    async function onComplete(taskInfo: any) {
      // @ts-ignore
      var task = await aria2.tellStatus(taskInfo.gid)
      toast('有任务下载完成了', task.files[0].path)
    }
    aria2.on('DownloadComplete', onComplete)

    return () => {
      clearInterval(id)
      aria2.off('DownloadComplete', onComplete)
      aria2.destroy()
      // 解绑事件的同时还应该销毁aria2对象，如里面的websocket连接
    }
  }, [aria2])
  var [selectedTasks, setSelectedTasks] = useState([])
  var [uriOption, setUriOption] = useState(false)
  var [optionSetting, setOptionSetting] = useState<any>({})
  var [tasksType, setTasksType] = useState()

  var listComp = useRef()
var speed = useRef()


  useEffect(() => {
    var serverInfo = aria2Servers[selectedIdx]
    setConnectState('连接中...')
    var aria2 = new Aria2Client(serverInfo.ip, serverInfo.port, serverInfo.secret) 
    setAria2(aria2)
  }, [selectedIdx])

  // var tasks = useTasks2(() => {
  //   return client.ready().then((client: any) => client.tellStopped(0, 100))
  // }, 1000)
  function changeServer(e:React.MouseEvent<HTMLLIElement, MouseEvent>,idx: number) {
    var idx = idx
    setSelectedIdx(idx)
    localStorage.currentServerIdx = idx
  }
  return (
    <SelectedTasksContext.Provider value={{ selectedTasks, setSelectedTasks, tasksType, setTasksType, uriOption,setUriOption,optionSetting,setOptionSetting}}>
      <ToastContainer />
      <HashRouter>
        <div className="App">
          <div className="App-left">
            <div className='select'>
                <div className="logo-lg-title" onClick={showserverlist}>AriaNg<span className="iconfont">&#xe601;</span></div>
            </div>
            <div className={serverlist == 'show' ? 'show':'setserverlist'}>
                <ul className="hi" >
                 {aria2Servers.map((server: any, idx: number) => {
                    return <li onClick={(e) => changeServer(e,idx)}  key={idx} value={selectedIdx}><a><span>{server.name?server.name:(server.ip)}:{server.port}</span></a></li>
                  })}
                </ul>
              </div>
            <div className='line'>下载</div>
            <NavLink className='data' style={({ isActive }) => ({ color: isActive ? '#5399e8' : '#a2b5b9' })} to="/downloading"><span className="iconfont">&#xe61d;</span>正在下载 ({globalStat.numActive ?? '0'})</NavLink>
           <NavLink className='data' style={({ isActive }) => ({ color: isActive ? '#5399e8' : '#a2b5b9' })} to="/wating"><span className="iconfont">&#xe677;</span>正在等待 ({globalStat.numWaiting ?? '0'})</NavLink>
            <NavLink className='data' style={({ isActive }) => ({ color: isActive ? '#5399e8' : '#a2b5b9' })} to="/stopped"><span className="iconfont">&#xe6bc;</span>已完成 / 已停止 ({globalStat.numStopped ?? '0'})</NavLink>
            <div className='line'>系统设置</div>
            <NavLink className='data' style={({ isActive }) => ({ color: isActive ? '#5399e8' : '#a2b5b9' })} to="/servers"><span className="iconfont">&#xe771;</span>Aria2Ng设置</NavLink>
            <NavLink className='data' style={({ isActive }) => ({ color: isActive ? '#5399e8' : '#a2b5b9' })} to="/settings"><span className="iconfont">&#xe60c;</span>Aria2设置</NavLink>
            <a className='data state'>
            <div ><span className="iconfont">&#xe60b;</span>Aria2状态
            </div>
            <div className={connectState === '已连接'? 'connected':'notconnected'}>{connectState} </div>
            </a>
            <div className='line'>速度</div>


            <div className='data'><span className="iconfont">&#xe639;</span>上传：{(globalStat.uploadSpeed/1024).toFixed(2)}KB/s</div>
            <div  className='data'><span className="iconfont">&#xe63b;</span>下载：{(globalStat.downloadSpeed/1024).toFixed(2)}KB/s</div>
          </div>
          <div className="App-header">
              <Header listComp={listComp} client={aria2}  />
            </div>
          <div className="App-right">
            
            {/* 
            // @ts-ignore
              selectedTasks={()=>{
                var active =  document.querySelectorAll('.active')
                if(active)
                // @ts-ignore
              }
                } */}
            <div>
              <Routes>
                <Route path="/downloading" element={<Downloading ref={listComp} speed={globalStat.downloadSpeed} client={aria2} />}>
                </Route>
                <Route path="/wating" element={<Waiting ref={listComp}speed={globalStat.downloadSpeed}  client={aria2} />}>
                </Route>
                <Route path="/stopped" element={<Stopped ref={listComp} speed={globalStat.downloadSpeed}  client={aria2} />}>
                </Route>
                <Route path="/new" element={<NewTask client={aria2} />}>
                </Route>
                <Route path="/settings" element={<Settings client={aria2} />}>
                </Route>
                <Route path="/servers" element={<Servers />}>
                </Route>
                <Route path="/task/detail/:gid" element={<TaskDetail client={aria2} />} />
              </Routes>
            </div>
          </div>
        </div>
      </HashRouter>
    </SelectedTasksContext.Provider>
  );
}

export default App;
