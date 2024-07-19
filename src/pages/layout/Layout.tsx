import React from 'react';

type Props = {
    children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
    return (
        <div style={{ position: "relative", height: "100vh" }}>
            <div style={{ height: "100%", width: "100%" }}>
                {children}

            </div>
        </div>
    );
}

export default Layout;
