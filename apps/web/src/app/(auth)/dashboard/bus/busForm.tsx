"use client";

import type { z } from "zod";
import { usePathname, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@unibus/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@unibus/ui/form";
import { Input } from "@unibus/ui/input";
import { Switch } from "@unibus/ui/switch";
import { toast } from "@unibus/ui/toast";
import { CreateBusSchema } from "@unibus/validators";

import { api } from "~/trpc/react";

type BusFormValues = z.infer<typeof CreateBusSchema>;

// This can come from your database or API.
const defaultValues: Partial<BusFormValues> = {
  plate: "ABC1B34",
  password: "",
  isActive: true,
};

export default function BusForm() {
  const utils = api.useUtils();

  const router = useRouter();
  const pathname = usePathname();

  const form = useForm<BusFormValues>({
    resolver: zodResolver(CreateBusSchema),
    defaultValues,
  });

  const createPost = api.bus.create.useMutation({
    onSuccess: async () => {
      toast.success("Bus created successfully!");
      form.reset();
      await utils.bus.invalidate();
      router.push(pathname + "?tab=lista");
    },
    onError: (err) => {
      toast.error(err.message);

      toast.error(
        err.data?.code === "UNAUTHORIZED"
          ? "You must be logged"
          : "Failed to create bus",
      );
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => createPost.mutate(data))}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="plate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Placa</FormLabel>
              <FormControl>
                <Input placeholder="PLACA" {...field} />
              </FormControl>
              <FormDescription>
                A placa do veículo é composta por 7 caracteres.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Placa</FormLabel>
              <FormControl>
                <Input placeholder="SENHA" {...field} />
              </FormControl>
              <FormDescription>Chave secreta do GPS.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Dispositivo ativo</FormLabel>
                <FormDescription>
                  Se o GPS está ativo para comunição ou não.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Salvar</Button>
      </form>
    </Form>
  );
}
