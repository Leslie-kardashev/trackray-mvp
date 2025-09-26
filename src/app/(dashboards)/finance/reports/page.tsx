
import { ReportAgeing } from "@/components/report-ageing";
import { ReportPL } from "@/components/report-pl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Clock, FileText } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold flex items-center gap-2">
          <BarChart3 />
          Financial Reports
        </h1>
        <p className="text-muted-foreground">
          Analyze your company's performance with standard financial statements.
        </p>
      </div>
      <Tabs defaultValue="pl">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pl">Profit & Loss</TabsTrigger>
          <TabsTrigger value="balance-sheet">Balance Sheet</TabsTrigger>
          <TabsTrigger value="ageing">A/R Ageing</TabsTrigger>
          <TabsTrigger value="ledger">Ledger Drilldown</TabsTrigger>
        </TabsList>
        <TabsContent value="pl">
            <ReportPL />
        </TabsContent>
        <TabsContent value="balance-sheet">
             <Card>
                <CardHeader>
                    <CardTitle>Balance Sheet</CardTitle>
                    <CardDescription>A snapshot of assets, liabilities, and equity. (Coming Soon)</CardDescription>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground p-12">
                    <p>Balance Sheet report will be available here.</p>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="ageing">
            <ReportAgeing />
        </TabsContent>
        <TabsContent value="ledger">
             <Card>
                <CardHeader>
                    <CardTitle>Ledger Drilldown</CardTitle>
                    <CardDescription>Search and view detailed ledger entries. (Coming Soon)</CardDescription>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground p-12">
                    <p>Ledger drilldown functionality will be available here.</p>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
