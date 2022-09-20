const Header = () => {
    return (
        <header className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
                <div className="uppercase font-mono">
                    <div className="border-y-4 border-white">
                        <h1 className="font-semibold text-3xl">The Vault</h1>
                        <h2 className="tracking-tight font-light text-sm">Secure Token Locking</h2>
                    </div>
                </div>
                <div>Button</div>
            </div>
        </header>
    )
}

export default Header