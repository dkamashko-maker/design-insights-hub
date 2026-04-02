import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const mockUsers = [
  { id: "u1", name: "Иван Петров", email: "ivan@example.com", role: "user" as string, avatar: "ИП", createdAt: "2025-01-15" },
  { id: "u2", name: "Мария Сидорова", email: "maria@example.com", role: "admin" as string, avatar: "МС", createdAt: "2025-02-01" },
  { id: "u3", name: "Алексей Козлов", email: "alex@example.com", role: "user" as string, avatar: "АК", createdAt: "2025-03-10" },
  { id: "u4", name: "Елена Волкова", email: "elena@example.com", role: "user" as string, avatar: "ЕВ", createdAt: "2025-03-20" },
  { id: "u5", name: "Дмитрий Новиков", email: "dmitry@example.com", role: "user" as string, avatar: "ДН", createdAt: "2025-04-01" },
];

const AdminUsers = () => {
  const [users, setUsers] = useState(mockUsers);

  const changeRole = (id: string, role: string) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, role } : u)));
  };

  return (
    <div>
      <h1 className="text-h2 mb-6">Пользователи</h1>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Аватар</TableHead>
              <TableHead>Имя</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Роль</TableHead>
              <TableHead>Дата регистрации</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">{u.avatar}</div>
                </TableCell>
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
                <TableCell>
                  <Select value={u.role} onValueChange={(v) => changeRole(u.id, v)}>
                    <SelectTrigger className="w-[160px] h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Пользователь</SelectItem>
                      <SelectItem value="admin">Администратор</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{new Date(u.createdAt).toLocaleDateString("ru-RU")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminUsers;
