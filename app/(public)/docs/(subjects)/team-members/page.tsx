import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Shield, Users, Settings, CreditCard } from "lucide-react";

export default function TeamMembersPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">
          Team Members & Roles
        </h1>
        <p className="text-muted-foreground text-lg">
          Understand the difference between team owners and members, and how to
          manage your team effectively.
        </p>
      </div>

      <div className="space-y-8">
        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              reqCHECK supports team collaboration with two distinct roles:
              owners and members.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Team members allow you to collaborate with your colleagues on job
              postings, skills management, and application reviews. Each team
              has at least one owner who manages billing and team settings.
            </p>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-medium mb-2">Note:</p>
              <p className="text-sm text-muted-foreground">
                Team members are available on <strong>Pro plans</strong> only.
                Basic plans support a single user (the owner).
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Role Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Role Comparison</CardTitle>
            <CardDescription>
              Understanding the capabilities of each role
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Feature</TableHead>
                  <TableHead className="text-center">Owner</TableHead>
                  <TableHead className="text-center">Member</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">
                    View dashboard and analytics
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="default">Yes</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="default">Yes</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Create and manage jobs
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="default">Yes</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="default">Yes</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Manage skills library
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="default">Yes</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="default">Yes</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    View applications
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="default">Yes</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="default">Yes</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Manage integrations
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="default">Yes</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="default">Yes</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Invite team members
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="default">Yes</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">No</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Remove team members
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="default">Yes</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">No</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Manage billing & subscription
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="default">Yes</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">No</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Update team settings
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="default">Yes</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">No</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Access widget integration settings
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="default">Yes</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="default">Yes</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Owner Role */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Owner Role</CardTitle>
            </div>
            <CardDescription>
              Full administrative control over the team
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Team owners have complete control over all aspects of the team,
              including:
            </p>
            <ul className="space-y-2 list-disc list-inside text-muted-foreground">
              <li>All capabilities available to members</li>
              <li>Inviting and removing team members</li>
              <li>Managing billing and subscription settings</li>
              <li>Updating team configuration and preferences</li>
              <li>Accessing subscription and usage analytics</li>
            </ul>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-medium mb-1">Important:</p>
              <p className="text-sm text-muted-foreground">
                Each team must have at least one owner. If you're the only owner
                and you leave the team, ownership will be transferred to another
                member automatically.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Member Role */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <CardTitle>Member Role</CardTitle>
            </div>
            <CardDescription>
              Full access to day-to-day operations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Team members can perform all operational tasks but cannot manage
              team administration:
            </p>
            <ul className="space-y-2 list-disc list-inside text-muted-foreground">
              <li>Create and manage jobs</li>
              <li>Manage skills and challenge questions</li>
              <li>View and review applications</li>
              <li>Configure integrations</li>
              <li>Access widget integration settings</li>
              <li>View dashboard and analytics</li>
            </ul>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-medium mb-1">Note:</p>
              <p className="text-sm text-muted-foreground">
                Members cannot invite other team members, remove team members,
                or access billing settings. Contact your team owner for these
                actions.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Managing Team Members */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              <CardTitle>Managing Team Members</CardTitle>
            </div>
            <CardDescription>
              How to invite, manage, and remove team members
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Inviting Team Members</h3>
              <ol className="space-y-2 list-decimal list-inside text-muted-foreground">
                <li>Navigate to Team Settings (owner only)</li>
                <li>Click "Invite Team Member"</li>
                <li>
                  Enter the email address of the person you want to invite
                </li>
                <li>Select their role (Owner or Member)</li>
                <li>Click "Invite Member"</li>
              </ol>
              <p className="text-sm text-muted-foreground mt-2">
                The invited user will receive an email with instructions to join
                your team.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Removing Team Members</h3>
              <ol className="space-y-2 list-decimal list-inside text-muted-foreground">
                <li>Navigate to Team Settings (owner only)</li>
                <li>Find the team member you want to remove</li>
                <li>Click the remove button next to their name</li>
                <li>Confirm the removal</li>
              </ol>
              <p className="text-sm text-muted-foreground mt-2">
                Removed members will lose access to the team immediately but
                their historical activity will remain visible.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Changing Roles</h3>
              <p className="text-muted-foreground mb-2">
                To change a member's role (e.g., promote a member to owner):
              </p>
              <ol className="space-y-2 list-decimal list-inside text-muted-foreground">
                <li>Navigate to Team Settings (owner only)</li>
                <li>Find the team member whose role you want to change</li>
                <li>Update their role using the role selector</li>
                <li>Save the changes</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Plan Requirements */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <CardTitle>Plan Requirements</CardTitle>
            </div>
            <CardDescription>Which plans support team members</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Pro Plan</h3>
              <p className="text-muted-foreground">
                Pro plans support 5 additional team members.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Basic Plan</h3>
              <p className="text-muted-foreground">
                Basic plans support a single user (the team owner). Team members
                are not available on Basic plans. If you need to collaborate
                with team members, upgrade to Pro.
              </p>
            </div>

            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-medium mb-1">Downgrading Warning:</p>
              <p className="text-sm text-muted-foreground">
                If you downgrade from Pro to Basic, all team members (except the
                owner) will lose access to the team at the start of your next
                billing cycle. Make sure to communicate this change with your
                team before downgrading.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
