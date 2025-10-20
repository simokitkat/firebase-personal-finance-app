import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/lib/shadcn/components/ui/card";

export default function Overview() {
  return (
    <div className="max-w-7xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Dashboard Content</CardTitle>
          <CardDescription>
            This is where your dashboard content would go. Currently viewing
            some tab
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            This is a placeholder for the dashboard content. In a real
            application, this area would display different content based on the
            selected navigation item.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
