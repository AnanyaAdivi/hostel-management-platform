import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import api from '@/services/api'
import sauLogo from '@/assets/sau-logo.png'
import { useState } from 'react'

const sportsOptions = [
  'Football',
  'Cricket',
  'Badminton',
  'Basketball',
  'Table Tennis',
  'Volleyball',
  'Athletics',
  'Chess',
]

const schema = z.object({
  name: z.string().min(2, 'Enter your full name'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Minimum 6 characters'),
  phone: z.string().min(8, 'Enter a valid phone number'),
  enrollmentNo: z.string().min(4, 'Enrollment number is required'),
  course: z.string().min(2, 'Course is required'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  sportsInterests: z.array(z.string()).min(1, 'Select at least one sport'),
  careerGoal: z.string().min(10, 'Please add a career goal'),
  address: z.string().min(10, 'Address is required'),
  parentContactNo: z.string().min(8, 'Parent contact is required'),
  avatarUrl: z.string().min(1, 'Student image is required'),
})

type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const navigate = useNavigate()
  const [uploading, setUploading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { sportsInterests: [] },
  })

  const sports = watch('sportsInterests') || []
  const avatarUrl = watch('avatarUrl')

  const submit = async (values: FormData) => {
    try {
      await api.post('/auth/register', values)
      toast.success(
        'Registration submitted. Wait for admin or warden approval before signing in.'
      )
      navigate('/login')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed')
    }
  }

  const uploadAvatar = async (file?: File | null) => {
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setValue('avatarUrl', res.data.url, { shouldValidate: true })
      toast.success('Student photo uploaded')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Image upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        display: 'grid',
        placeItems: 'center',
        padding: 16,
      }}
    >
      <div className="card-glass" style={{ width: '100%', maxWidth: 760, padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: 'rgba(255,255,255,0.96)',
              display: 'grid',
              placeItems: 'center',
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
            <h1 style={{ margin: 0, fontFamily: 'Sora', fontSize: 22 }}>Student Registration</h1>
            <p style={{ margin: 0, color: 'var(--text-tertiary)', fontSize: 12 }}>
              Approval is required before hostel access is enabled
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(submit)} style={{ display: 'grid', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[
              ['name', 'Full name', 'Arjun Mehta'],
              ['email', 'Email', 'student@sau.ac.in'],
              ['password', 'Password', 'Password'],
              ['phone', 'Phone number', '+91-9876543210'],
              ['enrollmentNo', 'Enrollment number', 'SAU-2026-014'],
              ['course', 'Course detail', 'M.Tech Computer Science'],
              ['careerGoal', 'Career goal', 'Become a data scientist'],
              ['parentContactNo', 'Parents contact no', '+91-9811111111'],
            ].map(([name, label, placeholder]) => (
              <div key={name}>
                <label style={{ display: 'block', fontSize: 13, marginBottom: 6, color: 'var(--text-secondary)' }}>
                  {label}
                </label>
                <input
                  {...register(name as keyof FormData)}
                  type={name === 'password' ? 'password' : 'text'}
                  placeholder={placeholder}
                  style={{
                    width: '100%',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 8,
                    padding: '10px 14px',
                    color: 'var(--text-primary)',
                  }}
                />
                {errors[name as keyof FormData] ? (
                  <p style={{ color: 'var(--accent-danger)', fontSize: 12, marginTop: 4 }}>
                    {errors[name as keyof FormData]?.message as string}
                  </p>
                ) : null}
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, marginBottom: 6, color: 'var(--text-secondary)' }}>
                Gender
              </label>
              <select
                {...register('gender')}
                style={{
                  width: '100%',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 8,
                  padding: '10px 14px',
                  color: 'var(--text-primary)',
                }}
              >
                <option value="">Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
              {errors.gender ? (
                <p style={{ color: 'var(--accent-danger)', fontSize: 12, marginTop: 4 }}>
                  {errors.gender.message}
                </p>
              ) : null}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, marginBottom: 6, color: 'var(--text-secondary)' }}>
                Student image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => uploadAvatar(event.target.files?.[0])}
                style={{
                  width: '100%',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 8,
                  padding: '10px 14px',
                  color: 'var(--text-primary)',
                }}
              />
              <p style={{ color: uploading ? 'var(--accent-secondary)' : 'var(--text-tertiary)', fontSize: 12, marginTop: 4 }}>
                {uploading ? 'Uploading image...' : 'Upload a clear student photo'}
              </p>
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Student preview"
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 12,
                    objectFit: 'cover',
                    marginTop: 8,
                    border: '1px solid var(--border-default)',
                  }}
                />
              ) : null}
              {errors.avatarUrl ? (
                <p style={{ color: 'var(--accent-danger)', fontSize: 12, marginTop: 4 }}>
                  {errors.avatarUrl.message}
                </p>
              ) : null}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, marginBottom: 8, color: 'var(--text-secondary)' }}>
              Sports interests
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {sportsOptions.map((sport) => {
                const checked = sports.includes(sport)
                return (
                  <label
                    key={sport}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 999,
                      cursor: 'pointer',
                      background: checked ? 'rgba(108,99,255,0.18)' : 'var(--bg-tertiary)',
                      border: `1px solid ${checked ? 'var(--accent-primary)' : 'var(--border-default)'}`,
                      color: checked ? 'var(--text-primary)' : 'var(--text-secondary)',
                      fontSize: 13,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setValue(
                          'sportsInterests',
                          checked
                            ? sports.filter((item) => item !== sport)
                            : [...sports, sport],
                          { shouldValidate: true }
                        )
                      }
                      style={{ display: 'none' }}
                    />
                    {sport}
                  </label>
                )
              })}
            </div>
            {errors.sportsInterests ? (
              <p style={{ color: 'var(--accent-danger)', fontSize: 12, marginTop: 4 }}>
                {errors.sportsInterests.message}
              </p>
            ) : null}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, marginBottom: 6, color: 'var(--text-secondary)' }}>
              Address
            </label>
            <textarea
              {...register('address')}
              rows={3}
              style={{
                width: '100%',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-default)',
                borderRadius: 8,
                padding: '10px 14px',
                color: 'var(--text-primary)',
                resize: 'vertical',
              }}
            />
            {errors.address ? (
              <p style={{ color: 'var(--accent-danger)', fontSize: 12, marginTop: 4 }}>
                {errors.address.message}
              </p>
            ) : null}
          </div>

          <button className="btn-primary" type="submit" disabled={isSubmitting || uploading}>
            {isSubmitting ? 'Submitting registration...' : 'Submit for approval'}
          </button>
        </form>

        <div style={{ marginTop: 14, textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent-secondary)' }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
