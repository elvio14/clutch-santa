"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation'
import { createUser } from "@/app/actions"
import { useState } from "react"
import { Span } from "next/dist/trace"



const formSchema = z.object({
    sessionID: z.string(),

    username: z.string().min(4, {
      message: "Username must be at least 4 characters."
    }).max(20, {
      message: "Username must not exceed 20 characters."
    }).regex(/^(?=.*\d).+$/, {
      message: "Username must include at least one number character."
    }),

    displayName: z.string().min(3, {
      message: "Display name must be at least 3 characters."
    }).max(20, {
      message: "Display name must not exceed 12 characters."
    }),

    password: z.string().min(8, {
      message: "Password must be at least 8 characters."
    }).regex(/^(?=.*\d)(?=.*[^a-zA-Z\d]).+$/, {
      message: "Password must include at least one number and one non-letter character."
    }),
  })

export default function Make(){
    const [loading, setLoading] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          sessionID: "",
          username: "",
          password: "",
          displayName: ""
        },
      })
      const router = useRouter()
      async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        setLoading(true)
        let id
        try{
        await createUser(values.username, values.displayName, values.password, values.sessionID)
        } finally {
          router.push(`/dashboard/${values.username}`)
        }
      }
    return (
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
           <div>Join a Secret Santa Session:</div>
           <div> 
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 justify-items-center">
                    <FormField
                      control={form.control}
                      name="sessionID"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Secret Santa ID</FormLabel>
                          <FormControl>
                            <Input placeholder="ID of the session" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Andy14.. etc" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Password Field */}
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Enter your password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="displayName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Display Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Andy, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Join</Button>
                </form>
            </Form>
           </div>
           <div>{loading ? (<p>Creating user...</p>) : (<p></p>)}</div>
      </div>        
    )       
}       