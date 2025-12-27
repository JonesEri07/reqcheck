"use client";

import { useState, useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Plus, Pencil, Trash2, Tag as TagIcon } from "lucide-react";
import { createTag, updateTag, deleteTag } from "@/app/app/(app)/tags/actions";
import { useToastAction } from "@/lib/utils/use-toast-action";
import type { Tag } from "@/components/tag-selector";

interface TagsManagementProps {
  initialTags: Tag[];
}

export function TagsManagement({ initialTags }: TagsManagementProps) {
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);

  const [createState, createAction, createPending] = useActionState(createTag, {
    error: "",
  });
  const [updateState, updateAction, updatePending] = useActionState(updateTag, {
    error: "",
  });
  const [deleteState, deleteAction, deletePending] = useActionState(deleteTag, {
    error: "",
  });

  useToastAction(createState);
  useToastAction(updateState);
  useToastAction(deleteState);

  // Refresh tags after successful operations
  useEffect(() => {
    const handleRefresh = async () => {
      const response = await fetch("/api/tags");
      if (response.ok) {
        const data = await response.json();
        setTags(data);
      }
    };

    if ((createState as any)?.success) {
      handleRefresh();
      setCreateDialogOpen(false);
    }
  }, [(createState as any)?.success]);

  useEffect(() => {
    const handleRefresh = async () => {
      const response = await fetch("/api/tags");
      if (response.ok) {
        const data = await response.json();
        setTags(data);
      }
    };

    if ((updateState as any)?.success) {
      handleRefresh();
      setEditDialogOpen(false);
      setSelectedTag(null);
    }
  }, [(updateState as any)?.success]);

  useEffect(() => {
    const handleRefresh = async () => {
      const response = await fetch("/api/tags");
      if (response.ok) {
        const data = await response.json();
        setTags(data);
      }
    };

    if ((deleteState as any)?.success) {
      handleRefresh();
      setDeleteDialogOpen(false);
      setSelectedTag(null);
    }
  }, [(deleteState as any)?.success]);

  const handleEdit = (tag: Tag) => {
    setSelectedTag(tag);
    setEditDialogOpen(true);
  };

  const handleDelete = (tag: Tag) => {
    setSelectedTag(tag);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">
            Tags help organize and filter challenge questions. Tags are
            team-wide and must be unique.
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Tag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form
              action={createAction}
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                createAction(formData);
              }}
            >
              <DialogHeader>
                <DialogTitle>Create New Tag</DialogTitle>
                <DialogDescription>
                  Create a new tag for your team. Tag names must be unique
                  within your team.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="create-tag-name">Tag Name *</Label>
                  <Input
                    id="create-tag-name"
                    name="name"
                    placeholder="e.g., Beginner, Advanced, API"
                    required
                    minLength={1}
                    maxLength={255}
                  />
                  {createState?.fieldErrors?.name && (
                    <p className="text-sm text-destructive">
                      {createState.fieldErrors.name}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-tag-description">
                    Description (optional)
                  </Label>
                  <Textarea
                    id="create-tag-description"
                    name="description"
                    placeholder="Describe what this tag is used for"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createPending}>
                  {createPending ? "Creating..." : "Create Tag"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {tags.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <TagIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            No tags yet. Create your first tag to get started.
          </p>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Usage Count</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {tag.color && (
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: tag.color }}
                        />
                      )}
                      <span className="font-medium">{tag.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {tag.description || "—"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{tag.usageCount}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(tag)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog
                        open={deleteDialogOpen && selectedTag?.id === tag.id}
                        onOpenChange={(open) => {
                          if (!open) {
                            setDeleteDialogOpen(false);
                            setSelectedTag(null);
                          }
                        }}
                      >
                        <AlertDialogTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(tag)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Tag</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete the tag "
                              {tag.name}"? This will remove it from all
                              challenge questions that use it. This action
                              cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                const formData = new FormData();
                                formData.append("id", tag.id);
                                deleteAction(formData);
                              }}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <form
            action={updateAction}
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              updateAction(formData);
            }}
          >
            <DialogHeader>
              <DialogTitle>Edit Tag</DialogTitle>
              <DialogDescription>
                Update tag details. Tag names must be unique within your team.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <input type="hidden" name="id" value={selectedTag?.id || ""} />
              <div className="space-y-2">
                <Label htmlFor="edit-tag-name">Tag Name *</Label>
                <Input
                  id="edit-tag-name"
                  name="name"
                  defaultValue={selectedTag?.name || ""}
                  required
                  minLength={1}
                  maxLength={255}
                />
                {updateState?.fieldErrors?.name && (
                  <p className="text-sm text-destructive">
                    {updateState.fieldErrors.name}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-tag-description">
                  Description (optional)
                </Label>
                <Textarea
                  id="edit-tag-description"
                  name="description"
                  defaultValue={selectedTag?.description || ""}
                  placeholder="Describe what this tag is used for"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditDialogOpen(false);
                  setSelectedTag(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updatePending}>
                {updatePending ? "Updating..." : "Update Tag"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
