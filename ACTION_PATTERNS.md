# Action Patterns & Toast Notifications

This document defines the standard patterns for server actions and toast notifications used throughout the application.

## Overview

All server actions should return an `ActionState` that includes optional `error` and `success` messages. Client components automatically display these messages as toast notifications using Sonner.

## Server Actions Pattern

### Action State Type

```typescript
type ActionState = {
  error?: string;
  success?: string;
  [key: string]: any; // Additional properties for form state preservation
};
```

### Standard Action Structure

```typescript
export const myAction = validatedAction(schema, async (data, formData) => {
  try {
    // Perform action
    await doSomething(data);

    return {
      success: "Action completed successfully",
      // Preserve form data if needed
      ...data,
    };
  } catch (error: any) {
    console.error("Action error:", error);
    return {
      error: error.message || "An error occurred",
      // Preserve form data
      ...data,
    };
  }
});
```

### Error Handling Best Practices

1. **Always return error messages** - Don't throw errors, return them in the ActionState
2. **Preserve form data** - Include form fields in the return so they persist on error
3. **Use specific error messages** - Help users understand what went wrong
4. **Log errors** - Use `console.error` for debugging

Example:

```typescript
if (existingUser.length > 0) {
  return {
    error: "An account with this email already exists. Please sign in instead.",
    email,
    password,
    // ... other form fields
  };
}
```

## Client Component Pattern

### Using useToastAction Hook

The `useToastAction` hook automatically displays toasts based on action state:

```typescript
"use client";

import { useActionState } from "react";
import { useToastAction } from "@/lib/utils/use-toast-action";
import { myAction } from "./actions";

export function MyForm() {
  const [state, formAction, pending] = useActionState(myAction, { error: "" });

  // Automatically show toasts
  useToastAction(state);

  return <form action={formAction}>{/* Form fields */}</form>;
}
```

### Manual Toast Display

If you need more control, use `showToastFromAction` directly:

```typescript
import { showToastFromAction } from "@/lib/utils/toast-action";

// In useEffect or event handler
showToastFromAction(state, {
  onSuccess: () => {
    // Optional callback on success
  },
  onError: () => {
    // Optional callback on error
  },
});
```

## Toast Types

The toast system automatically determines the toast type:

- **Error** - When `state.error` is present
- **Success** - When `state.success` is present

## Files

- **Server Actions**: `lib/utils/toast-action.ts` - Utility functions for toast handling
- **Client Hook**: `lib/utils/use-toast-action.ts` - React hook for automatic toasts
- **Toast Component**: `components/ui/sonner.tsx` - Sonner toast component
- **Root Layout**: `app/layout.tsx` - Includes `<Toaster />` component

## Migration Guide

To migrate existing actions to use toasts:

1. **Remove inline error displays** from JSX:

   ```tsx
   // Remove this:
   {
     state?.error && <div className="text-red-500">{state.error}</div>;
   }
   ```

2. **Add useToastAction hook**:

   ```tsx
   import { useToastAction } from "@/lib/utils/use-toast-action";

   useToastAction(state);
   ```

3. **Ensure actions return ActionState** with `error` or `success` properties

4. **Test** - Verify toasts appear correctly for both success and error cases

## Examples

### Sign Up Action

See `app/(auth)/actions.ts` for a complete example of:

- Error handling with try-catch
- Specific error messages
- Form data preservation
- Success/error state returns

### Login Component

See `app/(auth)/login.tsx` for a complete example of:

- Using `useActionState` with server actions
- Using `useToastAction` for automatic toasts
- Form submission handling
