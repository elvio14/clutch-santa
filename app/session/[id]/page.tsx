"use client"
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { getUsersBySessionID } from "@/app/actions";


export default function Dashboard(){
  const router = useRouter()
   
  const params = useParams<{id: string}>()

  const [users, setUsers] = useState<object>()

  const getUsers = async () =>{
    const id = params?.id
    if(!id){
        console.error("ID not found")
        return
    }
    
    const result = await getUsersBySessionID(id)

    setUsers(result)
    console.log(users)
  }

  useEffect(() => {
    getUsers()
  }, [])
  
  return(
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
           <div>Dashboard</div>
           <div> 
            <p>id: {params?.id}</p>
           </div>
      </div>
  )
}