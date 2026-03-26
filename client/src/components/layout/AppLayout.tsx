import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from './Sidebar'
import Header from './Header'
import { useSocket } from '@/hooks/useSocket'
import ChatWidget from '@/components/chatbot/ChatWidget'

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  useSocket()

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'radial-gradient(circle at top left, rgba(108,99,255,0.08), transparent 25%), var(--bg-primary)',
      }}
    >
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((current) => !current)}
      />
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          marginLeft: collapsed ? 64 : 240,
          transition: 'margin 0.3s ease',
        }}
      >
        <Header />
        <main style={{ flex: 1, padding: '1.5rem 2rem', overflowY: 'auto' }}>
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <ChatWidget />
    </div>
  )
}
