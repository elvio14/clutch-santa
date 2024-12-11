"use client"
import { useEffect, useState } from "react"
import AddWish from "./addwish"
import { useRouter } from "next/navigation"
import { Divide } from "lucide-react";


interface Metadata {
    title: string;
    ogTitle: string;
    ogImage: string;
  }
  
  interface Wish {
    wishname: string;
    link: string;
  }

export default function Wishlist({data, render, add, userID}: {data: Wish[], render: boolean, add: boolean, userID?: string}){
    const router = useRouter()
    const [adding, setAdding] = useState<boolean>(false)
    const [wishes, setWishes] = useState<Wish[]>();
    const [metadatas, setMetas] = useState<Metadata[] | null>(null)

    useEffect(()=>{
        setWishes(data)
    },[])

    function handleBack(){
        setAdding(false)
        router.refresh()
    }

    async function getMetadata(url: string){
        try{
            const response = await fetch('/api/scraper?url=' + encodeURIComponent(url), {
                method: 'GET'
            })
            if(!response.ok){
                throw new Error('Failed fetching metadata from client')
            }
            const data = await response.json()
            return data
        }catch (e: any){
            console.error(e)
            return null
        }
    }

    async function getMetaForEach(obj: Wish[]){
        if (obj) {
            for (const item of obj) {
                const meta = await getMetadata(item.link)
                if(meta !== null){
                    setMetas((prev) => [...(prev ?? []), meta])
                }else{
                    const emptyMeta: Metadata = {
                        title: "No title found.",
                        ogTitle: "No OG title found",
                        ogImage: "No OG image found",
                    }
                    setMetas((prev) => [...(prev ?? []), emptyMeta])
                }
            }
        }
    }

    useEffect(()=>{
        if(wishes !== undefined){
            getMetaForEach(wishes)
        }   
    },[wishes])

    if(!render){
        return <></>
    }else
    if(wishes === null) {
        return <div>Loading wishes...</div>
    }else if(adding){
        return <div className="flex flex-col gap-4"><AddWish userID={userID}/><a className="text-center" onClick={()=> handleBack()}>Back</a></div>
    }else {
    return (
        <div className="w-full max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-4">
            {add && <div onClick={()=>setAdding(true)} className="grid grid-cols-[1fr] 2 gap-4 bg-none border-2 border-white/50 rounded-lg p-4 text-center cursor-pointer hover:bg-green-300/50">
                + Add Wish
            </div>}
            {wishes?.map((item: any, index: number) =>(
                <div key={item.wishname + 'grid' + index} className="grid grid-cols-[2fr_1fr_1fr_0.4fr_0.4fr] w-[60vw] gap-4 bg-white/50 rounded-lg p-4">
                    <div className="rounded-lg bg-white overflow-hidden relative">{metadatas && metadatas[index] && metadatas[index].ogImage ?
                        <img src={metadatas[index].ogImage} alt={item.wishname + " image"} className="w-full h-full object-contain" ></img>
                        :
                        <img src="/loading_image.png" alt="Loading..." className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 animate-spinWithCentering" />
                    }</div>
                    <div key={item.wishname + index} className="overflow-auto h-64 w-64 scrollbar-hide">{item.wishname}</div>
                    <div className="overflow-scroll h-64 w-64 scrollbar-hide"> {metadatas && metadatas[index] && metadatas[index].ogImage ? metadatas[index].ogTitle : "Fetching title..."}</div>
                    <div className="cursor-pointer" key={item.wishname + 'link' + index}><a href={item.link} target="_blank">[Link]</a></div>
                    {add ? <img src="/delete_icon.svg" alt="delete icon" className="w-1/2 cursor-pointer"></img> : ""}
                </div>
            )
        )}
        </div>
    )}
}