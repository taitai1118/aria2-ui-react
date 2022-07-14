import { Button, Form, Input, Select } from "antd";
import { dir } from "console";
// import { dir, log } from "console";
import { memo, useContext, useEffect } from "react";
import { useCallback, useState } from "react";
import {ToastContainer, toast} from 'react-toastify'
import { SelectedTasksContext, useAsync, useInput1 } from "./hooks";
import { IProps } from "./NewTask";
let {Option} = Select


function Settings({ client }: IProps) {
  let { optionSetting, setOptionSetting,setTasksType, uriOption,setUriOption } = useContext(SelectedTasksContext)

  var [option, setOption] = useState<any>(null)
  let dir = useInput1('')
  let downloadSpeed = useInput1('')
  let maxDown = useInput1('')
  let log = useInput1('')
  let integrity = useInput1('否')
  let resume = useInput1('否')
  useEffect(() => {
    // @ts-ignore
    client.getGlobalOption().then(options => {
      setOption(options)
    })
  }, [])
  useEffect(() => {
    setOptionSetting(true)
    setTasksType('')
  }, [setTasksType, setOptionSetting])
  async function saveOption() {
    // @ts-ignore
    client.changeGlobalOption(option)
  }
  function save(e: any) {
    let globalOption1: {
      [key: string]: any
    } = {
      'dir': dir.bind.value,
      'check-integrity': integrity.bind.value,
      'continue': resume.bind.value
    }
    for (let key in globalOption1) {
      if (globalOption1[key]) {
        if (globalOption1[key] === '是') {
          globalOption1[key] = true
        } else if (globalOption1[key] === '否') {
          globalOption1[key] = false
        }
      } else {
        delete globalOption1[key]
      }
    }
    let globalOption2: {
      [key: string]: any
    } = {
      'max-concurrent-downloads': maxDown.bind.value,
      'log': log.bind.value
    }
    for (let key in globalOption2) {
      if (!globalOption2[key]) {
        delete globalOption2[key] 
      }
    }

    setUriOption(globalOption1)
    // @ts-ignore
    client?.changeGlobalOption(globalOption2)
    // @ts-ignore
    client?.changeGlobalOption(globalOption1).then(() => toast('保存成功'))
  }
  // function setOneOption(e: React.ChangeEvent<HTMLInputElement>, key: string) {
  //   setOption({
  //     ...option,
  //     [key]: e.target.type == 'text' ? e.target.value : e.target.checked ? 'true' : 'false'
  //   })
  // }

  //  const [componentSize, setComponentSize] = useState('default');
  //  //@ts-ignore
  //  const onFormLayoutChange = ({ size }) => {
  //    setComponentSize(size);
  //  };
   
   return (
    <div>
      <ToastContainer></ToastContainer>
      <div style={{display: 'flex', height: '50px', lineHeight: '50px', minWidth: '700px', backgroundColor: '#F9F9F9', borderTop: '0px solid #ddd'}}>
        <div style={{width: '25%', paddingLeft: '15px', minWidth: '308px'}}>下载路径(dir)</div>
        <div style={{width: '100px', flexShrink: '1'}}></div>
        <div style={{display: 'flex', lineHeight: '50px', alignItems: 'center', flexGrow: '1', paddingRight: '20px', minWidth: '660px'}}>
          <Input spellCheck='false' {...dir.bind} placeholder={option && option.dir}></Input>
        </div>
      </div>
      <div style={{display: 'flex', height: '50px', lineHeight: '50px', minWidth: '700px', backgroundColor: '#FFFFFF', borderTop: '1px solid #ddd'}}>
        <div style={{width: '25%', paddingLeft: '15px', minWidth: '308px'}}>日志文件(log)</div>
        <div style={{width: '100px', flexShrink: '1'}}></div>
        <div style={{display: 'flex', lineHeight: '50px', alignItems: 'center', flexGrow: '1', paddingRight: '20px', minWidth: '660px'}}>
          <Input spellCheck='false'{...log.bind} placeholder={option && option['log']}></Input>
        </div>
      </div>
      <div style={{display: 'flex', height: '50px', lineHeight: '50px', minWidth: '700px', backgroundColor: '#F9F9F9', borderTop: '1px solid #ddd'}}>
        <div style={{width: '25%', paddingLeft: '15px', minWidth: '308px'}}>最大同时下载数(max-concurrent-downloads)</div>
        <div style={{width: '100px', flexShrink: '1'}}></div>
        <div style={{display: 'flex', lineHeight: '50px', alignItems: 'center', flexGrow: '1', paddingRight: '20px', minWidth: '660px'}}>
          <Input spellCheck='false'{...maxDown.bind}  placeholder={option && option['max-concurrent-downloads']}></Input>
        </div>
      </div>



      <div style={{display: 'flex', height: '50px', lineHeight: '50px', minWidth: '700px', backgroundColor: '#F9F9F9', borderTop: '1px solid #ddd'}}>
        <div style={{width: '25%', paddingLeft: '15px', minWidth: '308px'}}>检查完整性(check-integrity)</div>
        <div style={{width: '100px', flexShrink: '1'}}></div>
        <div style={{display: 'flex', lineHeight: '50px', alignItems: 'center', flexGrow: '1', paddingRight: '20px', minWidth: '660px'}}>
          <Select style={{width: '100%'}} {...integrity.bind} placeholder="否">
            <Option value="是">是</Option>
            <Option value="否">否</Option>
          </Select>
        </div>
      </div>

      <div style={{display: 'flex', height: '50px', lineHeight: '50px', minWidth: '700px', backgroundColor: '#F9F9F9', borderTop: '1px solid #ddd'}}>
        <div style={{width: '25%', paddingLeft: '15px', minWidth: '308px'}}>断点续传(continue)</div>
        <div style={{width: '100px', flexShrink: '1'}}></div>
        <div style={{display: 'flex', lineHeight: '50px', alignItems: 'center', flexGrow: '1', paddingRight: '20px', minWidth: '660px'}}>
          <Select style={{width: '100%'}} {...resume.bind}  placeholder="否">
            <Option value="是">是</Option>
            <Option value="否">否</Option>
          </Select>
        </div>
      </div>

      <Button style={{margin: '10px'}} type="primary"  onClick={save}>保存</Button>


      {/* <h2>设置</h2>
      {options &&
        Object.entries(options).map(([key, val]: any[]) => {
          return <div key={key}>
            <span>{key}</span>
            {val === 'true' || val === 'false'
              ? <input type="checkbox" checked={val === 'true'} onChange={(e) => setOneOption(e, key)}/>
              : <input type="text" value={val} onChange={(e) => setOneOption(e, key)}/>
            }
          </div>
        })
      }
      {options &&
        <button onClick={save}>保存</button>
      } */}
    </div>
  )
}

export default memo(Settings)
