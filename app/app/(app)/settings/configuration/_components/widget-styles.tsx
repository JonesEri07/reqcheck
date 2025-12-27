"use client";

import { useActionState, useEffect, useState } from "react";
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
import { Loader2 } from "lucide-react";
import { updateWidgetStyles } from "../actions";
import { useToastAction } from "@/lib/utils/use-toast-action";
import useSWR from "swr";
import type { ActionState } from "@/lib/auth/proxy";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface WidgetStyles {
  fontColor?: string;
  backgroundColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  accentColor?: string;
}

export function WidgetStyles() {
  const { data: teamData, mutate } = useSWR<any>("/api/team", fetcher);
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    updateWidgetStyles,
    {}
  );

  useToastAction(state);

  const [formData, setFormData] = useState<WidgetStyles>({
    fontColor: "",
    backgroundColor: "",
    buttonColor: "",
    buttonTextColor: "",
    accentColor: "",
  });

  useEffect(() => {
    if (teamData?.widgetStyles) {
      setFormData({
        fontColor: teamData.widgetStyles.fontColor || "",
        backgroundColor: teamData.widgetStyles.backgroundColor || "",
        buttonColor: teamData.widgetStyles.buttonColor || "",
        buttonTextColor: teamData.widgetStyles.buttonTextColor || "",
        accentColor: teamData.widgetStyles.accentColor || "",
      });
    }
  }, [teamData]);

  useEffect(() => {
    if (state?.success) {
      mutate();
    }
  }, [state?.success, mutate]);

  if (!teamData) {
    return null;
  }

  return (
    <Card id="widget-styles">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Widget Styles</CardTitle>
            <CardDescription>
              Customize the appearance of the reqCHECK widget
            </CardDescription>
          </div>
          <Button type="submit" form="widget-styles-form" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Styles"
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form id="widget-styles-form" action={formAction} className="space-y-6">
          {/* Font Color */}
          <div className="space-y-2">
            <Label htmlFor="fontColor">Font Color</Label>
            <p className="text-sm text-muted-foreground">
              Color for all text in the widget
            </p>
            <div className="flex gap-2">
              <Input
                type="color"
                id="fontColor"
                name="fontColor"
                value={formData.fontColor || "#1f2937"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    fontColor: e.target.value,
                  }))
                }
                className="w-20 h-10"
              />
              <Input
                type="text"
                value={formData.fontColor || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    fontColor: e.target.value,
                  }))
                }
                placeholder="#1f2937"
              />
            </div>
          </div>

          {/* Background Color */}
          <div className="space-y-2">
            <Label htmlFor="backgroundColor">Background Color</Label>
            <p className="text-sm text-muted-foreground">
              Background color for modals and overlays
            </p>
            <div className="flex gap-2">
              <Input
                type="color"
                id="backgroundColor"
                name="backgroundColor"
                value={formData.backgroundColor || "#ffffff"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    backgroundColor: e.target.value,
                  }))
                }
                className="w-20 h-10"
              />
              <Input
                type="text"
                value={formData.backgroundColor || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    backgroundColor: e.target.value,
                  }))
                }
                placeholder="#ffffff"
              />
            </div>
          </div>

          {/* Button Color */}
          <div className="space-y-2">
            <Label htmlFor="buttonColor">Button Color</Label>
            <p className="text-sm text-muted-foreground">
              Background color for all buttons
            </p>
            <div className="flex gap-2">
              <Input
                type="color"
                id="buttonColor"
                name="buttonColor"
                value={formData.buttonColor || "#000000"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    buttonColor: e.target.value,
                  }))
                }
                className="w-20 h-10"
              />
              <Input
                type="text"
                value={formData.buttonColor || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    buttonColor: e.target.value,
                  }))
                }
                placeholder="#000000"
              />
            </div>
          </div>

          {/* Button Text Color */}
          <div className="space-y-2">
            <Label htmlFor="buttonTextColor">Button Text Color</Label>
            <p className="text-sm text-muted-foreground">
              Text color for buttons
            </p>
            <div className="flex gap-2">
              <Input
                type="color"
                id="buttonTextColor"
                name="buttonTextColor"
                value={formData.buttonTextColor || "#ffffff"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    buttonTextColor: e.target.value,
                  }))
                }
                className="w-20 h-10"
              />
              <Input
                type="text"
                value={formData.buttonTextColor || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    buttonTextColor: e.target.value,
                  }))
                }
                placeholder="#ffffff"
              />
            </div>
          </div>

          {/* Accent Color */}
          <div className="space-y-2">
            <Label htmlFor="accentColor">Accent Color</Label>
            <p className="text-sm text-muted-foreground">
              Color for selected answers, progress bars, and success states
            </p>
            <div className="flex gap-2">
              <Input
                type="color"
                id="accentColor"
                name="accentColor"
                value={formData.accentColor || "#000000"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    accentColor: e.target.value,
                  }))
                }
                className="w-20 h-10"
              />
              <Input
                type="text"
                value={formData.accentColor || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    accentColor: e.target.value,
                  }))
                }
                placeholder="#000000"
              />
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
