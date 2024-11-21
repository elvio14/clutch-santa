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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { createSS } from "./actions";
import { useRouter } from 'next/navigation';

const formSchema = z.object({
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
  type: z.enum(["joining", "organizing"], {
    required_error: "You need to decide.",
  }),
})


export default function Home() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      displayName: ""
    },
  })
  const router = useRouter()
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // DB call
    console.log(values)
    const sessionID = await createSS(values.username, values.displayName, values.password, values.type)
    router.push(`/dashboard/${sessionID}`)
  }
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-12 row-start-2 items-center sm:items-start">
        <h2>Welcome! Start a new Secret Santa session here.</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 justify-items-center">
            {/* Username Field */}
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

            {/* Radio Group for joining/organizing */}
            <FormField
              control={form.control}
              name="type" // Use a different name here, e.g., "role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Are you joining the Secret Santa, or just organizing?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="joining" />
                        </FormControl>
                        <FormLabel className="font-normal">I'm joining!</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="organizing" />
                        </FormControl>
                        <FormLabel className="font-normal">I'm just organizing.</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button type="submit">Register</Button>
          </form>
        </Form>
      </main>
    </div>
  );
}
