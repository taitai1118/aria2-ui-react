import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { useAsync } from "./hooks";
import { IProps } from "./NewTask";



export default function TaskDetail({client}: IProps) {
  var params = useParams()
  var { pending, value: task } = useAsync(useCallback(async () => {
    // debugger
    // @ts-ignore
    var task = await client.tellStatus(params.gid)
    console.log(task)
    return task
  }, []))



  if (task) {
    return (
      <div>
        <div>
          <h3>总览</h3>
          <div>任务名称: {task!.files[0].path}</div>
        </div>
        <div>
          <h3>区块信息</h3>
        </div>
        <div>
          <h3>总览</h3>
        </div>
      </div>
    )
  }
  if (pending) {
    return <div>loading...</div>
  }
  return null
}
