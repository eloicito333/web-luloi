"use client"

import { onMessageListener } from '@/lib/firebase.client';
import React, {useState, useEffect} from 'react'
import toast, { Toaster } from 'react-hot-toast';

const Notification = () => {
  const [notification, setNotification] = useState({title: '', body: ''});
  const notify = () =>  toast(<ToastDisplay/>);
  function ToastDisplay() {
    return (
      <div>
        <p><b>{notification?.title}</b></p>
        <p>{notification?.body}</p>
      </div>
    );
  };

  useEffect(() => {
    try{
      if(window === undefined) return
      if (notification?.title ){
      notify()
      onMessageListener()
      .then((payload) => {
        setNotification({title: payload?.notification?.title, body: payload?.notification?.body});     
      })
      .catch((err) => console.log('failed: ', err));
      }
    } catch {}
  }, [notification])


  try{if (window === undefined || navigator === undefined) return (<div></div>)} catch{}

  return (
     <Toaster/>
  )
}

export default Notification