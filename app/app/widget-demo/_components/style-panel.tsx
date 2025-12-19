"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export interface WidgetStyles {
  primaryColor: string;
  primaryTextColor: string;
  backgroundColor: string;
  textColor: string;
  secondaryTextColor: string;
  borderColor: string;
  successColor: string;
  errorColor: string;
  fontFamily: string;
  fontSize: string;
  headingFontSize: string;
  borderRadius: string;
  padding: string;
  buttonPadding: string;
  buttonBorderRadius: string;
  modalMaxWidth: string;
  modalBorderRadius: string;
}

interface StylePanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  styles: WidgetStyles;
  onStylesChange: (styles: WidgetStyles) => void;
}

export function StylePanel({
  open,
  onOpenChange,
  styles,
  onStylesChange,
}: StylePanelProps) {
  const updateStyle = (key: keyof WidgetStyles, value: string) => {
    onStylesChange({ ...styles, [key]: value });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Style Customization</SheetTitle>
        </SheetHeader>

        <div className="mt-6">
          <Tabs defaultValue="colors" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="colors">Colors</TabsTrigger>
              <TabsTrigger value="typography">Typography</TabsTrigger>
              <TabsTrigger value="spacing">Spacing</TabsTrigger>
            </TabsList>

            <TabsContent value="colors" className="space-y-4 mt-4">
              <div>
                <Label>Primary Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="color"
                    value={styles.primaryColor}
                    onChange={(e) =>
                      updateStyle("primaryColor", e.target.value)
                    }
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={styles.primaryColor}
                    onChange={(e) =>
                      updateStyle("primaryColor", e.target.value)
                    }
                    placeholder="#000000"
                  />
                </div>
              </div>

              <div>
                <Label>Primary Text Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="color"
                    value={styles.primaryTextColor}
                    onChange={(e) =>
                      updateStyle("primaryTextColor", e.target.value)
                    }
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={styles.primaryTextColor}
                    onChange={(e) =>
                      updateStyle("primaryTextColor", e.target.value)
                    }
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              <div>
                <Label>Background Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="color"
                    value={styles.backgroundColor}
                    onChange={(e) =>
                      updateStyle("backgroundColor", e.target.value)
                    }
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={styles.backgroundColor}
                    onChange={(e) =>
                      updateStyle("backgroundColor", e.target.value)
                    }
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              <div>
                <Label>Text Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="color"
                    value={styles.textColor}
                    onChange={(e) => updateStyle("textColor", e.target.value)}
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={styles.textColor}
                    onChange={(e) => updateStyle("textColor", e.target.value)}
                    placeholder="#1f2937"
                  />
                </div>
              </div>

              <div>
                <Label>Secondary Text Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="color"
                    value={styles.secondaryTextColor}
                    onChange={(e) =>
                      updateStyle("secondaryTextColor", e.target.value)
                    }
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={styles.secondaryTextColor}
                    onChange={(e) =>
                      updateStyle("secondaryTextColor", e.target.value)
                    }
                    placeholder="#6b7280"
                  />
                </div>
              </div>

              <div>
                <Label>Border Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="color"
                    value={styles.borderColor}
                    onChange={(e) => updateStyle("borderColor", e.target.value)}
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={styles.borderColor}
                    onChange={(e) => updateStyle("borderColor", e.target.value)}
                    placeholder="#e5e7eb"
                  />
                </div>
              </div>

              <div>
                <Label>Success Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="color"
                    value={styles.successColor}
                    onChange={(e) =>
                      updateStyle("successColor", e.target.value)
                    }
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={styles.successColor}
                    onChange={(e) =>
                      updateStyle("successColor", e.target.value)
                    }
                    placeholder="#059669"
                  />
                </div>
              </div>

              <div>
                <Label>Error Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="color"
                    value={styles.errorColor}
                    onChange={(e) => updateStyle("errorColor", e.target.value)}
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={styles.errorColor}
                    onChange={(e) => updateStyle("errorColor", e.target.value)}
                    placeholder="#dc2626"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="typography" className="space-y-4 mt-4">
              <div>
                <Label>Font Family</Label>
                <Input
                  type="text"
                  value={styles.fontFamily}
                  onChange={(e) => updateStyle("fontFamily", e.target.value)}
                  placeholder="Arial, sans-serif"
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Font Size</Label>
                <Input
                  type="text"
                  value={styles.fontSize}
                  onChange={(e) => updateStyle("fontSize", e.target.value)}
                  placeholder="1rem"
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Heading Font Size</Label>
                <Input
                  type="text"
                  value={styles.headingFontSize}
                  onChange={(e) =>
                    updateStyle("headingFontSize", e.target.value)
                  }
                  placeholder="1.75rem"
                  className="mt-1"
                />
              </div>
            </TabsContent>

            <TabsContent value="spacing" className="space-y-4 mt-4">
              <div>
                <Label>Border Radius</Label>
                <Input
                  type="text"
                  value={styles.borderRadius}
                  onChange={(e) => updateStyle("borderRadius", e.target.value)}
                  placeholder="8px"
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Padding</Label>
                <Input
                  type="text"
                  value={styles.padding}
                  onChange={(e) => updateStyle("padding", e.target.value)}
                  placeholder="1rem"
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Button Padding</Label>
                <Input
                  type="text"
                  value={styles.buttonPadding}
                  onChange={(e) => updateStyle("buttonPadding", e.target.value)}
                  placeholder="0.75rem 1.5rem"
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Button Border Radius</Label>
                <Input
                  type="text"
                  value={styles.buttonBorderRadius}
                  onChange={(e) =>
                    updateStyle("buttonBorderRadius", e.target.value)
                  }
                  placeholder="6px"
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Modal Max Width</Label>
                <Input
                  type="text"
                  value={styles.modalMaxWidth}
                  onChange={(e) => updateStyle("modalMaxWidth", e.target.value)}
                  placeholder="700px"
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Modal Border Radius</Label>
                <Input
                  type="text"
                  value={styles.modalBorderRadius}
                  onChange={(e) =>
                    updateStyle("modalBorderRadius", e.target.value)
                  }
                  placeholder="12px"
                  className="mt-1"
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
