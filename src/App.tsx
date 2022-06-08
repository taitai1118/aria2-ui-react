import React, { useMemo, Component } from 'react';
import './App.css';
import { HashRouter, NavLink, Routes, Route, useLocation } from 'react-router-dom'

import Aria2Client from './aria2-client';
import Downloading from './Downloading';
import Waiting from './Waiting';
import NewTask from './NewTask';
import Header from './Header';
import Stopped from './Stopped';
import { useState } from 'react';
import TaskDetail from './TaskDetail';
import { SelectedTasksContext } from './hooks';
import { useRef } from 'react';
import Settings from './Settings';
import Servers from './Servers';
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// @ts-ignore
globalThis.Aria2Client = Aria2Client


function App() {
  var currentServerIdx = useMemo(() => localStorage.currentServerIdx ?? 0, [])

  var [connectState, setConnectState] = useState('连接中...')
  var [selectedIdx, setSelectedIdx] = useState('0')
  var [globalStat, setGlobalStat] = useState<any>({})

  var aria2Servers = useMemo(() => {
    return JSON.parse(localStorage.ARIA2_SERVERS ?? '[]')
  }, [])

  var [aria2, setAria2] = useState(
    useMemo(() => {
      var server = aria2Servers[currentServerIdx]
      var aria2 = new Aria2Client(server.ip, server.port, server.secret)
      // var aria2 = new Aria2Client('127.0.0.1', '11000', '111222333')

      return aria2
    }, [])
  )

  useEffect(() => {

    aria2.ready().then(() => {
      setConnectState('已连接')
    }, () => {
      setConnectState('连接失败')
    })


    var id: NodeJS.Timer
    aria2.ready().then(() => {
      id = setInterval(() => {
        // @ts-ignore
        aria2.getGlobalStat().then(stat => {
          setGlobalStat(stat)
          console.log(stat)
        })
      }, 1000)
    })

    // @ts-ignore
    globalThis.toast = toast

    async function onComplete(taskInfo: any) {
      // @ts-ignore
      var task = await aria2.tellStatus(taskInfo.gid)

      toast('有任务下载完成了', task.files[0].path)
    }
    aria2.ready().then(() => {
      aria2.on('DownloadComplete', onComplete)
    })

    return () => {
      clearInterval(id)
      aria2.off('DownloadComplete', onComplete)
      // 解绑事件的同时还应该销毁aria2对象，如里面的websocket连接
    }

  }, [aria2])

  var [selectedTasks, setSelectedTasks] = useState([])

  var listComp = useRef()

  function changeServer(e: React.ChangeEvent<HTMLSelectElement>) {
    var idx = e.target.value
    setSelectedIdx(idx)

    var server = aria2Servers[idx]
    setConnectState('连接中...')
    var aria2 = new Aria2Client(server.ip, server.port, server.secret)
    setAria2(aria2)
  }

  return (
    <SelectedTasksContext.Provider value={{ selectedTasks, setSelectedTasks }}>
      <ToastContainer />
      <HashRouter>
        <div className="App">
          <div className="App-left">
            <select onChange={changeServer} value={selectedIdx}>
              {
                aria2Servers.map((server: any, idx: number) => {
                  return <option key={idx} value={idx}>{server.ip}:{server.port}</option>
                })
              }
            </select>
            <div>{connectState}</div>
            <div><NavLink style={({ isActive }) => ({ color: isActive ? 'red' : '' })} to="/downloading">下载中({globalStat.numActive})</NavLink></div>
            <div><NavLink style={({ isActive }) => ({ color: isActive ? 'red' : '' })} to="/wating">等待中({globalStat.numWaiting})</NavLink></div>
            <div><NavLink style={({isActive}) => ({color: isActive ? 'red' : ''})} to="/stopped">已完成({globalStat.numStoppedTotal})</NavLink></div>
            <div><NavLink style={({isActive}) => ({color: isActive ? 'red' : ''})} to="/settings">设置</NavLink></div>
            <div><NavLink style={({isActive}) => ({color: isActive ? 'red' : ''})} to="/servers">服务器</NavLink></div>

            <hr />

            <div>上传：{globalStat.uploadSpeed}B/s</div>
            <div>下载：{globalStat.downloadSpeed}B/s</div>
          </div>
          <div className="App-right">
            <div className="App-header">
              <Header listComp={listComp}/>
            </div>
            <div>
              <Routes>
                <Route path="/downloading" element={<Downloading client={aria2}/>}>
                </Route>
                <Route path="/wating" element={<Waiting  client={aria2}/>}>
                </Route>
                <Route path="/stopped" element={<Stopped ref={listComp} client={aria2}/>}>
                </Route>
                <Route path="/new" element={<NewTask client={aria2}/>}>
                </Route>
                <Route path="/settings" element={<Settings client={aria2}/>}>
                </Route>
                <Route path="/servers" element={<Servers/>}>
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
