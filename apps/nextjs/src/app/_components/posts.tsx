"use client";

import type { RouterOutputs } from "@unibus/api";
import { use } from "react";

import { cn } from "@unibus/ui";
import { Button } from "@unibus/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  useForm,
} from "@unibus/ui/form";
import { Input } from "@unibus/ui/input";
import { toast } from "@unibus/ui/toast";
import { CreateBusSchema } from "@unibus/validators";

import { api } from "~/trpc/react";

export function CreatePostForm() {
  const form = useForm({
    schema: CreateBusSchema,
    defaultValues: {
      plate: "",
      password: "",
    },
  });

  const utils = api.useUtils();
  const createPost = api.bus.create.useMutation({
    onSuccess: async () => {
      form.reset();
      await utils.bus.invalidate();
    },
    onError: (err) => {
      toast.error(
        err.data?.code === "UNAUTHORIZED"
          ? "You must be logged in to bus"
          : "Failed to create bus",
      );
    },
  });

  return (
    <Form {...form}>
      <form
        className="flex w-full max-w-2xl flex-col gap-4"
        onSubmit={form.handleSubmit((data) => {
          createPost.mutate(data);
        })}
      >
        <FormField
          control={form.control}
          name="plate"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Placa" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Chave de acesso" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button>Create</Button>
      </form>
    </Form>
  );
}

export function PostList(props: {
  buss: Promise<RouterOutputs["bus"]["all"]>;
}) {
  // TODO: Make `useSuspenseQuery` work without having to pass a promise from RSC
  const initialData = use(props.buss);
  const { data: buss } = api.bus.all.useQuery(undefined, {
    initialData,
  });

  if (buss.length === 0) {
    return (
      <div className="relative flex w-full flex-col gap-4">
        <PostCardSkeleton pulse={false} />
        <PostCardSkeleton pulse={false} />
        <PostCardSkeleton pulse={false} />

        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10">
          <p className="text-2xl font-bold text-white">No buss yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {buss.map((p) => {
        return <PostCard key={p.id} bus={p} />;
      })}
    </div>
  );
}

export function PostCard(props: { bus: RouterOutputs["bus"]["all"][number] }) {
  const utils = api.useUtils();
  const deletePost = api.bus.delete.useMutation({
    onSuccess: async () => {
      await utils.bus.invalidate();
    },
    onError: (err) => {
      toast.error(
        err.data?.code === "UNAUTHORIZED"
          ? "You must be logged in to delete a bus"
          : "Failed to delete bus",
      );
    },
  });

  return (
    <div className="flex flex-row rounded-lg bg-muted p-4">
      <div className="flex-grow">
        <h2 className="text-2xl font-bold text-primary">{props.bus.plate}</h2>
        <p className="mt-2 text-sm">{props.bus.password}</p>
      </div>
      <div>
        <Button
          variant="ghost"
          className="cursor-pointer text-sm font-bold uppercase text-primary hover:bg-transparent hover:text-white"
          onClick={() => deletePost.mutate(props.bus.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

export function PostCardSkeleton(props: { pulse?: boolean }) {
  const { pulse = true } = props;
  return (
    <div className="flex flex-row rounded-lg bg-muted p-4">
      <div className="flex-grow">
        <h2
          className={cn(
            "w-1/4 rounded bg-primary text-2xl font-bold",
            pulse && "animate-pulse",
          )}
        >
          &nbsp;
        </h2>
        <p
          className={cn(
            "mt-2 w-1/3 rounded bg-current text-sm",
            pulse && "animate-pulse",
          )}
        >
          &nbsp;
        </p>
      </div>
    </div>
  );
}
