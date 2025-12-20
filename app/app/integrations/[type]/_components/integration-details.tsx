"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
import { Loader2, Trash2, RefreshCw, Plus, X } from "lucide-react";
import { useActionState } from "react";
import { useToastAction } from "@/lib/utils/use-toast-action";
import { toast } from "sonner";
import type { ActionState } from "@/lib/auth/proxy";
import {
  connectGreenhouse,
  updateGreenhouse,
  disconnectIntegration,
  syncIntegration,
} from "../../actions";
import type { TeamIntegration } from "@/lib/db/schema";
import type {
  IntegrationMetadata,
  GreenhouseConfig,
  PostFetchFilter,
} from "@/lib/integrations/types";
import { IntegrationType } from "@/lib/integrations/types";
import { SyncFrequency, SyncBehavior } from "@/lib/db/schema";
import { formatDistanceToNow } from "date-fns";

interface IntegrationDetailsProps {
  integrationType: IntegrationType;
  integration: TeamIntegration | null;
  integrationMeta: IntegrationMetadata;
}

export function IntegrationDetails({
  integrationType,
  integration,
  integrationMeta,
}: IntegrationDetailsProps) {
  const router = useRouter();
  const isConnected = !!integration;
  const config = (integration?.config as GreenhouseConfig) || null;

  const [formData, setFormData] = useState({
    boardToken: config?.boardToken || "",
    syncFrequency: (config?.syncFrequency ||
      SyncFrequency.MANUALLY) as SyncFrequency,
    syncBehavior: (config?.syncBehavior ||
      SyncBehavior.REPLACE_ALL) as SyncBehavior,
    postFetchFilters: (config?.postFetchFilters || []) as PostFetchFilter[],
  });

  const [connectState, connectAction, isConnectPending] = useActionState(
    connectGreenhouse,
    {}
  );
  const [updateState, updateAction, isUpdatePending] = useActionState(
    updateGreenhouse,
    {}
  );
  const [syncState, syncAction, isSyncPending] = useActionState(
    syncIntegration,
    {}
  );
  const [isDisconnectPending, startDisconnectTransition] = useTransition();
  const [isFormPending, startFormTransition] = useTransition();

  useToastAction(connectState);
  useToastAction(updateState);
  useToastAction(syncState);

  // Refresh on success
  useEffect(() => {
    if (
      (connectState as any)?.success ||
      (updateState as any)?.success ||
      (syncState as any)?.success
    ) {
      router.refresh();
    }
  }, [
    (connectState as any)?.success,
    (updateState as any)?.success,
    (syncState as any)?.success,
    router,
  ]);

  const handleConnect = (fd: FormData) => {
    fd.append("integrationType", integrationType);
    fd.append("config[boardToken]", formData.boardToken);
    fd.append("config[syncFrequency]", formData.syncFrequency);
    fd.append("config[syncBehavior]", formData.syncBehavior);
    fd.append(
      "config[postFetchFilters]",
      JSON.stringify(formData.postFetchFilters)
    );
    startFormTransition(() => {
      connectAction(fd);
    });
  };

  const handleUpdate = (fd: FormData) => {
    if (!integration) return;
    fd.append("integrationId", integration.id);
    fd.append("config[boardToken]", formData.boardToken);
    fd.append("config[syncFrequency]", formData.syncFrequency);
    fd.append("config[syncBehavior]", formData.syncBehavior);
    fd.append(
      "config[postFetchFilters]",
      JSON.stringify(formData.postFetchFilters)
    );
    startFormTransition(() => {
      updateAction(fd);
    });
  };

  const handleDisconnect = async () => {
    if (!integration) return;
    startDisconnectTransition(async () => {
      const formData = new FormData();
      formData.append("integrationId", integration.id);
      const result = await disconnectIntegration({} as ActionState, formData);
      if ("error" in result) {
        toast.error(result.error);
      } else {
        toast.success("Integration disconnected");
        router.push("/app/integrations");
      }
    });
  };

  const handleSync = () => {
    if (!integration) return;
    const formData = new FormData();
    formData.append("integrationId", integration.id);
    startFormTransition(() => {
      syncAction(formData);
    });
  };

  const addFilter = () => {
    setFormData((prev) => ({
      ...prev,
      postFetchFilters: [
        ...prev.postFetchFilters,
        { type: "ignore_if_contains", value: "" },
      ],
    }));
  };

  const updateFilter = (index: number, updates: Partial<PostFetchFilter>) => {
    setFormData((prev) => ({
      ...prev,
      postFetchFilters: prev.postFetchFilters.map((filter, i) => {
        if (i === index) {
          const updated = { ...filter, ...updates };
          // If changing to has_detected_skill, remove value
          if (
            updates.type === "has_detected_skill" ||
            updated.type === "has_detected_skill"
          ) {
            const { value, ...rest } = updated;
            return rest;
          }
          return updated;
        }
        return filter;
      }),
    }));
  };

  const removeFilter = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      postFetchFilters: prev.postFetchFilters.filter((_, i) => i !== index),
    }));
  };

  if (integrationType !== IntegrationType.GREENHOUSE) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">
            Integration type not yet implemented
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Card */}
      {isConnected && integration && (
        <Card>
          <CardHeader>
            <CardTitle>Connection Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Badge variant="default" className="gap-1">
                  Connected
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleSync}
                  disabled={isSyncPending || isFormPending}
                  variant="outline"
                  size="sm"
                >
                  {isSyncPending || isFormPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Sync Now
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={isDisconnectPending}
                    >
                      {isDisconnectPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 mr-2" />
                      )}
                      Disconnect
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Disconnect Integration?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This will disconnect the {integrationMeta.name}{" "}
                        integration. You can reconnect it at any time.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDisconnect}>
                        Disconnect
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Sync Frequency:</span>
                <div className="font-medium">{integration.syncFrequency}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Last Sync:</span>
                <div className="font-medium">
                  {integration.lastSyncAt
                    ? formatDistanceToNow(new Date(integration.lastSyncAt), {
                        addSuffix: true,
                      })
                    : "Never"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Configuration Form */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {isConnected ? "Configuration" : "Connect Integration"}
              </CardTitle>
              <CardDescription>
                {isConnected
                  ? "Update your integration settings"
                  : `Connect your ${integrationMeta.name} account to start syncing jobs`}
              </CardDescription>
            </div>
            {isConnected && (
              <Button
                type="submit"
                form="integration-form"
                disabled={isConnectPending || isUpdatePending || isFormPending}
              >
                {(isConnectPending || isUpdatePending || isFormPending) && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Update Configuration
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <form
            id="integration-form"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              if (isConnected) {
                handleUpdate(formData);
              } else {
                handleConnect(formData);
              }
            }}
            className="space-y-6"
          >
            {/* Board Token */}
            <div className="space-y-2">
              <Label htmlFor="boardToken">Board Token</Label>
              <p className="text-sm text-muted-foreground">
                Your Greenhouse Job Board API token
              </p>
              <Input
                id="boardToken"
                name="boardToken"
                value={formData.boardToken}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    boardToken: e.target.value,
                  }))
                }
                placeholder="Enter your board token"
                required
              />
            </div>

            {/* Sync Frequency */}
            <div className="space-y-2">
              <Label htmlFor="syncFrequency">Sync Frequency</Label>
              <p className="text-sm text-muted-foreground">
                How often to automatically sync jobs from Greenhouse
              </p>
              <Select
                value={formData.syncFrequency}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    syncFrequency: value as SyncFrequency,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SyncFrequency.MANUALLY}>
                    Manually
                  </SelectItem>
                  {/* <SelectItem value={SyncFrequency.HOURLY}>Hourly</SelectItem> */}
                  <SelectItem value={SyncFrequency.DAILY}>Daily</SelectItem>
                  {/* <SelectItem value={SyncFrequency.WEEKLY}>Weekly</SelectItem> */}
                </SelectContent>
              </Select>
            </div>

            {/* Sync Behavior */}
            <div className="space-y-2">
              <Label htmlFor="syncBehavior">Sync Behavior</Label>
              <p className="text-sm text-muted-foreground">
                How to handle job skills when syncing existing jobs
              </p>
              <Select
                value={formData.syncBehavior}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    syncBehavior: value as SyncBehavior,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SyncBehavior.REPLACE_ALL}>
                    Replace All - Remove all existing skills and re-detect
                  </SelectItem>
                  <SelectItem value={SyncBehavior.KEEP_MANUAL}>
                    Keep Manual - Keep manually added skills, re-detect others
                  </SelectItem>
                  <SelectItem value={SyncBehavior.SMART}>
                    Smart - Only add new skills, remove non-manual skills not
                    detected
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Post-Fetch Filters */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Post-Fetch Filters</Label>
                  <p className="text-sm text-muted-foreground">
                    Filter jobs after fetching from Greenhouse API
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addFilter}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Filter
                </Button>
              </div>

              {formData.postFetchFilters.length > 0 && (
                <div className="space-y-3">
                  {formData.postFetchFilters.map((filter, index) => (
                    <div
                      key={index}
                      className="flex gap-2 p-3 border rounded-lg items-start"
                    >
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                        <Select
                          value={filter.type}
                          onValueChange={(value) =>
                            updateFilter(index, {
                              type: value as PostFetchFilter["type"],
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ignore_if_contains">
                              Ignore if contains
                            </SelectItem>
                            <SelectItem value="only_if_contains">
                              Only if contains
                            </SelectItem>
                            <SelectItem value="metadata_exists">
                              Metadata exists
                            </SelectItem>
                            <SelectItem value="metadata_matches">
                              Metadata matches
                            </SelectItem>
                            <SelectItem value="has_detected_skill">
                              Has detected skill
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {filter.type === "metadata_matches" && (
                          <Input
                            placeholder="Metadata field name"
                            value={filter.field || ""}
                            onChange={(e) =>
                              updateFilter(index, { field: e.target.value })
                            }
                          />
                        )}
                        {filter.type !== "has_detected_skill" && (
                          <Input
                            placeholder="Value to check"
                            value={filter.value || ""}
                            onChange={(e) =>
                              updateFilter(index, { value: e.target.value })
                            }
                            required
                          />
                        )}
                        {filter.type === "has_detected_skill" && (
                          <div className="flex items-center text-sm text-muted-foreground px-3 py-2 border rounded-md bg-muted/50">
                            Sync only jobs that have at least one client skill
                            detected in the job description.
                          </div>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFilter(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {!isConnected && (
              <>
                <Separator />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={
                      isConnectPending || isUpdatePending || isFormPending
                    }
                  >
                    {(isConnectPending || isUpdatePending || isFormPending) && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    Connect Integration
                  </Button>
                </div>
              </>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
