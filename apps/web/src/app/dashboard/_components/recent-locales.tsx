import { Avatar, AvatarFallback, AvatarImage } from "@unibus/ui/avatar";

export function RecentLocales() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback>OM</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Nome do local</p>
          <p className="text-sm text-muted-foreground">
            endereço ou coordenadas
          </p>
        </div>
        <div className="ml-auto font-medium">09/04/2024 12:10</div>
      </div>
    </div>
  );
}
