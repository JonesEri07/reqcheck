"use client";

import { useState, useEffect, useRef, startTransition } from "react";
import { X, Plus, Tag as TagIcon, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createTag } from "@/app/app/tags/actions";
import { useActionState } from "react";
import { useToastAction } from "@/lib/utils/use-toast-action";
import type { ActionState } from "@/lib/auth/proxy";

export type Tag = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  color?: string | null;
  usageCount: number;
};

interface TagSelectorProps {
  selectedTags: Tag[];
  availableTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  onCreateTag?: (tag: Tag) => void;
  disabled?: boolean;
}

export function TagSelector({
  selectedTags,
  availableTags,
  onTagsChange,
  onCreateTag,
  disabled = false,
}: TagSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [state, formAction, pending] = useActionState(createTag, {
    error: "",
    fieldErrors: {},
  } as ActionState);

  useToastAction(state as ActionState);

  const handleAddTag = (tag: Tag) => {
    if (!selectedTags.some((t) => t.id === tag.id)) {
      onTagsChange([...selectedTags, tag]);
    }
    setSearchQuery("");
    setOpen(false);
  };

  const handleRemoveTag = (tagId: string) => {
    onTagsChange(selectedTags.filter((tag) => tag.id !== tagId));
  };

  const [createdTagName, setCreatedTagName] = useState<string>("");
  const lastProcessedTagId = useRef<string | null>(null);

  const handleCreateTag = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreatedTagName(newTagName); // Store name before clearing
    const formData = new FormData();
    formData.append("name", newTagName);
    startTransition(() => {
      formAction(formData);
    });
  };

  // Handle successful tag creation
  useEffect(() => {
    const actionState = state as ActionState;
    const tagId = actionState.tagId as string | undefined;
    if (
      actionState.success &&
      tagId &&
      createdTagName &&
      tagId !== lastProcessedTagId.current
    ) {
      const newTag: Tag = {
        id: tagId,
        name: createdTagName,
        slug: createdTagName.toLowerCase().replace(/\s+/g, "-"),
        description: null,
        color: null,
        usageCount: 0,
      };
      lastProcessedTagId.current = tagId;
      setNewTagName("");
      setCreatedTagName("");
      setCreateDialogOpen(false);
      setSearchQuery("");
      // Add the new tag to selected tags
      if (!selectedTags.some((t) => t.id === newTag.id)) {
        onTagsChange([...selectedTags, newTag]);
      }
      if (onCreateTag) {
        onCreateTag(newTag);
      }
    }
  }, [state, createdTagName, selectedTags, onTagsChange, onCreateTag]);

  // Filter available tags based on search
  const filteredTags = availableTags.filter(
    (tag) =>
      !selectedTags.some((selected) => selected.id === tag.id) &&
      (tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tag.slug.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label>Tags</Label>
          <Dialog open={infoDialogOpen} onOpenChange={setInfoDialogOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
                aria-label="Learn more about tags"
              >
                <Info className="h-4 w-4 text-muted-foreground" />
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>How Tags Work</DialogTitle>
                <DialogDescription>
                  Tags help automatically match challenge questions to job
                  requirements during skill detection.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">
                    Auto-Detection Process
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    When a job is added (manually or via integration), a skill
                    detection process identifies relevant skills from the job
                    title and description. For each detected skill, the system
                    checks all challenge questions and their tags.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">
                    Tag Matching & Weights
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>
                      <strong>Tag Match:</strong> If any of a question&apos;s
                      tags are found in the job title or description, the
                      question receives the &quot;Tag Match Weight&quot; (set in
                      Team Settings).
                    </li>
                    <li>
                      <strong>No Tag Match:</strong> If none of the
                      question&apos;s tags are found, it receives the &quot;No
                      Tag Match Weight&quot; (set in Team Settings).
                    </li>
                    <li>
                      <strong>Weight of 0:</strong> Questions with a weight of 0
                      are not eligible for that job and won&apos;t be considered
                      in quiz generation.
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Quiz Generation</h4>
                  <p className="text-sm text-muted-foreground">
                    When generating a quiz for an applicant, the widget uses
                    weighted random selection to choose skills and questions.
                    Higher weights increase the likelihood of selection, helping
                    ensure relevant questions (e.g., Senior-level tagged
                    questions for Senior positions) are more likely to appear.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Example Use Cases</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>
                      Tag questions as &quot;Senior&quot; or &quot;Entry&quot;
                      to match job levels
                    </li>
                    <li>
                      Use tags like &quot;Frontend&quot; or &quot;Backend&quot;
                      to match job focus areas
                    </li>
                    <li>
                      Create custom tags that match your team&apos;s specific
                      job categories
                    </li>
                  </ul>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setInfoDialogOpen(false)}>Got it</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 min-h-[2.5rem] py-2 ">
        {selectedTags.length === 0 ? (
          <span className="text-sm text-muted-foreground flex items-center">
            No tags selected
          </span>
        ) : (
          selectedTags.map((tag) => (
            <Badge
              key={tag.id}
              variant="secondary"
              className="gap-1 pr-1"
              style={
                tag.color
                  ? {
                      backgroundColor: `${tag.color}20`,
                      borderColor: tag.color,
                      color: tag.color,
                    }
                  : undefined
              }
            >
              <TagIcon className="h-3 w-3" />
              {tag.name}
              {!disabled && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 rounded-full hover:bg-destructive/20 hover:text-destructive"
                  onClick={() => handleRemoveTag(tag.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </Badge>
          ))
        )}
        {!disabled && (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button type="button" variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Tags
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
              <Command>
                <CommandInput
                  placeholder="Search tags..."
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                />
                <CommandList>
                  <CommandEmpty>
                    <div className="py-4 text-center text-sm">
                      <p className="text-muted-foreground mb-2">
                        No tags found
                      </p>
                      <Dialog
                        open={createDialogOpen}
                        onOpenChange={setCreateDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button type="button" variant="outline" size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Create New Tag
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <form onSubmit={handleCreateTag}>
                            <DialogHeader>
                              <DialogTitle>Create New Tag</DialogTitle>
                              <DialogDescription>
                                Create a new tag for your team. Tag names must
                                be unique within your team.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="tag-name">Tag Name</Label>
                                <Input
                                  id="tag-name"
                                  value={newTagName}
                                  onChange={(e) =>
                                    setNewTagName(e.target.value)
                                  }
                                  placeholder="e.g., Beginner, Advanced, API"
                                  required
                                  minLength={1}
                                  maxLength={255}
                                />
                              </div>
                              {state?.fieldErrors?.name && (
                                <p className="text-sm text-destructive">
                                  {state.fieldErrors.name}
                                </p>
                              )}
                            </div>
                            <DialogFooter>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setCreateDialogOpen(false);
                                  setNewTagName("");
                                }}
                              >
                                Cancel
                              </Button>
                              <Button type="submit" disabled={pending}>
                                {pending ? "Creating..." : "Create Tag"}
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CommandEmpty>
                  <CommandGroup>
                    {filteredTags.map((tag) => (
                      <CommandItem
                        key={tag.id}
                        onSelect={() => handleAddTag(tag)}
                        className="cursor-pointer"
                      >
                        <TagIcon className="h-4 w-4 mr-2" />
                        <span>{tag.name}</span>
                        {tag.description && (
                          <span className="text-xs text-muted-foreground ml-2">
                            - {tag.description}
                          </span>
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  {filteredTags.length > 0 && (
                    <div className="border-t p-2">
                      <Dialog
                        open={createDialogOpen}
                        onOpenChange={setCreateDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Create New Tag
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <form onSubmit={handleCreateTag}>
                            <DialogHeader>
                              <DialogTitle>Create New Tag</DialogTitle>
                              <DialogDescription>
                                Create a new tag for your team. Tag names must
                                be unique within your team.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="tag-name">Tag Name</Label>
                                <Input
                                  id="tag-name"
                                  value={newTagName}
                                  onChange={(e) =>
                                    setNewTagName(e.target.value)
                                  }
                                  placeholder="e.g., Beginner, Advanced, API"
                                  required
                                  minLength={1}
                                  maxLength={255}
                                />
                              </div>
                              {state?.fieldErrors?.name && (
                                <p className="text-sm text-destructive">
                                  {state.fieldErrors.name}
                                </p>
                              )}
                            </div>
                            <DialogFooter>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setCreateDialogOpen(false);
                                  setNewTagName("");
                                }}
                              >
                                Cancel
                              </Button>
                              <Button type="submit" disabled={pending}>
                                {pending ? "Creating..." : "Create Tag"}
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
}
