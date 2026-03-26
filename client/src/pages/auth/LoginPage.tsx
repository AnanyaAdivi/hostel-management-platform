import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store/authStore'
import sauLogo from '@/assets/sau-logo.png'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Minimum 6 characters'),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      await login(data.email, data.password)
      navigate('/dashboard')
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid credentials'
      setError('password', { message: msg })
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'var(--glow-primary)',
          filter: 'blur(80px)',
          top: '10%',
          left: '15%',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'var(--glow-cyan)',
          filter: 'blur(80px)',
          bottom: '15%',
          right: '20%',
          pointerEvents: 'none',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="card-glass"
        style={{ width: '100%', maxWidth: 420, padding: '2.5rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '2rem' }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: 'rgba(255,255,255,0.96)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <img
              src={sauLogo}
              alt="South Asian University logo"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div>
            <h1 style={{ fontFamily: 'Sora', fontSize: 22, fontWeight: 700, margin: 0 }}>
              HostelSync
            </h1>
            <p style={{ color: 'var(--text-tertiary)', fontSize: 12, margin: 0 }}>
              South Asian University
            </p>
          </div>
        </div>

        <h2 style={{ fontFamily: 'Sora', fontSize: 20, fontWeight: 600, marginBottom: '0.25rem' }}>
          Welcome back
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: '1.75rem' }}>
          Sign in to your hostel portal
        </p>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--text-secondary)' }}>
              Email address
            </label>
            <input
              {...register('email')}
              placeholder="you@sau.ac.in"
              style={{
                width: '100%',
                background: 'var(--bg-tertiary)',
                border: `1px solid ${errors.email ? 'var(--accent-danger)' : 'var(--border-default)'}`,
                borderRadius: 8,
                padding: '10px 14px',
                color: 'var(--text-primary)',
                fontSize: 14,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            {errors.email ? <p style={{ color: 'var(--accent-danger)', fontSize: 12, marginTop: 4 }}>{errors.email.message}</p> : null}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--text-secondary)' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                {...register('password')}
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  background: 'var(--bg-tertiary)',
                  border: `1px solid ${errors.password ? 'var(--accent-danger)' : 'var(--border-default)'}`,
                  borderRadius: 8,
                  padding: '10px 40px 10px 14px',
                  color: 'var(--text-primary)',
                  fontSize: 14,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPw((state) => !state)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-tertiary)',
                  cursor: 'pointer',
                }}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password ? <p style={{ color: 'var(--accent-danger)', fontSize: 12, marginTop: 4 }}>{errors.password.message}</p> : null}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: 15,
              marginTop: 8,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div style={{ marginTop: 14, textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)' }}>
          Need an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent-secondary)' }}>
            Register
          </Link>
        </div>

        <div
          style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: 'var(--bg-tertiary)',
            borderRadius: 8,
            fontSize: 12,
            color: 'var(--text-tertiary)',
          }}
        >
          <strong style={{ color: 'var(--text-secondary)' }}>Demo accounts:</strong>
          <br />
          Admin: admin@sau.ac.in / admin123
          <br />
          Warden: warden@sau.ac.in / warden123
          <br />
          Student: student@sau.ac.in / student123
        </div>
      </motion.div>
    </div>
  )
}
