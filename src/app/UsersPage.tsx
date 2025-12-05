// src/pages/UsersPage.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchUsers } from "@/services/userService";
import type { User } from "@/types/User";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchUsers();

        if (isMounted) {
          setUsers(data);
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to retrieve user portfolio. Please try again later.");
          console.error("User synchronization error:", err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  // Calculate active users count
  const activeUsersCount = users.filter(user => user.is_active).length;

  // Generate a unique key for each user
  const generateUserKey = (user: User, index: number): string => {
    if (user.id) return `user-${user.id}`;
    if (user.email) return `user-${user.email}-${index}`;
    return `user-${user.firstname}-${user.lastname}-${index}`;
  };

  // Empty state component
  if (!loading && users.length === 0 && !error) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Card className="shadow-xl max-w-5xl mx-auto">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold">Customer & User Ecosystem</CardTitle>
            <p className="text-muted-foreground">
              Centralized view of all registered stakeholders in the platform
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-10">
              No users have been onboarded yet. Exciting growth potential ahead!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold">Customer & User Ecosystem</CardTitle>
          <p className="text-muted-foreground">
            Centralized view of all registered stakeholders in the platform
          </p>
        </CardHeader>

        <CardContent>
          {loading && (
            <div className="space-y-4">
              {[...Array(6)].map((_, index) => (
                <Skeleton key={`skeleton-${index}`} className="h-12 w-full" />
              ))}
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 text-destructive bg-destructive/10 p-4 rounded-lg mb-4">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!loading && !error && users.length > 0 && (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableCaption>
                  Total active users: {activeUsersCount} out of {users.length}
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Member Since</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user, index) => {
                    const uniqueKey = generateUserKey(user, index);

                    return (
                      <TableRow key={uniqueKey}>
                        <TableCell className="font-medium">
                          {user.firstname} {user.lastname}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone || "—"}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary">
                            {user.role || "customer"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                              user.is_active
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                            }`}
                          >
                            {user.is_active ? "Active" : "Inactive"}
                          </span>
                        </TableCell>
                        <TableCell>
                          {user.city
                            ? `${user.city}${user.zipcode ? `, ${user.zipcode}` : ""}`
                            : "—"}
                        </TableCell>
                        <TableCell className="text-right text-sm text-muted-foreground">
                          {user.created_at
                            ? new Date(user.created_at).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : "—"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {!loading && !error && users.length === 0 && (
            <p className="text-muted-foreground text-center py-10">
              No users found.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
