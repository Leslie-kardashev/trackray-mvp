
import { TallyVoucherManager } from "@/components/tally-voucher-manager";
import { TallyAiChat } from "@/components/tally-ai-chat";
import { TallyConnectionGuide } from "@/components/tally-connection-guide";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, HelpCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TallyForcePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold flex items-center gap-2">
          <Sparkles className="text-primary" />
          Tally Force AI
        </h1>
        <p className="text-muted-foreground">
          Your intelligent command center for analyzing, editing, and understanding your Tally data.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        <div className="lg:col-span-3">
          <TallyVoucherManager />
        </div>
        <div className="lg:col-span-2 space-y-8">
          <div className="sticky top-24 space-y-8">
            <TallyAiChat />
             <Tabs defaultValue="guide">
                <TabsList>
                    <TabsTrigger value="guide">
                        <HelpCircle className="mr-2"/>
                        Connection Guide
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="guide">
                    <Card>
                        <CardContent className="p-6">
                            <TallyConnectionGuide />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
