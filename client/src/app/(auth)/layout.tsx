import React from "react"

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="auth-layout">
      <div className="auth-layout__main">{children}</div>
    </div>
  )
}

export default Layout
