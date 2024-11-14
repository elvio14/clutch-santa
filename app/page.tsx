import Image from "next/image";

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
import { useState } from "react";

const formSchema = z.object({
  username: z.string().min(4, {
    message: "Username must be at least 4 characters."
  }).max(20, {
    message: "Username must not exceed 20 characters."
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters."
  }).regex(/^(?=.*\d)(?=.*[^a-zA-Z\d]).+$/, {
    message: "Password must include at least one number and one non-letter character."
  })
})


export default function Home() {
  
  const [registering, setRegistering] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: ""
    },
  })
 
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // DB call
    console.log(values)
  }
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-12 row-start-2 items-center sm:items-start">
        <h2>Welcome, Santa!</h2>
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>                
              )}
            />
            <Button type="submit" >Register</Button>
            <Button type="submit" className="ml-4">Login</Button>
          </form>
        </Form>
      </main>
      {/* <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        
      </footer> */}
    </div>
  );
}
