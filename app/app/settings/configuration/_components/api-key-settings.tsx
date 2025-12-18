"use client";

import { useActionState, useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Copy, Check, Trash2 } from "lucide-react";
import { createApiKey, revokeApiKey } from "../actions";
import { useToastAction } from "@/lib/utils/use-toast-action";
import useSWR from "swr";
import type { ActionState } from "@/lib/auth/proxy";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  createdAt: string;
  lastUsedAt: string | null;
  revokedAt: string | null;
}

export function ApiKeySettings() {
  const { data: teamData, mutate } = useSWR<any>("/api/team", fetcher);
  const [createState, createAction, isCreatePending] = useActionState<
    ActionState & { apiKey?: string },
    FormData
  >(createApiKey, {});
  const [revokeState, revokeAction, isRevokePending] = useActionState<
    ActionState,
    FormData
  >(revokeApiKey, {});

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showNewKeyDialog, setShowNewKeyDialog] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useToastAction(createState);
  useToastAction(revokeState);

  useEffect(() => {
    if (createState?.success && createState?.apiKey) {
      setShowNewKeyDialog(true);
    }
  }, [createState]);

  useEffect(() => {
    if (revokeState?.success) {
      mutate();
    }
  }, [revokeState?.success, mutate]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (!teamData) {
    return null;
  }

  // Fetch API keys - TODO: Create API endpoint for this
  const { data: apiKeys } = useSWR<ApiKey[]>(
    teamData?.id ? `/api/team/api-keys` : null,
    fetcher
  );

  const activeKeys = apiKeys?.filter((key) => !key.revokedAt) || [];
  const revokedKeys = apiKeys?.filter((key) => key.revokedAt) || [];

  return (
    <>
      <Card id="api-keys">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Manage API keys for programmatic access to your team's data
              </CardDescription>
            </div>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="gap-2"
                  onClick={() => setNewKeyName("")}
                >
                  <Plus className="h-4 w-4" />
                  Create Key
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create API Key</DialogTitle>
                  <DialogDescription>
                    Give your API key a name to identify it later
                  </DialogDescription>
                </DialogHeader>
                <form
                  action={(formData) => {
                    formData.set("name", newKeyName);
                    createAction(formData);
                    setShowCreateDialog(false);
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="keyName">Key Name</Label>
                    <Input
                      id="keyName"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="Production API Key"
                      required
                      minLength={1}
                      maxLength={255}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowCreateDialog(false);
                        setNewKeyName("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isCreatePending || !newKeyName.trim()}
                    >
                      {isCreatePending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Key"
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {activeKeys.length === 0 && revokedKeys.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No API keys yet. Create one to get started.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {activeKeys.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-4">Active Keys</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Key Prefix</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Last Used</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeKeys.map((key) => (
                        <TableRow key={key.id}>
                          <TableCell className="font-medium">
                            {key.name}
                          </TableCell>
                          <TableCell>
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {key.keyPrefix}...
                            </code>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(key.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {key.lastUsedAt
                              ? new Date(key.lastUsedAt).toLocaleDateString()
                              : "Never"}
                          </TableCell>
                          <TableCell>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Revoke API Key?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. The API key
                                    will immediately stop working.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <form action={revokeAction}>
                                    <input
                                      type="hidden"
                                      name="keyId"
                                      value={key.id}
                                    />
                                    <AlertDialogAction
                                      type="submit"
                                      disabled={isRevokePending}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      {isRevokePending ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        "Revoke"
                                      )}
                                    </AlertDialogAction>
                                  </form>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {revokedKeys.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-4">Revoked Keys</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Key Prefix</TableHead>
                        <TableHead>Revoked</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {revokedKeys.map((key) => (
                        <TableRow key={key.id}>
                          <TableCell className="font-medium">
                            {key.name}
                          </TableCell>
                          <TableCell>
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {key.keyPrefix}...
                            </code>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(key.revokedAt!).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create API Key Dialog */}
      <Dialog open={showNewKeyDialog} onOpenChange={setShowNewKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>API Key Created</DialogTitle>
            <DialogDescription>
              Copy this key now. You won't be able to see it again.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <code className="flex-1 p-2 bg-muted rounded text-sm break-all">
                {createState?.apiKey}
              </code>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  createState?.apiKey && handleCopy(createState.apiKey)
                }
              >
                {copiedKey === createState?.apiKey ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Button
              onClick={() => {
                setShowNewKeyDialog(false);
                mutate();
              }}
              className="w-full"
            >
              I've copied the key
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
