"use client";

import { useState, useEffect } from "react";
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
import {
  updateClientSkill,
  checkAliasAvailability,
  addSkillFromGlobal,
} from "@/app/app/skills/actions";
import { useToastAction } from "@/lib/utils/use-toast-action";
import { SkillIcon, normalizeSvgForIcon } from "@/components/skill-icon";
import type { ActionState } from "@/lib/auth/proxy";
import type { ClientSkill } from "@/lib/db/schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useActionState } from "react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";

interface EditSkillSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skill: ClientSkill;
  onSuccess?: () => void;
}

export function EditSkillSheet({
  open,
  onOpenChange,
  skill,
  onSuccess,
}: EditSkillSheetProps) {
  const [skillName, setSkillName] = useState(skill.skillName);
  const [description, setDescription] = useState(skill.description || "");
  const [aliases, setAliases] = useState<string[]>(skill.aliases || []);
  const [newAlias, setNewAlias] = useState("");
  const [iconSvg, setIconSvg] = useState(skill.iconSvg || "");
  const [iconError, setIconError] = useState("");
  const [iconFileName, setIconFileName] = useState("");
  const [transitionPending, startTransition] = useTransition();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [aliasDialogOpen, setAliasDialogOpen] = useState(false);
  const [aliasDialogData, setAliasDialogData] = useState<{
    type: "error" | "warning";
    message: string;
    matchedGlobalSkill?: { id: string; name: string } | null;
    pendingAlias?: string;
  } | null>(null);
  const [addGlobalState, addGlobalAction, addGlobalPending] = useActionState(
    addSkillFromGlobal,
    {}
  );

  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    updateClientSkill,
    {}
  );
  const router = useRouter();

  useToastAction(state);
  useToastAction(addGlobalState);

  // Normalize iconSvg for comparison (treat null, undefined, and empty string as equivalent)
  const normalizeIconSvg = (value: string | null | undefined): string => {
    return value?.trim() || "";
  };

  // Check for unsaved changes
  useEffect(() => {
    const hasChanges =
      skillName !== skill.skillName ||
      description !== (skill.description || "") ||
      JSON.stringify(aliases.sort()) !==
        JSON.stringify((skill.aliases || []).sort()) ||
      normalizeIconSvg(iconSvg) !== normalizeIconSvg(skill.iconSvg);
    setHasUnsavedChanges(hasChanges);
  }, [skillName, description, aliases, iconSvg, skill]);

  // Reset form when sheet opens
  useEffect(() => {
    if (open) {
      setSkillName(skill.skillName);
      setDescription(skill.description || "");
      setAliases(skill.aliases || []);
      setIconSvg(skill.iconSvg || "");
      setIconFileName("");
      setIconError("");
      setNewAlias("");
      setHasUnsavedChanges(false);
    }
  }, [open, skill]);

  // Handle errors - refresh on error to get latest data
  useEffect(() => {
    if (state?.error && open) {
      router.refresh();
    }
  }, [state?.error, open, router]);

  // Handle add global skill success
  useEffect(() => {
    if (
      addGlobalState &&
      "success" in addGlobalState &&
      addGlobalState.success
    ) {
      // Re-check alias after adding global skill
      if (aliasDialogData?.pendingAlias) {
        // The alias should now be valid, add it
        setAliases([...aliases, aliasDialogData.pendingAlias]);
        setNewAlias("");
        setAliasDialogOpen(false);
        setAliasDialogData(null);
      }
    }
  }, [addGlobalState, aliasDialogData, aliases]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && hasUnsavedChanges) {
      setShowDiscardDialog(true);
    } else {
      onOpenChange(newOpen);
    }
  };

  const handleDiscard = () => {
    setShowDiscardDialog(false);
    onOpenChange(false);
  };

  const handleAddAlias = async () => {
    const trimmed = newAlias.trim().toLowerCase();
    if (!trimmed) return;

    if (aliases.includes(trimmed)) {
      setAliasDialogData({
        type: "error",
        message: "This alias is already in the list",
        pendingAlias: trimmed,
      });
      setAliasDialogOpen(true);
      return;
    }

    // Check alias availability
    const result = await checkAliasAvailability({
      alias: trimmed,
      skillId: skill.id,
      currentAliases: aliases,
    });

    // Handle errors (cannot add)
    if ("error" in result && result.error) {
      setAliasDialogData({
        type: "error",
        message: result.error,
        matchedGlobalSkill:
          "matchedGlobalSkill" in result
            ? result.matchedGlobalSkill || null
            : null,
        pendingAlias: trimmed,
      });
      setAliasDialogOpen(true);
      return;
    }

    // Handle warnings (can add but warned)
    if ("warning" in result && result.warning) {
      setAliasDialogData({
        type: "warning",
        message: result.warning,
        pendingAlias: trimmed,
      });
      setAliasDialogOpen(true);
      return;
    }

    // No issues - add directly
    if (result.canAdd) {
      setAliases([...aliases, trimmed]);
      setNewAlias("");
    }
  };

  const handleConfirmAddAlias = () => {
    if (!aliasDialogData?.pendingAlias) return;

    // Add the alias (for warnings, user confirmed they want to add anyway)
    if (aliasDialogData.type === "warning") {
      setAliases([...aliases, aliasDialogData.pendingAlias]);
      setNewAlias("");
    }
    // For errors, don't add (unless it's a global skill match and they clicked "Add to Library")
    setAliasDialogOpen(false);
    setAliasDialogData(null);
  };

  const handleRemoveAlias = (aliasToRemove: string) => {
    setAliases(aliases.filter((a) => a !== aliasToRemove));
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
      validateSvg(svgContent);
      setIconSvg(svgContent);
    };
    reader.onerror = () => {
      setIconError("Failed to read file");
      setIconFileName("");
    };
    reader.readAsText(file);
  };

  const validateSvg = (svgCode: string) => {
    if (!svgCode.trim()) {
      setIconError("");
      return;
    }

    // Check if it starts with <svg
    if (!svgCode.trim().startsWith("<svg")) {
      setIconError("Invalid SVG format: must start with <svg>");
      return;
    }

    // Try to parse as XML to check for well-formedness
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgCode, "image/svg+xml");
      const parseError = doc.querySelector("parsererror");
      if (parseError) {
        setIconError("Invalid SVG: XML parsing error");
        return;
      }
      // Check if we have an svg element
      const svgElement = doc.querySelector("svg");
      if (!svgElement) {
        setIconError("Invalid SVG: no <svg> element found");
        return;
      }
      setIconError("");
    } catch (error) {
      setIconError("Invalid SVG: unable to parse");
    }
  };

  const handleIconPaste = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    validateSvg(value);
    setIconSvg(value);
  };

  const handleClearIcon = () => {
    setIconSvg("");
    setIconFileName("");
    setIconError("");
    const fileInput = document.getElementById(
      "edit-icon-file-input"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set("id", skill.id);
    formData.set("skillName", skillName);
    formData.set("description", description);
    formData.set("aliases", JSON.stringify(aliases));
    // Always send iconSvg, even if empty (to allow clearing)
    formData.set("iconSvg", iconSvg || "");

    // Close optimistically and refresh - don't wait for success state
    // This avoids the complexity of tracking stale vs new success
    startTransition(() => {
      formAction(formData);
      // Close immediately and refresh
      router.refresh();
      onOpenChange(false);
      onSuccess?.();
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddAlias();
    }
  };

  const isCustomSkill = !skill.skillTaxonomyId;

  return (
    <>
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto mx-4">
          <SheetHeader>
            <SheetTitle>Edit Skill</SheetTitle>
            <SheetDescription>
              Update the skill details, icon, and aliases.
            </SheetDescription>
          </SheetHeader>
          <Separator />
          <form onSubmit={handleSubmit} className="mt-6 space-y-6 px-4">
            {/* Skill Name */}
            <div className="space-y-2">
              <Label htmlFor="skill-name">
                Skill Name {!isCustomSkill && "(Read-only)"}
              </Label>
              <Input
                id="skill-name"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                disabled={!isCustomSkill}
                placeholder="Enter skill name"
                required
              />
              {!isCustomSkill && (
                <p className="text-xs text-muted-foreground">
                  Skill name cannot be changed for skills linked to global
                  skills.
                </p>
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
                          __html: normalizeSvgForIcon(iconSvg),
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
                      <SkillIcon name={skill.skillName} className="w-8 h-8" />
                    )}
                  </div>
                  {!iconSvg && (
                    <p className="text-xs text-muted-foreground mt-1 text-center">
                      Original icon
                    </p>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <div>
                    <input
                      type="file"
                      accept=".svg,image/svg+xml"
                      onChange={handleIconFileUpload}
                      className="hidden"
                      id="edit-icon-file-input"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() =>
                        document.getElementById("edit-icon-file-input")?.click()
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
                      <p className="text-sm text-destructive mt-1">
                        {iconError}
                      </p>
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
                  {aliases.map((alias, index) => (
                    <Badge
                      key={index}
                      variant="outline"
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
                  ))}
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
                    disabled={!newAlias.trim()}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isPending || transitionPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending || transitionPending || !!iconError}
              >
                {(isPending || transitionPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      {/* Discard Changes Dialog */}
      <AlertDialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard Changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to discard them?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Editing</AlertDialogCancel>
            <AlertDialogAction onClick={handleDiscard}>
              Discard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Alias Validation Dialog */}
      <AlertDialog open={aliasDialogOpen} onOpenChange={setAliasDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {aliasDialogData?.type === "error"
                ? "Cannot Add Alias"
                : "Alias Warning"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {aliasDialogData?.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {aliasDialogData?.type === "error" ? (
              <>
                {aliasDialogData.matchedGlobalSkill ? (
                  <>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        const formData = new FormData();
                        formData.set(
                          "skillTaxonomyId",
                          aliasDialogData.matchedGlobalSkill!.id
                        );
                        startTransition(() => {
                          addGlobalAction(formData);
                        });
                        setAliasDialogOpen(false);
                        setAliasDialogData(null);
                      }}
                      disabled={addGlobalPending}
                    >
                      Add "{aliasDialogData.matchedGlobalSkill.name}" to Library
                    </AlertDialogAction>
                  </>
                ) : (
                  <AlertDialogCancel>OK</AlertDialogCancel>
                )}
              </>
            ) : (
              <>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmAddAlias}>
                  Add Anyway
                </AlertDialogAction>
              </>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
