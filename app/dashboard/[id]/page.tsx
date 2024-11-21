"use client"
import { Button } from "@/components/ui/button";
import { act, useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { getUserData } from "@/app/actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Wishlist from "@/components/wishlist";



export default function Dashboard(){
  const params = useParams<{id: string}>()
  const router = useRouter()
  async function getData(id: string){
    const resu = await getUserData(id)
    setData(resu)
    console.log(data)
  }

  useEffect(()=>{
    const passHash = sessionStorage.getItem("token")
    if(params !== null){
      getData(params.id)
    }
    if(data !== null){
      if(passHash !== data.password){
        router.push(`/dashboard/login`)
      }
    }
  }, [])

  const [loading, setLoading] = useState<boolean>(true)

  const [data, setData] = useState<any>(null)

  const [giving, setGiving] = useState<any>(null)

  const [activeTab, setActiveTab] = useState<boolean>(true)

  async function getGiving(id: string){
    const resu = await getUserData(id)
    setGiving(resu)
    console.log(giving)
  }

  useEffect(()=>{
    if(data !== null){
      getGiving(data.giving)
      setLoading(false)
    }
  }, [data])

  if (loading) {
    return (
      <div>Loading...</div>
    )
  } else
  return(
      <div className="w-full max-w-screen-lg sm:max-w-none grid grid-rows-[1fr_3fr] items-center
       justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
          <div className="items-center justify-items-center">
            {data ? (
              <pre>
                <>Ho Ho Hello, <strong>{data.displayName}</strong> !</>
                <div>{data.giving === "" ?
                  <>Your session hasn't drawn the Secret Santa yet..</>
                 : 
                  <>You are the Secret Santa to <strong>{giving?.displayName}</strong> !</>
                }</div>
                </pre>
            ) : (
              <p>Loading...</p>
            )}
            <br></br>
            {giving === "null" ? (
              <>Loading...</>
            ) : (
              data.giving !== "" ? (
              <Tabs defaultValue="giver" className="items-center justify-items-center">
                <TabsList>
                  <TabsTrigger value="giver" onClick={()=>setActiveTab(true)} >Your Wish List</TabsTrigger>
                  <TabsTrigger value="giving" onClick={()=>setActiveTab(false)}>{giving?.displayName}'s Wish List</TabsTrigger>
                </TabsList>
              </Tabs>
              ):(
              <Tabs defaultValue="giver" className="items-center justify-items-center">
                <TabsList>
                  <TabsTrigger value="giver">Your Wish List</TabsTrigger>
                </TabsList>
              </Tabs>
            )
            )
            }
          </div>
          <div> 
            <Wishlist data={data.wishes} render={activeTab} add={true} userID={params?.id}/>
            <Wishlist data={giving?.wishes} render={!activeTab} add={false} userID={giving?.id}/>
          </div>
      </div>
  )
}