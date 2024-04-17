"use client";

import { DataTable } from "@unibus/ui/data-table";

import { api } from "~/trpc/react";
import { columns } from "./columns";

export default function BusTable() {
  const { data } = api.bus.all.useQuery();

  return <DataTable data={data ? data : []} columns={columns} />;
}
