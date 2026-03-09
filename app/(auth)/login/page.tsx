import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign In",
    description: "Sign in to your account",
};

export default function LoginPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-muted/40">
            <div className="w-full max-w-sm rounded-[var(--radius-xl)] bg-card border border-border shadow-md p-8 space-y-6">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                        Welcome back
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Sign in to continue to your dashboard.
                    </p>
                </div>

                {/* Form will be wired up in a later step */}
                <div className="space-y-4">
                    <div className="h-10 rounded-lg bg-muted animate-pulse" />
                    <div className="h-10 rounded-lg bg-muted animate-pulse" />
                    <div className="h-10 rounded-lg bg-primary/10 animate-pulse" />
                </div>

                <p className="text-xs text-center text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <a href="#" className="underline underline-offset-4 hover:text-foreground transition-colors">
                        Request access
                    </a>
                </p>
            </div>
        </main>
    );
}
