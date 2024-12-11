"use client"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from 'next/navigation';
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
import { addWish } from "@/app/actions"

const formSchema = z.object({
    wishname: z.string().min(4, {
      message: "Wishname must be at least 4 characters."
    }).max(150, {
      message: "Username must not exceed 150 characters."
    }),
    link: z.string()
  })


export default function AddWish({userID} : {userID?: string}){
    const [added, setAdded] = useState<boolean>(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          wishname: "",
          link: ""
        },
    })
    const router = useRouter()
    async function onSubmit(values: z.infer<typeof formSchema>) {
      // Do something with the form values.
      // ✅ This will be type-safe and validated.
      // DB call
      console.log(values)
      if(userID !== undefined){
       await addWish(userID, values.wishname, values.link)
        setAdded(true)
      }
    }

    if(added){
      return <div>Added to your Wish List!</div>
    }else
    return (
        <div className="w-full max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-4 b .bg-white">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 justify-items-center">
                {/* Username Field */}
                <FormField
                  control={form.control}
                  name="wishname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="My first wish!" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amazon Link</FormLabel>
                      <FormControl>
                        <Input type="link" placeholder="https://amazon.ca/..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Submit Button */}
                <Button type="submit">Add Wish</Button>
              </form>
            </Form>
            
        </div>
    )
}