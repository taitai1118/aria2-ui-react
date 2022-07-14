import { Input, Select } from "antd"
import { useContext, useEffect, useMemo } from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Aria2Client from "./aria2-client"
import { SelectedTasksContext, useInput ,useInput1} from "./hooks"
const { TextArea } = Input;
const { Option } = Select;

export interface IProps {
  client: Aria2Client
}

export default function NewTask({ client }: IProps) {
  var [blue,setBlue] = useState('')
  let [options, setOptions] = useState<any>()
  var uris = useInput('')
  var downloadSpeed = useInput('')
  let { optionSetting, setOptionSetting,setTasksType, uriOption,setUriOption } = useContext(SelectedTasksContext)
  
  var navigate = useNavigate()
  let dir = useInput1('')
  let overwrite = useInput1()
  let conditional = useInput1()
  let allocation = useInput1()
  let parameterized = useInput1()
  let save = useInput1()
  
  useEffect(() => {
    if(client) {
      // @ts-ignore
      client.getGlobalOption().then(options => {
        setOptions(options)
      })
    }
  }, [client])


  var [torrentFile, setTorrentFile] = useState<File | null>(null)
  function onBTFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setTorrentFile(e.target.files[0] ?? null)
    }
  }
  function start() {
    debugger
    //去掉前后空格 再把非空的取出来
    var links = uris.value.split('\n').map(it=>it.trim()).filter(it => it)
    //@ts-ignore
    client.addUri(links,{
      'max-download-limit': downloadSpeed.value
    })
    navigate('/downloading')
  }

  function selectOption(){
    debugger
    setBlue('selectOption')
  }
  function selectLink(){
    setBlue('selectLink')
  }

  let links = uris.value.split('\n').map((it: any) => it.trim()).filter((it: any) => it)
  function addTask() {

    // if (torrentFile) {
    //   let reader = new FileReader()
    //   reader.onload= function () {
    //     if (typeof reader.result === 'string') {
    //       let base64Idx = reader.result.indexOf('base64')
    //       let torrentBase64 = reader.result.slice(base64Idx + 7)
    //       // @ts-ignore
    //       client.addTorrent(torrentBase64)
    //     }
    //   }
    //   reader.readAsDataURL(torrentFile)
    // } else {
    
    if (!links.length) {
      return 
    }

    let options: {[key: string]: any} = {
      'dir': dir.bind.value,
      'allow-overwrite': overwrite.bind.value,
      'max-download-limit': downloadSpeed.value,
      'conditional-get': conditional.bind.value,
      'file-allocation': allocation.bind.value,
      'parameterized-uri': parameterized.bind.value,
      'force-save': save.bind.value
    }
    
    for (let key in options) {
      if (options[key]) {
        if (options[key] === '是') {
          options[key] = true
        } else if (options[key] === '否') {
          options[key] = false
        }
      } else {
        delete options[key]
      }
    }

    for (let link of links) {
      // @ts-ignore
      client.addUri([link], {
        ...uriOption,
        ...options,
      })
    }
    // }
    navigate('/downloading')
    
  }
  return (
    // <div>
    //   <div>
    //     选项
    //     <div>下载速度：<input type="text" {...downloadSpeed}/></div>
    //   </div>
    //   <div>
    //     <div>下载链接，一行一个：</div>
    //     <div>选择bt种文件：<input type="file" onChange={onBTFileSelect}/></div>
    //     <div>
    //       <textarea cols={60} rows={10} {...uris}></textarea>
    //     </div>
    //     <button onClick={start}>开始下载</button>

    //   </div>
    // </div>
    <div className='new-task'>
    <div className='new-task-title'>
      <div onClick={selectLink} className={blue=='selectOption' ? 'notblue':'blue'}> <a>链接</a></div>
      <div onClick={selectOption}  className={blue=='selectOption' ? 'blue':'notblue'}><a>选项</a></div>
      <div><span className="iconfont">&#xe63a;</span></div>
     
      <div className={links.length?'havelinks':''}><a onClick={addTask}>立即下载</a></div>
    </div>
     {
      blue == 'selectOption' ? <div className='options' id={options == 'selectOption' ? 'selectOption' : ''}>
      <div className='options-title'>
         {/* <div>过滤器:</div>
         <div><input type='checkbox' />全局</div>
         <div><input type='checkbox' />Http</div>
         <div><input type='checkbox' />BitTorrent</div> */}
      </div>
      <div className='options-content'>
      <div className="options-content-section" style={{display: 'flex', height: '50px', lineHeight: '50px', minWidth: '700px', backgroundColor: '', borderTop: '0px solid #ddd'}}>
        <div style={{width: '25%', paddingLeft: '15px', minWidth: '308px'}}>下载路径(dir)</div>
        <div style={{width: '100px', flexShrink: '1'}}></div>
        <div style={{display: 'flex', lineHeight: '50px', alignItems: 'center', flexGrow: '1', paddingRight: '20px', minWidth: '660px'}}>
        <Input spellCheck='false' placeholder={options && options.dir} {...dir.bind}></Input>
        </div>
      </div>
      <div className="options-content-section" style={{display: 'flex', height: '50px', lineHeight: '50px', minWidth: '700px', backgroundColor: '#F9F9F9', borderTop: '1px solid #ddd'}}>
        <div style={{width: '25%', paddingLeft: '15px', minWidth: '308px'}}>允许覆盖(allow-overwrite)</div>
        <div style={{width: '100px', flexShrink: '1'}}></div>
        <div style={{display: 'flex', lineHeight: '50px', alignItems: 'center', flexGrow: '1', paddingRight: '20px', minWidth: '660px'}}>
        <Select {...overwrite.bind} style={{width: '100%'}} placeholder="否">
              <Option value="是">是</Option>
              <Option value="否">否</Option>
            </Select>
        </div>
      </div>
      <div className="options-content-section" style={{display: 'flex', height: '50px', lineHeight: '50px', minWidth: '700px', backgroundColor: '', borderTop: '1px solid #ddd'}}>
        <div style={{width: '25%', paddingLeft: '15px', minWidth: '308px'}}>最大下载速度(max-download-limit)</div>
        <div style={{width: '100px', flexShrink: '1'}}></div>
        <div style={{display: 'flex', lineHeight: '50px', alignItems: 'center', flexGrow: '1', paddingRight: '20px', minWidth: '660px'}}>
        <Input spellCheck='false' {...downloadSpeed} defaultValue={0} placeholder="0" addonAfter='字节'></Input>

        </div>
      </div>
      <div className="options-content-section" style={{display: 'flex', height: '50px', lineHeight: '50px', minWidth: '700px', backgroundColor: '#F9F9F9', borderTop: '1px solid #ddd'}}>
        <div style={{width: '25%', paddingLeft: '15px', minWidth: '308px'}}>条件下载(conditional-get)</div>
        <div style={{width: '100px', flexShrink: '1'}}></div>
        <div style={{display: 'flex', lineHeight: '50px', alignItems: 'center', flexGrow: '1', paddingRight: '20px', minWidth: '660px'}}>
        <Select {...conditional.bind} style={{width: '100%'}} placeholder="否">
              <Option value="是">是</Option>
              <Option value="否">否</Option>
            </Select>
        </div>
      </div>
      <div className="options-content-section" style={{display: 'flex', height: '50px', lineHeight: '50px', minWidth: '700px', backgroundColor: '', borderTop: '1px solid #ddd'}}>
        <div style={{width: '25%', paddingLeft: '15px', minWidth: '308px'}}>文件支配方法(file-allocation)</div>
        <div style={{width: '100px', flexShrink: '1'}}></div>
        <div style={{display: 'flex', lineHeight: '50px', alignItems: 'center', flexGrow: '1', paddingRight: '20px', minWidth: '660px'}}>
        <Select {...allocation.bind} style={{width: '100%'}} placeholder="prealloc">
              <Option value="无">无</Option>
              <Option value="prealloc">prealloc</Option>
              <Option value="trunc">trunc</Option>
              <Option value="falloc">falloc</Option>
            </Select>
        </div>
      </div>
      <div className="options-content-section" style={{display: 'flex', height: '50px', lineHeight: '50px', minWidth: '700px', backgroundColor: '#F9F9F9', borderTop: '1px solid #ddd'}}>
        <div style={{width: '25%', paddingLeft: '15px', minWidth: '308px'}}>启用参数化URI支持(parameterized-uri)</div>
        <div style={{width: '100px', flexShrink: '1'}}></div>
        <div style={{display: 'flex', lineHeight: '50px', alignItems: 'center', flexGrow: '1', paddingRight: '20px', minWidth: '660px'}}>
        <Select {...parameterized.bind} style={{width: '100%'}} placeholder="否">
              <Option value="是">是</Option>
              <Option value="否">否</Option>
            </Select>
        </div>
      </div>
      <div className="options-content-section" style={{display: 'flex', height: '50px', lineHeight: '50px', minWidth: '700px', backgroundColor: '', borderTop: '1px solid #ddd'}}>
        <div style={{width: '25%', paddingLeft: '15px', minWidth: '308px'}}>强制保存(force-save)</div>
        <div style={{width: '100px', flexShrink: '1'}}></div>
        <div style={{display: 'flex', lineHeight: '50px', alignItems: 'center', flexGrow: '1', paddingRight: '20px', minWidth: '660px'}}>
        <Select {...save.bind} style={{width: '100%'}} placeholder="否">
              <Option value="是">是</Option>
              <Option value="否">否</Option>
            </Select>
        </div>
      </div>
      </div>
      </div>

      : <div className='new-task-table' id={options == 'selectOption' ? 'selectThatOption' : ''}>
      <div className='new-task-hint' >下载链接：</div>
      <div className='new-task-link'><textarea placeholder='支持多个 URL 地址, 每个地址占一行.' {...uris}></textarea></div>
      </div>
      
      
     }
  </div>
  )
}


