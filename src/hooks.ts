import React from "react";
import { useRef } from "react";
import { useCallback, useEffect, useState } from "react";
import Aria2Client from "./aria2-client";


export function useInput(init = "") {
  var [value, setValue] = useState(init);

  function onChange(e: any) {
    var target = e.target;

    setValue(target.value);
  }

  function clear() {
    setValue("");
  }

  var ret = {
    value,
    onChange: useCallback(onChange, [])
    // clear: useCallback(clear, []),
  };

  Object.defineProperty(ret, "clear", {
    value: useCallback(clear, []),
  });

  return ret;
}

export function useTasks(client: Aria2Client, interval: number, state: 'Active' | 'Waiting' | 'Stopped') {
  var [tasks, setTasks] = useState<any[]>([])

  useEffect(() => {
    var id = setInterval(() => {
      client.ready().then(client => {
        // @ts-ignore
        client['tell' + state](0, 100).then(tasks => {
          setTasks(tasks)
        })
      })
    }, interval)

    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    client.ready().then(client => {
      // @ts-ignore
      client['tell' + state](0, 100).then(tasks => {
        setTasks(tasks)
        console.log(tasks)
      })
    })
  }, [])

  return tasks
}

export function useTasks2(getTasks: () => Promise<any[]>, interval: number, client?: Aria2Client) {
  var [tasks, setTasks] = useState<any[]>([])

  var ref = useRef<typeof getTasks>(getTasks)

  ref.current = getTasks

  useEffect(() => {
    setTasks([])
  }, [client])

  useEffect(() => {
    ref.current().then(tasks => {
        setTasks(tasks)
    })

    var id = setInterval(() => {
      ref.current().then(tasks => {
        setTasks(tasks)
      })
    }, interval)

    return () => {
      clearInterval(id)
    }
  }, [client])

  return tasks
}


export const useAsync = (asyncFunction: () => Promise<any>, immediate = true) => {
  const [pending, setPending] = useState<boolean>(false);
  const [value, setValue] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  // useCallback ensures useEffect is not called on every render, but only if asyncFunction changes.
  const execute = useCallback(() => {
    setError(null);
    setPending(true);
    setValue(null);

    return asyncFunction()
      .then((response: any) => setValue(response))
      .catch((err: any) => setError(err))
      .finally(() => setPending(false));
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    error, execute, pending, value,
  };
};

export const SelectedTasksContext = React.createContext<{selectedTasks: any[], setSelectedTasks: Function}>({
  selectedTasks: [],
  setSelectedTasks: (tasks: any[]) => { },
})
SelectedTasksContext.displayName = 'SelectedTasksContext'
