"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Save } from "lucide-react";

const formSchema = z.object({
    displayName: z.string().min(2, {
        message: "Display name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    marketingEmails: z.boolean(),
    securityAlerts: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export function SettingsForm() {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            displayName: "Admin User",
            email: "admin@acme.com",
            marketingEmails: false,
            securityAlerts: true,
        },
    });

    function onSubmit(values: FormValues) {
        toast.success("Settings updated successfully", {
            description: "Your preferences have been saved to the server.",
            icon: <Save className="w-4 h-4" />
        });
        console.log("Form Values:", values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                {/* Profile Card Block */}
                <div className="rounded-[var(--ios-radius-xl)] border border-border bg-card overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-border/50 bg-muted/20">
                        <h3 className="text-lg font-medium tracking-tight">Profile Information</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Update your account's public-facing details.
                        </p>
                    </div>
                    <div className="p-6 space-y-6">
                        <FormField
                            control={form.control}
                            name="displayName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Display Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" className="rounded-[var(--ios-radius-md)]" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is your public display name.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="john@example.com" className="rounded-[var(--ios-radius-md)]" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Used for login and direct communication.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Notifications Card Block */}
                <div className="rounded-[var(--ios-radius-xl)] border border-border bg-card overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-border/50 bg-muted/20">
                        <h3 className="text-lg font-medium tracking-tight">Communication Preferences</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Manage how we contact you.
                        </p>
                    </div>
                    <div className="p-6 space-y-6">
                        <FormField
                            control={form.control}
                            name="marketingEmails"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-[var(--ios-radius-lg)] border border-border/50 p-4 hover:shadow-sm transition-shadow">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base text-foreground font-medium">Marketing Emails</FormLabel>
                                        <FormDescription>
                                            Receive emails about new products, features, and more.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="securityAlerts"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-[var(--ios-radius-lg)] border border-border/50 p-4 hover:shadow-sm transition-shadow">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base text-foreground font-medium">Security Alerts</FormLabel>
                                        <FormDescription>
                                            Receive emails about your account security.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" className="rounded-[var(--ios-radius-full)] px-6">
                        Cancel
                    </Button>
                    <Button type="submit" className="rounded-[var(--ios-radius-full)] px-8 shadow-md">
                        Save Changes
                    </Button>
                </div>

            </form>
        </Form>
    );
}
