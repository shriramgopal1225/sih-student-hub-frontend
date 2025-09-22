// app/(auth)/login/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gem } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { login } from "./actions";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="mx-auto max-w-sm w-full shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Gem className="h-8 w-8 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold">Smart Student Hub</CardTitle>
          <CardDescription>Enter your email to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={login} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required className="focus-visible:ring-green-500"/>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </Link>
              </div>
              <Input id="password" name="password" type="password" required className="focus-visible:ring-green-500"/>
            </div>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full bg-green-500 hover:bg-green-600">
              Login
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Contact your administrator in case of any issues{" "}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}