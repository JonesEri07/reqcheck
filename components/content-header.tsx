"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export interface HeaderAction {
  label?: string;
  onClick?: () => void;
  href?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  icon?: React.ReactNode;
  disabled?: boolean;
  asChild?: boolean;
  component?: React.ReactNode; // Custom component to render instead of button
}

export interface MoreAction {
  label: string;
  onClick?: () => void;
  href?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  destructive?: boolean;
}

export interface BreadcrumbNavItem {
  label: string;
  href?: string;
}

interface ContentHeaderProps {
  title: string;
  subtitle?: string | React.ReactNode;
  actions?: HeaderAction[];
  moreActions?: MoreAction[];
  breadcrumbs?: BreadcrumbNavItem[];
  className?: string;
}

export function ContentHeader({
  title,
  subtitle,
  actions = [],
  moreActions = [],
  breadcrumbs,
  className,
}: ContentHeaderProps) {
  const hasActions = actions.length > 0 || moreActions.length > 0;

  return (
    <div className={cn("mb-6", className)}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <React.Fragment key={index}>
                  <BreadcrumbItem>
                    {isLast || !crumb.href ? (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={crumb.href}>{crumb.label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      )}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg lg:text-2xl font-medium text-foreground">
            {title}
          </h1>
          {subtitle && (
            <div className="mt-1 sm:mt-2">
              {typeof subtitle === "string" ? (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              ) : (
                subtitle
              )}
            </div>
          )}
        </div>
        {hasActions && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Primary Actions - Hidden on mobile if more than 1, shown on tablet+ */}
            {actions.length > 0 && (
              <div className="hidden sm:flex items-center gap-2">
                {actions.map((action, index) => {
                  // Render custom component if provided
                  if (action.component) {
                    return (
                      <React.Fragment key={index}>
                        {action.component}
                      </React.Fragment>
                    );
                  }

                  if (action.asChild && action.href) {
                    return (
                      <Button
                        key={index}
                        asChild
                        variant={action.variant || "default"}
                        size={action.size || "sm"}
                        disabled={action.disabled}
                        className="gap-2"
                      >
                        <a href={action.href}>
                          {action.icon}
                          {action.label}
                        </a>
                      </Button>
                    );
                  }
                  return (
                    <Button
                      key={index}
                      variant={action.variant || "default"}
                      size={action.size || "sm"}
                      onClick={action.onClick}
                      disabled={action.disabled}
                      className="gap-2"
                    >
                      {action.icon}
                      {action.label}
                    </Button>
                  );
                })}
              </div>
            )}
            {/* Mobile: Show first action as primary, rest in menu */}
            {actions.length > 0 && (
              <div className="flex sm:hidden items-center gap-2">
                {actions.length === 1 ? (
                  actions[0].component ? (
                    actions[0].component
                  ) : actions[0].asChild && actions[0].href ? (
                    <Button
                      asChild
                      variant={actions[0].variant || "default"}
                      size={actions[0].size || "sm"}
                      disabled={actions[0].disabled}
                      className="gap-2"
                    >
                      <a href={actions[0].href}>
                        {actions[0].icon}
                        {actions[0].label}
                      </a>
                    </Button>
                  ) : (
                    <Button
                      variant={actions[0].variant || "default"}
                      size={actions[0].size || "sm"}
                      onClick={actions[0].onClick}
                      disabled={actions[0].disabled}
                      className="gap-2"
                    >
                      {actions[0].icon}
                      {actions[0].label}
                    </Button>
                  )
                ) : (
                  <>
                    {actions[0].component ? (
                      actions[0].component
                    ) : actions[0].asChild && actions[0].href ? (
                      <Button
                        asChild
                        variant={actions[0].variant || "default"}
                        size={actions[0].size || "sm"}
                        disabled={actions[0].disabled}
                        className="gap-2"
                      >
                        <a href={actions[0].href}>
                          {actions[0].icon}
                          {actions[0].label}
                        </a>
                      </Button>
                    ) : (
                      <Button
                        variant={actions[0].variant || "default"}
                        size={actions[0].size || "sm"}
                        onClick={actions[0].onClick}
                        disabled={actions[0].disabled}
                        className="gap-2"
                      >
                        {actions[0].icon}
                        {actions[0].label}
                      </Button>
                    )}
                    {(actions.length > 1 || moreActions.length > 0) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {actions.slice(1).map((action, index) => (
                            <DropdownMenuItem
                              key={`action-${index}`}
                              onClick={action.onClick}
                              disabled={action.disabled}
                              asChild={action.href ? true : false}
                            >
                              {action.href ? (
                                <a
                                  href={action.href}
                                  className="flex items-center gap-2"
                                >
                                  {action.icon}
                                  {action.label}
                                </a>
                              ) : (
                                <>
                                  {action.icon}
                                  {action.label}
                                </>
                              )}
                            </DropdownMenuItem>
                          ))}
                          {moreActions.length > 0 && actions.length > 1 && (
                            <DropdownMenuItem disabled>---</DropdownMenuItem>
                          )}
                          {moreActions.map((action, index) => (
                            <DropdownMenuItem
                              key={`more-${index}`}
                              onClick={action.onClick}
                              disabled={action.disabled}
                              className={cn(
                                action.destructive && "text-destructive"
                              )}
                              asChild={action.href ? true : false}
                            >
                              {action.href ? (
                                <a
                                  href={action.href}
                                  className="flex items-center gap-2"
                                >
                                  {action.icon}
                                  {action.label}
                                </a>
                              ) : (
                                <>
                                  {action.icon}
                                  {action.label}
                                </>
                              )}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </>
                )}
              </div>
            )}
            {/* More Actions Menu - Desktop only if no primary actions, or always if primary actions exist */}
            {moreActions.length > 0 && (
              <div
                className={cn(actions.length === 0 ? "flex" : "hidden sm:flex")}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {moreActions.map((action, index) => (
                      <DropdownMenuItem
                        key={index}
                        onClick={action.onClick}
                        disabled={action.disabled}
                        className={cn(action.destructive && "text-destructive")}
                        asChild={action.href ? true : false}
                      >
                        {action.href ? (
                          <a
                            href={action.href}
                            className="flex items-center gap-2"
                          >
                            {action.icon}
                            {action.label}
                          </a>
                        ) : (
                          <>
                            {action.icon}
                            {action.label}
                          </>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
