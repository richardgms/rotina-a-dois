export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header TODO */}
            <main>{children}</main>
            {/* BottomNav TODO */}
        </div>
    );
}
