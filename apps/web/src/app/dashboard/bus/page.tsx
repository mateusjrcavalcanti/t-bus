import type { Metadata } from "next";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@unibus/ui/tabs";

import BusTable from "./busTable";

export const metadata: Metadata = {
  title: "Dashboard - Ônibus",
};

export default function DashboardPage() {
  return (
    <div className="container">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Ônibus</h2>
      </div>
      <Tabs defaultValue="lista" className="mt-6 space-y-4">
        <TabsList>
          <TabsTrigger value="lista">Lista</TabsTrigger>
          <TabsTrigger value="novo">Novo</TabsTrigger>
        </TabsList>
        <TabsContent value="lista" className="space-y-4">
          <BusTable />
        </TabsContent>
        <TabsContent value="novo" className="space-y-4"></TabsContent>
      </Tabs>
    </div>
  );
}
