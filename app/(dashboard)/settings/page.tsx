import type { Metadata } from "next";
import { PageHeader, SettingsForm } from "@/components/dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = {
    title: "Settings",
};

/** Settings categories — each will become its own tab/section */
export default function SettingsPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            <PageHeader
                title="Settings"
                description="Manage your account preferences and integrations."
            />

            <Tabs defaultValue="general" className="w-full">
                {/* Tabs Navigation */}
                <div className="border-b border-border/50 pb-px mb-8">
                    <TabsList className="bg-transparent h-10 p-0 overflow-x-auto flex w-full sm:w-auto justify-start">
                        <TabsTrigger
                            value="general"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 sm:px-6 h-full font-medium"
                        >
                            General
                        </TabsTrigger>
                        <TabsTrigger
                            value="team"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 sm:px-6 h-full font-medium"
                        >
                            Team
                        </TabsTrigger>
                        <TabsTrigger
                            value="billing"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 sm:px-6 h-full font-medium"
                        >
                            Billing
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* Tab Content */}
                <TabsContent value="general" className="mt-0">
                    <div className="max-w-3xl">
                        <SettingsForm />
                    </div>
                </TabsContent>

                <TabsContent value="team" className="mt-0">
                    <div className="rounded-[var(--ios-radius-xl)] border border-border bg-card p-6 shadow-sm overflow-hidden flex items-center justify-center min-h-[300px]">
                        <p className="text-muted-foreground font-medium">Team settings coming soon</p>
                    </div>
                </TabsContent>

                <TabsContent value="billing" className="mt-0">
                    <div className="rounded-[var(--ios-radius-xl)] border border-border bg-card p-6 shadow-sm overflow-hidden flex items-center justify-center min-h-[300px]">
                        <p className="text-muted-foreground font-medium">Billing history coming soon</p>
                    </div>
                </TabsContent>
            </Tabs>

        </div>
    );
}
