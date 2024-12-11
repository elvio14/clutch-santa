"use client"
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { getUsersBySessionID, setGiving } from "@/app/actions";

interface Pair {
  from: string,
  to: string,
  toName: string
}

export default function Dashboard(){
  const router = useRouter()
   
  const params = useParams<{id: string}>()

  const [users, setUsers] = useState<any[]>()

  const [pairs, setPairs] = useState<Pair[]>()

  const [randomizing, setRandomizing] = useState<boolean>(false)

  const getUsers = async () =>{
    const id = params?.id
    if(!id){
        console.error("ID not found")
        return
    }
    
    const result = await getUsersBySessionID(id)

    if(result !== undefined){
      setUsers(result)
    }
    console.log(users)
  }

  const mapUsernames = () => {
    users?.forEach((item) => {
      const newPair: Pair = { from: item.username, to: item.to, toName: ""}
      setPairs((prev) => [...(prev ?? []), newPair])
    })
  }

  const initGiving = async () => {
    console.log("running initGiving")
    pairs?.forEach(async (pair) => {
      console.log("initGiving on" + pair.from + "to " + pair.to)
      console.log("to" + pair.to)
      const resu = await setGiving(pair.from, pair.to)
      if (!resu) {
        console.log("failed setGiving from" + pair.from +"to"+pair.to)
      }
    })
    setRandomizing(false)
  }

  const initPairRandom = () => {
    setRandomizing(true)
    const arrayOfTo: string[] = []
    pairs?.forEach((pair) => {
      arrayOfTo.push(pair.from)
    })
    
    const shuffled = [...(arrayOfTo || [])]; // Copy the state array
    for (let i = shuffled.length - 1; i > 0; i--) {
      let j;
      do {
        j = Math.floor(Math.random() * (i + 1)); // Random index
      } while (j === i); // Ensure j is not the same as i
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
    }

    shuffled.forEach((to, index) => {
      setPairs((prevPairs) => {
        const updatedPairs = [...(prevPairs || [])]; // Create a copy of the array
        updatedPairs[index] = { ...updatedPairs[index], to: to }; // Update the item at the given index
        return updatedPairs; // Return the updated array
      })
    })

    getUsers()
  }

  const getDisplayName = (username: string) => {
    const user = users?.find((item) => item.username === username)

    return user.displayName
  }

  useEffect(() => {
    getUsers()

  }, [])

  useEffect(() => {
    if(users !== null){
      mapUsernames()
    }
  }, [users])
  
  useEffect(() => {
    if(pairs !== null) {
      initGiving()
    }
  }, [pairs])
  return(
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
          <div className="flex flex-col gap-4 items-center"><p>Session Dashboard</p><Button onClick={() => initPairRandom()}>Draw Secret Santa</Button></div>
          <div> 
    
            <p>{randomizing ? "Drawing a randomized Secret Santa... Please wait..." : "" }</p>
            <div>
              <div className="grid grid-cols-[1fr_1fr_1fr] gap-16">
                {users?.map((item) => (
                  <div key={item.username} className="bg-white/50 rounded-lg p-4">
                    <p><b>{item.displayName}</b></p>
                    <p>Username: {item.username}</p><br />
                    <p>Giving to: <b>{item.giving == "" ? "None" : getDisplayName(item.giving)}</b></p>
                  </div>
                ))}
              </div>
            </div> 
          </div>
          <div>
            <p>id: {params?.id}</p>
          </div>

      </div>
  )
}