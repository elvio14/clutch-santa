"use client"
import { useEffect, useState } from "react"
import AddWish from "./addwish"
import { useRouter } from "next/navigation"

export default function Wishlist({data, render, add, userID}: {data: object, render: boolean, add: boolean, userID?: string}){
    const router = useRouter()
    const [wishes, setWishes] = useState<any>(null)
    const [adding, setAdding] = useState<boolean>(false)

    useEffect(()=>{
        setWishes(data)
    },[])

    function handleBack(){
        setAdding(false)
        router.refresh()
    }

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
            {wishes?.map((item: any, index: number) => (
                <div key={item.wishname + 'grid' + index} className="grid grid-cols-[40vw_50px] 2 gap-4 bg-white/50 rounded-lg p-4">
                    <div key={item.wishname + index}>{item.wishname}</div>
                    <div className="cursor-pointer" key={item.wishname + 'link' + index}><a href={item.link} target="_blank">Link</a></div>
                </div>
            ))}
        </div>
    )}
}