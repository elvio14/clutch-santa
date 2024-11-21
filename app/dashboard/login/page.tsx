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
import { useParams, useRouter } from 'next/navigation'
import { hashPass} from "@/app/actions"
import { useState } from "react"


const formSchema = z.object({
    username: z.string().min(4, {
      message: "Username must be at least 4 characters."
    }).max(20, {
      message: "Username must not exceed 20 characters."
    }).regex(/^(?=.*\d).+$/, {
      message: "Username must include at least one number character."
    }),

    password: z.string().min(8, {
      message: "Password must be at least 8 characters."
    }).regex(/^(?=.*\d)(?=.*[^a-zA-Z\d]).+$/, {
      message: "Password must include at least one number and one non-letter character."
    }),
  })

export default function Login(){
    const [loading, setLoading] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          username: "",
          password: ""
        },
      })
    const router = useRouter()
    
    async function onSubmit(values: z.infer<typeof formSchema>) {
      setLoading(true)
      try{
        const passHash = await hashPass(values.password)
        sessionStorage.setItem("token", passHash)
      } finally {
          router.push(`/dashboard/${values.username}`)
      }
    }

    return (
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
           <div>Please login:</div>
           <div> 
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 justify-items-center">
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
                    <Button type="submit">Login</Button>
                </form>
            </Form>
           </div>
           <div>{loading ? (<p>Logging in...</p>) : (<p></p>)}</div>
      </div>        
    )       
}