/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Socket } from "socket.io-client";
import { IUser } from "../Components/Body/Body";

export const useAddHandler = () => {
  const [handleInput, setHandleInput] = useState<string>("");
  const [handle, setHandle] = useState<string[]>([]);

  function addHandler() {
    if (handleInput != "") {
      setHandle([...handle, handleInput]);
      setHandleInput("");
    }
  }

  return { handle, handleInput, setHandle, setHandleInput, addHandler };
};

export const useHandleDepthChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const [depth, setDepth] = useState<any>(200);
  const newValue = e.target.valueAsNumber;
  function handleDepthChange() {
    setDepth(newValue);
  }
  return { depth, setDepth, handleDepthChange };
};

export const useChangeHandleInput = (
  setError: React.Dispatch<any>,
  addHandler: () => void,
  setHandleInput: React.Dispatch<React.SetStateAction<string>>
) => {
  function changeHandleInput(e: any) {
    setError(null);
    if (e.key === "Enter") {
      addHandler();
      return;
    }
    setHandleInput(e.target.value);
  }

  return { changeHandleInput };
};

export const useDeleteHandle = (
  handle: string[],
  setHandle: React.Dispatch<React.SetStateAction<string[]>>
) => {
  const deleteHandle = (h: string) => {
    setHandle(handle.filter((e) => e != h));
  };

  return { deleteHandle };
};

export const useHandleCancel = (
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<any>,
  socket: Socket<any, any> | undefined,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setProgress: React.Dispatch<React.SetStateAction<number>>
) => {
  const handleCancel = () => {
    setSuccess(true);
    if (socket) socket.emit("stop", true);
    else setError("Couldn't cancel request");
    setIsLoading(false);
    setProgress(0);
  };

  return { handleCancel };
};

export const useHandleSubmit = (
  handle: string[],
  descriptionInput: string,
  count: any,
  depth: number,
  socket: Socket<any, any> | undefined,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<any>,
  setUsers: React.Dispatch<React.SetStateAction<IUser[]>>,
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const handleSubmit = async () => {
    setSuccess(false);
    const requestBody = {
      handle,
      descriptionInput,
      count,
    };
    console.log(requestBody);

    if (handle.length > 0 && descriptionInput != "") {
      setIsLoading(true);
      setError(null);
      setUsers([]);

      if (socket) {
        setIsLoading(true);
        socket.emit("get_users", {
          query: descriptionInput,
          user_list: handle,
          user_limit: count,
          depth: depth,
        });
      }
    } else {
      setError("Empty handles or description!");
      setSuccess(false);
    }
  };

  return { handleSubmit };
};