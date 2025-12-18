"use client";

import { useState, useTransition, useEffect } from "react";
import { useActionState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Upload, Loader2, AlertTriangle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { createClientSkill, checkSkillDuplicates } from "../actions";
import { useToastAction } from "@/lib/utils/use-toast-action";
import { SkillIcon } from "@/components/skill-icon";
import type { ActionState } from "@/lib/auth/proxy";

interface CreateSkillSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateSkillSheet({
  open,
  onOpenChange,
  onSuccess,
}: CreateSkillSheetProps) {
  const [skillName, setSkillName] = useState("");
  const [description, setDescription] = useState("");
  const [aliases, setAliases] = useState<string[]>([]);
  const [newAlias, setNewAlias] = useState("");
  const [iconSvg, setIconSvg] = useState("");
  const [iconError, setIconError] = useState("");
  const [iconFileName, setIconFileName] = useState("");
  const [duplicateErrors, setDuplicateErrors] = useState<{
    name?: string;
    aliases?: string[];
  }>({});
  const [isPending, startTransition] = useTransition();

  const [state, formAction] = useActionState<
    ActionState & { skillId?: string },
    FormData
  >(createClientSkill, {});

  useToastAction(state);

  // Reset form when sheet closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setSkillName("");
      setDescription("");
      setAliases([]);
      setNewAlias("");
      setIconSvg("");
      setIconFileName("");
      setIconError("");
      setDuplicateErrors({});
    }
    onOpenChange(newOpen);
  };

  // Handle success - close sheet and call onSuccess callback
  useEffect(() => {
    if (state?.success) {
      // Use setTimeout to ensure this runs after render cycle completes
      const timer = setTimeout(() => {
        onOpenChange(false);
        onSuccess?.();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [state?.success, onOpenChange, onSuccess]);

  const handleAddAlias = () => {
    const trimmed = newAlias.trim().toLowerCase();
    if (trimmed && !aliases.includes(trimmed)) {
      setAliases([...aliases, trimmed]);
      setNewAlias("");
      setDuplicateErrors((prev) => ({
        ...prev,
        aliases: prev.aliases?.filter((a) => a !== trimmed),
      }));
    }
  };

  const handleRemoveAlias = (aliasToRemove: string) => {
    setAliases(aliases.filter((a) => a !== aliasToRemove));
    setDuplicateErrors((prev) => ({
      ...prev,
      aliases: prev.aliases?.filter((a) => a !== aliasToRemove),
    }));
  };

  const handleIconFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setIconFileName("");
      return;
    }

    if (file.type !== "image/svg+xml") {
      setIconError("Only SVG files are supported");
      setIconFileName("");
      return;
    }

    setIconFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const svgContent = event.target?.result as string;
      setIconSvg(svgContent);
      setIconError("");
    };
    reader.onerror = () => {
      setIconError("Failed to read file");
      setIconFileName("");
    };
    reader.readAsText(file);
  };

  const handleIconPaste = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setIconSvg(value);
    setIconError("");

    // Basic validation - check if it looks like SVG
    if (value && !value.trim().startsWith("<svg")) {
      setIconError("Invalid SVG format");
    } else {
      setIconError("");
    }
  };

  const handleClearIcon = () => {
    setIconSvg("");
    setIconFileName("");
    setIconError("");
    // Reset file input
    const fileInput = document.getElementById(
      "icon-file-input"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleCheckDuplicates = async () => {
    if (!skillName.trim()) return;

    const normalizedName = skillName.toLowerCase().trim();
    const allAliases = [...aliases, normalizedName];

    const formData = new FormData();
    formData.set("skillName", skillName);
    formData.set("aliases", JSON.stringify(allAliases));

    startTransition(async () => {
      const result = (await checkSkillDuplicates({}, formData)) as
        | (ActionState & {
            duplicates?: { name?: boolean; aliases?: string[] };
          })
        | { error: string };

      if (result.error) {
        setDuplicateErrors({ name: result.error });
      } else if ("duplicates" in result && result.duplicates) {
        const errors: { name?: string; aliases?: string[] } = {};
        if (result.duplicates.name) {
          errors.name = "A skill with this name already exists";
        }
        if (result.duplicates.aliases && result.duplicates.aliases.length > 0) {
          errors.aliases = result.duplicates.aliases;
        }
        setDuplicateErrors(errors);
      } else {
        setDuplicateErrors({});
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      duplicateErrors.name ||
      (duplicateErrors.aliases && duplicateErrors.aliases.length > 0)
    ) {
      return;
    }

    const formData = new FormData();
    formData.set("skillName", skillName);
    if (description) formData.set("description", description);
    if (aliases.length > 0) formData.set("aliases", JSON.stringify(aliases));
    if (iconSvg) formData.set("iconSvg", iconSvg);

    startTransition(() => {
      formAction(formData);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddAlias();
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto mx-4">
        <SheetHeader>
          <SheetTitle>Create Custom Skill</SheetTitle>
          <SheetDescription>
            Add a new skill to your library. Skill names and aliases must be
            unique across all skills.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6 px-4">
          {/* Skill Name */}
          <div className="space-y-2">
            <Label htmlFor="skillName">
              Skill Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="skillName"
              value={skillName}
              onChange={(e) => {
                setSkillName(e.target.value);
                setDuplicateErrors((prev) => ({ ...prev, name: undefined }));
              }}
              onBlur={handleCheckDuplicates}
              placeholder="e.g., TypeScript"
              required
            />
            {duplicateErrors.name && (
              <p className="text-sm text-destructive">{duplicateErrors.name}</p>
            )}
          </div>

          {/* Icon Preview and Upload */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Icon (Optional)</Label>
              {iconSvg && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClearIcon}
                  className="h-7 text-xs text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              )}
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 border rounded-lg flex items-center justify-center bg-muted overflow-hidden [&>svg_g[clip-path]]:[clip-path:revert]">
                  {iconSvg ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: iconSvg,
                      }}
                      className="w-12 h-12 [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        isolation: "isolate",
                      }}
                    />
                  ) : (
                    <SkillIcon
                      name={skillName || "default"}
                      className="w-8 h-8"
                    />
                  )}
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <div>
                  <input
                    type="file"
                    accept=".svg,image/svg+xml"
                    onChange={handleIconFileUpload}
                    className="hidden"
                    id="icon-file-input"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() =>
                      document.getElementById("icon-file-input")?.click()
                    }
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {iconFileName ? iconFileName : "Choose svg file"}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload an SVG file
                  </p>
                </div>
                <div>
                  <Textarea
                    placeholder="Or paste SVG code here..."
                    value={iconSvg}
                    onChange={handleIconPaste}
                    rows={4}
                    className="font-mono text-xs max-h-[200px]"
                  />
                  {iconError && (
                    <p className="text-sm text-destructive mt-1">{iconError}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this skill, internal use only. This will not be shown to candidates."
              rows={3}
            />
          </div>

          {/* Aliases */}
          <div className="space-y-2">
            <Label htmlFor="aliases">Aliases (Optional)</Label>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2 mb-2">
                {aliases.map((alias, index) => {
                  const isDuplicate = duplicateErrors.aliases?.includes(alias);
                  return (
                    <Badge
                      key={index}
                      variant={isDuplicate ? "destructive" : "outline"}
                      className="gap-1.5 pr-1"
                    >
                      {alias}
                      <button
                        type="button"
                        onClick={() => handleRemoveAlias(alias)}
                        className="ml-1 rounded-sm hover:bg-muted"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
              <div className="flex gap-2">
                <Input
                  id="aliases"
                  value={newAlias}
                  onChange={(e) => setNewAlias(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Add alias..."
                  className="max-w-xs"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddAlias}
                >
                  Add
                </Button>
              </div>
              {duplicateErrors.aliases &&
                duplicateErrors.aliases.length > 0 && (
                  <p className="text-sm text-destructive">
                    These aliases already exist:{" "}
                    {duplicateErrors.aliases.join(", ")}
                  </p>
                )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || !!duplicateErrors.name}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Skill
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
