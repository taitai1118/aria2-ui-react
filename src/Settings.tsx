import { useEffect } from "react";
import { useCallback, useState } from "react";
import { useAsync } from "./hooks";
import { IProps } from "./NewTask";


var aria2OptionNameMap: any = {
  'always-resume': '始终恢复',
  'max-download-limit': '最大下载速度',
}


export default function Settings({client}: IProps) {
  var [option, setOption] = useState<any>(null)

  useEffect(() => {
    // @ts-ignore
    client.getGlobalOption().then(options => {
      setOption(options)
    })
  }, [])

  async function saveOption() {
    // @ts-ignore
    client.changeGlobalOption(option)
  }

  function setOneOption(e: React.ChangeEvent<HTMLInputElement>, key: string) {
    setOption({
      ...option,
      [key]: e.target.type == 'text' ? e.target.value : e.target.checked ? 'true' : 'false'
    })
  }

  if (option) {
    return (
      <div>
        <h2>设置</h2>
        {
          Object.entries(option).map(
            ([key, val]: [string, any]) => {
              return (
                <div>
                  <span>{aria2OptionNameMap[key] ?? key}</span>
                  {val == 'true' || val == 'false'
                    ? <input type="checkbox" checked={val == 'true'} onChange={(e) => setOneOption(e, key)}/>
                    : <input type="text" value={val} onChange={(e) => setOneOption(e, key)}/>
                  }
                </div>
              )
            }
          )
        }
        <button onClick={saveOption}>保存</button>
      </div>
    )
  }

  return <div>loading options...</div>
}
