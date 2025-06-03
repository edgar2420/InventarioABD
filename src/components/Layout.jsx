import Sidebar from './Sidebar'

const Layout = ({ children }) => {
    return (
        <div className="flex h-screen w-screen">
            <Sidebar />
            <main className="flex-1 h-screen overflow-y-auto bg-[#f9fafb]">
                {children}
            </main>
        </div>
    )
}

export default Layout
