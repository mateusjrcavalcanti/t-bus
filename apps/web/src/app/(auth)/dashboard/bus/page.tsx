"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@unibus/ui/tabs";

import BusForm from "./busForm";
import BusTable from "./busTable";

export default function BusPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="container">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Ônibus</h2>
      </div>
      <Tabs
        defaultValue="lista"
        className="mt-6 space-y-4"
        value={searchParams.get("tab") ?? "lista"}
        onValueChange={(value) => {
          router.push(`${pathname}?tab=${value}`);
        }}
      >
        <TabsList>
          <TabsTrigger value="lista">Lista</TabsTrigger>
          <TabsTrigger value="novo">Novo</TabsTrigger>
        </TabsList>
        <TabsContent value="lista" className="space-y-4">
          <BusTable />
        </TabsContent>
        <TabsContent value="novo" className="space-y-4">
          <BusForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
