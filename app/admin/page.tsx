'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { 
  Trash2, 
  Edit, 
  Plus, 
  Save, 
  X, 
  Loader2, 
  User, 
  LogOut,
  Calendar,
  Clock,
  Phone as PhoneIcon,
  Mail as MailIcon,
  Eye,
  CheckCircle,
  XCircle,
  Bell,
  Download,
  Search,
  Star,
  MessageSquare,
  Archive,
  Reply,
  Check,
  X as XIcon,
  Image as ImageIcon
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

type Doctor = {
  id: number
  name: string
  specialty: string
  experience: string
  hours: string
  phone: string
  email: string
  bio: string
  photo_url?: string
  password?: string
}

type Appointment = {
  id: number
  patient_first_name: string
  patient_last_name: string
  patient_email: string
  patient_phone: string
  service: string
  doctor_id: number | null
  appointment_date: string
  appointment_time: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  notes: string | null
  created_at: string
  updated_at: string
  doctors?: {
    name: string
    specialty: string
  }
}

type Contact = {
  id: number
  name: string
  email: string
  phone: string | null
  message: string
  status: 'unread' | 'read' | 'replied' | 'archived'
  created_at: string
  updated_at: string
}

type Testimonial = {
  id: number
  name: string
  role: string
  content: string
  rating: number
  is_active: boolean
  photo_url: string | null
  created_at: string
}

export default function AdminPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoadingAuth, setIsLoadingAuth] = useState(true)
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [loginError, setLoginError] = useState('')

  const [activeTab, setActiveTab] = useState('doctors')
  
  // Gestion des médecins
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [newDoctor, setNewDoctor] = useState<Omit<Doctor, 'id'>>({
    name: '',
    specialty: '',
    experience: '',
    hours: '',
    phone: '',
    email: '',
    bio: '',
    photo_url: '',
    password: ''
  })
  const [photoError, setPhotoError] = useState('')

  // Gestion des rendez-vous
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [appointmentFilter, setAppointmentFilter] = useState('all')
  const [appointmentSearch, setAppointmentSearch] = useState('')
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [appointmentDetailsOpen, setAppointmentDetailsOpen] = useState(false)
  const [appointmentStats, setAppointmentStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    completed: 0,
    today: 0,
  })

  // Gestion des contacts
  const [contacts, setContacts] = useState<Contact[]>([])
  const [contactFilter, setContactFilter] = useState('all')
  const [contactSearch, setContactSearch] = useState('')
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [contactDetailsOpen, setContactDetailsOpen] = useState(false)
  const [contactStats, setContactStats] = useState({
    total: 0,
    unread: 0,
    read: 0,
    replied: 0,
    archived: 0,
  })

  // Gestion des avis
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [testimonialFilter, setTestimonialFilter] = useState('active')
  const [testimonialSearch, setTestimonialSearch] = useState('')
  const [newTestimonial, setNewTestimonial] = useState<Omit<Testimonial, 'id' | 'created_at'>>({
    name: '',
    role: 'Patient',
    content: '',
    rating: 5,
    is_active: true,
    photo_url: null
  })
  const [selectedFileTestimonial, setSelectedFileTestimonial] = useState<File | null>(null)
  const [previewUrlTestimonial, setPreviewUrlTestimonial] = useState<string | null>(null)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)

  const [message, setMessage] = useState({ type: '', text: '' })
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  // Vérifier l'authentification au chargement
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      setIsLoadingAuth(true)
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) throw error
      
      if (session) {
        const userEmail = session.user.email
        const isAdmin = userEmail?.endsWith('@doctor-photos.fr') || userEmail === 'admin@doctor-photos.fr'
        
        if (isAdmin) {
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
          setLoginError('Accès réservé aux administrateurs')
        }
      } else {
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('Erreur de vérification d\'authentification:', error)
      setIsAuthenticated(false)
    } finally {
      setIsLoadingAuth(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      })

      if (error) throw error

      if (data.user) {
        setIsAuthenticated(true)
        setLoginData({ email: '', password: '' })
      }
    } catch (error: any) {
      console.error('Erreur de connexion:', error)
      setLoginError(error.message || 'Email ou mot de passe incorrect')
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      setIsAuthenticated(false)
      router.push('/')
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    }
  }

  // Fonctions pour les médecins
  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .order('name')

      if (error) throw error
      
      if (data) {
        setDoctors(data)
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement des médecins:', error)
      setMessage({ type: 'error', text: 'Erreur lors du chargement des médecins' })
    } finally {
      setLoading(false)
    }
  }, [])

  // Fonctions pour les rendez-vous
  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true)
      
      let query = supabase
        .from('appointments')
        .select(`
          *,
          doctors(name, specialty)
        `)
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true })

      if (appointmentFilter === 'today') {
        const today = new Date().toISOString().split('T')[0]
        query = query.eq('appointment_date', today)
      } else if (appointmentFilter !== 'all') {
        query = query.eq('status', appointmentFilter)
      }

      const { data, error } = await query

      if (error) throw error

      if (data) {
        setAppointments(data)
        calculateAppointmentStats(data)
      }
    } catch (error: any) {
      console.error('Erreur complète lors du chargement des rendez-vous:', error)
      const errorMessage = error?.message || error?.error_description || 'Erreur lors du chargement des rendez-vous'
      setMessage({ type: 'error', text: errorMessage })
    } finally {
      setLoading(false)
    }
  }, [appointmentFilter])

  // Fonctions pour les contacts
  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true)
      
      let query = supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false })

      if (contactFilter === 'unread') {
        query = query.eq('status', 'unread')
      } else if (contactFilter === 'read') {
        query = query.eq('status', 'read')
      } else if (contactFilter === 'replied') {
        query = query.eq('status', 'replied')
      } else if (contactFilter === 'archived') {
        query = query.eq('status', 'archived')
      }

      const { data, error } = await query

      if (error) throw error

      if (data) {
        setContacts(data)
        calculateContactStats(data)
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement des contacts:', error)
      setMessage({ type: 'error', text: 'Erreur lors du chargement des contacts' })
    } finally {
      setLoading(false)
    }
  }, [contactFilter])

  // Fonctions pour les avis
  const fetchTestimonials = useCallback(async () => {
    try {
      setLoading(true)
      
      let query = supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false })

      if (testimonialFilter === 'active') {
        query = query.eq('is_active', true)
      } else if (testimonialFilter === 'inactive') {
        query = query.eq('is_active', false)
      }

      const { data, error } = await query

      if (error) throw error

      if (data) {
        setTestimonials(data)
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement des avis:', error)
      setMessage({ type: 'error', text: 'Erreur lors du chargement des avis' })
    } finally {
      setLoading(false)
    }
  }, [testimonialFilter])

  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === 'doctors') {
        fetchDoctors()
      } else if (activeTab === 'appointments') {
        fetchAppointments()
      } else if (activeTab === 'contacts') {
        fetchContacts()
      } else if (activeTab === 'testimonials') {
        fetchTestimonials()
      }
    }
  }, [isAuthenticated, activeTab, fetchDoctors, fetchAppointments, fetchContacts, fetchTestimonials])

  const calculateAppointmentStats = (data: Appointment[]) => {
    const today = new Date().toISOString().split('T')[0]
    setAppointmentStats({
      total: data.length,
      pending: data.filter(a => a.status === 'pending').length,
      confirmed: data.filter(a => a.status === 'confirmed').length,
      cancelled: data.filter(a => a.status === 'cancelled').length,
      completed: data.filter(a => a.status === 'completed').length,
      today: data.filter(a => a.appointment_date === today).length,
    })
  }

  const calculateContactStats = (data: Contact[]) => {
    setContactStats({
      total: data.length,
      unread: data.filter(c => c.status === 'unread').length,
      read: data.filter(c => c.status === 'read').length,
      replied: data.filter(c => c.status === 'replied').length,
      archived: data.filter(c => c.status === 'archived').length,
    })
  }

  // Gestion du fichier photo pour médecins
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setPhotoError('')
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Gestion du fichier photo pour avis
  const handleFileChangeTestimonial = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFileTestimonial(file)
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrlTestimonial(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Upload photo pour médecins
  const uploadPhoto = async (file: File): Promise<string | null> => {
    if (!file) return null

    try {
      setUploading(true)
      
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
      const filePath = `doctors/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('doctor-photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        console.error('Erreur upload:', uploadError)
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from('doctor-photos')
        .getPublicUrl(filePath)

      return publicUrl
    } catch (error) {
      console.error('Erreur lors du téléchargement de la photo:', error)
      setMessage({ type: 'error', text: 'Erreur lors du téléchargement de la photo' })
      return null
    } finally {
      setUploading(false)
    }
  }

  // Upload photo pour avis
  const uploadPhotoTestimonial = async (file: File): Promise<string | null> => {
    if (!file) return null

    try {
      setUploading(true)
      
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
      const filePath = `testimonials/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('doctor-photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        console.error('Erreur upload:', uploadError)
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from('doctor-photos')
        .getPublicUrl(filePath)

      return publicUrl
    } catch (error) {
      console.error('Erreur lors du téléchargement de la photo:', error)
      setMessage({ type: 'error', text: 'Erreur lors du téléchargement de la photo' })
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewDoctor(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewDoctor(prev => ({ ...prev, [name]: value }))
  }

  const handleAddDoctor = async () => {
    setPhotoError('')
    setMessage({ type: '', text: '' })

    if (!newDoctor.name || !newDoctor.specialty || !newDoctor.email) {
      setMessage({ type: 'error', text: 'Veuillez remplir tous les champs obligatoires' })
      return
    }

    if (!selectedFile && !newDoctor.photo_url) {
      setPhotoError('Une photo est requise pour l\'ajout d\'un nouveau médecin.')
      return
    }

    try {
      setLoading(true)
      
      let finalPhotoUrl = newDoctor.photo_url

      if (selectedFile) {
        const uploadedUrl = await uploadPhoto(selectedFile)
        if (uploadedUrl) {
          finalPhotoUrl = uploadedUrl
        } else {
          setPhotoError('Le téléchargement de la photo a échoué. Veuillez réessayer.')
          return
        }
      }

      const { data, error } = await supabase
        .from('doctors')
        .insert([{
          name: newDoctor.name,
          specialty: newDoctor.specialty,
          experience: newDoctor.experience || '',
          hours: newDoctor.hours || '',
          phone: newDoctor.phone || '',
          email: newDoctor.email,
          bio: newDoctor.bio || '',
          photo_url: finalPhotoUrl || null,
        }])
        .select()
        .single()

      if (error) throw error

      setDoctors(prev => [...prev, data])
      setMessage({ type: 'success', text: 'Médecin ajouté avec succès' })
      
      resetDoctorForm()

    } catch (error: any) {
      console.error('Erreur lors de l\'ajout:', error)
      setMessage({ 
        type: 'error', 
        text: error.message || 'Erreur lors de l\'ajout du médecin' 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditDoctor = (doctor: Doctor) => {
    setIsEditing(true)
    setEditingId(doctor.id)
    setNewDoctor({
      name: doctor.name,
      specialty: doctor.specialty,
      experience: doctor.experience,
      hours: doctor.hours,
      phone: doctor.phone,
      email: doctor.email,
      bio: doctor.bio,
      photo_url: doctor.photo_url || '',
      password: ''
    })
    if (doctor.photo_url) {
      setPreviewUrl(doctor.photo_url)
    } else {
      setPreviewUrl(null)
    }
    setSelectedFile(null)
    setPhotoError('')
  }

  const handleUpdateDoctor = async () => {
    if (!editingId) return

    try {
      setLoading(true)
      
      let finalPhotoUrl = newDoctor.photo_url

      if (selectedFile) {
        const uploadedUrl = await uploadPhoto(selectedFile)
        if (uploadedUrl) {
          finalPhotoUrl = uploadedUrl
          
          if (newDoctor.photo_url && newDoctor.photo_url !== uploadedUrl) {
            const fileName = newDoctor.photo_url.split('/').pop()
            if (fileName) {
              await supabase.storage.from('doctor-photos').remove([`doctors/${fileName}`])
            }
          }
        }
      }

      const { error } = await supabase
        .from('doctors')
        .update({
          name: newDoctor.name,
          specialty: newDoctor.specialty,
          experience: newDoctor.experience,
          hours: newDoctor.hours,
          phone: newDoctor.phone,
          email: newDoctor.email,
          bio: newDoctor.bio,
          photo_url: finalPhotoUrl || null,
        })
        .eq('id', editingId)

      if (error) throw error

      setDoctors(prev => prev.map(doctor => 
        doctor.id === editingId 
          ? { ...doctor, photo_url: finalPhotoUrl, ...newDoctor }
          : doctor
      ))

      setMessage({ type: 'success', text: 'Médecin modifié avec succès' })
      setIsEditing(false)
      setEditingId(null)
      resetDoctorForm()
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour:', error)
      setMessage({ type: 'error', text: 'Erreur lors de la modification du médecin' })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDoctor = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce médecin ?')) return

    try {
      const doctor = doctors.find(d => d.id === id)
      if (doctor?.photo_url) {
        const fileName = doctor.photo_url.split('/').pop()
        if (fileName) {
          await supabase.storage
            .from('doctor-photos')
            .remove([`doctors/${fileName}`])
        }
      }

      const { error } = await supabase
        .from('doctors')
        .delete()
        .eq('id', id)

      if (error) throw error

      setDoctors(prev => prev.filter(doctor => doctor.id !== id))
      setMessage({ type: 'success', text: 'Médecin supprimé avec succès' })
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error)
      setMessage({ type: 'error', text: 'Erreur lors de la suppression du médecin' })
    }
  }

  // Fonctions pour les avis
  const handleAddTestimonial = async () => {
    if (!newTestimonial.name || !newTestimonial.content) {
      setMessage({ type: 'error', text: 'Veuillez remplir le nom et le contenu' })
      return
    }

    try {
      setLoading(true)
      
      let finalPhotoUrl = newTestimonial.photo_url

      if (selectedFileTestimonial) {
        const uploadedUrl = await uploadPhotoTestimonial(selectedFileTestimonial)
        if (uploadedUrl) {
          finalPhotoUrl = uploadedUrl
        }
      }

      const { data, error } = await supabase
        .from('testimonials')
        .insert([{
          name: newTestimonial.name,
          role: newTestimonial.role || 'Patient',
          content: newTestimonial.content,
          rating: newTestimonial.rating,
          is_active: newTestimonial.is_active,
          photo_url: finalPhotoUrl,
        }])
        .select()
        .single()

      if (error) throw error

      setTestimonials(prev => [data, ...prev])
      setMessage({ type: 'success', text: 'Avis ajouté avec succès' })
      
      // Reset form
      setNewTestimonial({
        name: '',
        role: 'Patient',
        content: '',
        rating: 5,
        is_active: true,
        photo_url: null
      })
      setSelectedFileTestimonial(null)
      setPreviewUrlTestimonial(null)

    } catch (error: any) {
      console.error('Erreur lors de l\'ajout:', error)
      setMessage({ 
        type: 'error', 
        text: error.message || 'Erreur lors de l\'ajout de l\'avis' 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditTestimonial = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial)
    setNewTestimonial({
      name: testimonial.name,
      role: testimonial.role,
      content: testimonial.content,
      rating: testimonial.rating,
      is_active: testimonial.is_active,
      photo_url: testimonial.photo_url
    })
    if (testimonial.photo_url) {
      setPreviewUrlTestimonial(testimonial.photo_url)
    } else {
      setPreviewUrlTestimonial(null)
    }
    setSelectedFileTestimonial(null)
  }

  const handleUpdateTestimonial = async () => {
    if (!editingTestimonial) return

    try {
      setLoading(true)
      
      let finalPhotoUrl = newTestimonial.photo_url

      if (selectedFileTestimonial) {
        const uploadedUrl = await uploadPhotoTestimonial(selectedFileTestimonial)
        if (uploadedUrl) {
          finalPhotoUrl = uploadedUrl
          
          if (editingTestimonial.photo_url && editingTestimonial.photo_url !== uploadedUrl) {
            const fileName = editingTestimonial.photo_url.split('/').pop()
            if (fileName) {
              await supabase.storage.from('doctor-photos').remove([`testimonials/${fileName}`])
            }
          }
        }
      }

      const { error } = await supabase
        .from('testimonials')
        .update({
          name: newTestimonial.name,
          role: newTestimonial.role,
          content: newTestimonial.content,
          rating: newTestimonial.rating,
          is_active: newTestimonial.is_active,
          photo_url: finalPhotoUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingTestimonial.id)

      if (error) throw error

      setTestimonials(prev => prev.map(testimonial => 
        testimonial.id === editingTestimonial.id 
          ? { ...testimonial, ...newTestimonial, photo_url: finalPhotoUrl }
          : testimonial
      ))

      setMessage({ type: 'success', text: 'Avis modifié avec succès' })
      setEditingTestimonial(null)
      resetTestimonialForm()
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour:', error)
      setMessage({ type: 'error', text: 'Erreur lors de la modification de l\'avis' })
    } finally {
      setLoading(false)
    }
  }

  const handleToggleTestimonialStatus = async (id: number, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ 
          is_active: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error

      setTestimonials(prev => prev.map(testimonial => 
        testimonial.id === id 
          ? { ...testimonial, is_active: !currentStatus }
          : testimonial
      ))

      setMessage({ type: 'success', text: `Avis ${!currentStatus ? 'activé' : 'désactivé'} avec succès` })
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour:', error)
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour' })
    }
  }

  const handleDeleteTestimonial = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) return

    try {
      const testimonial = testimonials.find(t => t.id === id)
      if (testimonial?.photo_url) {
        const fileName = testimonial.photo_url.split('/').pop()
        if (fileName) {
          await supabase.storage
            .from('doctor-photos')
            .remove([`testimonials/${fileName}`])
        }
      }

      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id)

      if (error) throw error

      setTestimonials(prev => prev.filter(testimonial => testimonial.id !== id))
      setMessage({ type: 'success', text: 'Avis supprimé avec succès' })
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error)
      setMessage({ type: 'error', text: 'Erreur lors de la suppression' })
    }
  }

  // Fonctions pour les rendez-vous
  const handleUpdateAppointmentStatus = async (id: number, status: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error

      setAppointments(prev => prev.map(app => 
        app.id === id ? { ...app, status: status as any } : app
      ))

      setMessage({ type: 'success', text: 'Statut du rendez-vous mis à jour' })
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du statut:', error)
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour du statut' })
    }
  }

  const handleDeleteAppointment = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous ?')) return

    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id)

      if (error) throw error

      setAppointments(prev => prev.filter(app => app.id !== id))
      setMessage({ type: 'success', text: 'Rendez-vous supprimé avec succès' })
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error)
      setMessage({ type: 'error', text: 'Erreur lors de la suppression du rendez-vous' })
    }
  }

  const handleViewAppointmentDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setAppointmentDetailsOpen(true)
  }

  // Fonctions pour les contacts
  const handleUpdateContactStatus = async (id: number, status: string) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error

      setContacts(prev => prev.map(contact => 
        contact.id === id ? { ...contact, status: status as any } : contact
      ))

      setMessage({ type: 'success', text: 'Statut du contact mis à jour' })
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du statut:', error)
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour du statut' })
    }
  }

  const handleDeleteContact = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) return

    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id)

      if (error) throw error

      setContacts(prev => prev.filter(contact => contact.id !== id))
      setMessage({ type: 'success', text: 'Contact supprimé avec succès' })
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error)
      setMessage({ type: 'error', text: 'Erreur lors de la suppression du contact' })
    }
  }

  const handleViewContactDetails = (contact: Contact) => {
    setSelectedContact(contact)
    setContactDetailsOpen(true)
    if (contact.status === 'unread') {
      handleUpdateContactStatus(contact.id, 'read')
    }
  }

  // Fonctions de reset
  const resetDoctorForm = () => {
    setNewDoctor({
      name: '',
      specialty: '',
      experience: '',
      hours: '',
      phone: '',
      email: '',
      bio: '',
      photo_url: '',
      password: ''
    })
    setSelectedFile(null)
    setPreviewUrl(null)
    setPhotoError('')
  }

  const resetTestimonialForm = () => {
    setNewTestimonial({
      name: '',
      role: 'Patient',
      content: '',
      rating: 5,
      is_active: true,
      photo_url: null
    })
    setSelectedFileTestimonial(null)
    setPreviewUrlTestimonial(null)
    setEditingTestimonial(null)
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setEditingId(null)
    resetDoctorForm()
  }

  const cancelEditTestimonial = () => {
    setEditingTestimonial(null)
    resetTestimonialForm()
  }

  const specialties = [
    'Cardiologie',
    'Neurologie',
    'Orthopédie',
    'Ophtalmologie',
    'Médecine Générale',
    'Pédiatrie',
    'Dermatologie',
    'Gynécologie',
    'Psychiatrie',
    'Radiologie',
    'Urgence'
  ]

  // Fonctions d'aide pour les badges de statut
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">En attente</Badge>
      case 'confirmed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Confirmé</Badge>
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Annulé</Badge>
      case 'completed':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Terminé</Badge>
      default:
        return <Badge variant="outline">Inconnu</Badge>
    }
  }

  const getContactStatusBadge = (status: string) => {
    switch (status) {
      case 'unread':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Non lu</Badge>
      case 'read':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Lu</Badge>
      case 'replied':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Répondu</Badge>
      case 'archived':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Archivé</Badge>
      default:
        return <Badge variant="outline">Inconnu</Badge>
    }
  }

  // Filtres
  const filteredAppointments = appointments.filter(app => {
    if (!appointmentSearch) return true
    
    const searchLower = appointmentSearch.toLowerCase()
    return (
      app.patient_first_name.toLowerCase().includes(searchLower) ||
      app.patient_last_name.toLowerCase().includes(searchLower) ||
      app.patient_email.toLowerCase().includes(searchLower) ||
      app.service.toLowerCase().includes(searchLower) ||
      (app.doctors?.name && app.doctors.name.toLowerCase().includes(searchLower)) ||
      app.patient_phone.includes(appointmentSearch)
    )
  })

  const filteredContacts = contacts.filter(contact => {
    if (!contactSearch) return true
    
    const searchLower = contactSearch.toLowerCase()
    return (
      contact.name.toLowerCase().includes(searchLower) ||
      contact.email.toLowerCase().includes(searchLower) ||
      (contact.phone && contact.phone.toLowerCase().includes(searchLower)) ||
      contact.message.toLowerCase().includes(searchLower)
    )
  })

  const filteredTestimonials = testimonials.filter(testimonial => {
    if (!testimonialSearch) return true
    
    const searchLower = testimonialSearch.toLowerCase()
    return (
      testimonial.name.toLowerCase().includes(searchLower) ||
      testimonial.role.toLowerCase().includes(searchLower) ||
      testimonial.content.toLowerCase().includes(searchLower)
    )
  })

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Administration doctor-photos
            </h1>
            <p className="text-foreground/70">
              Connectez-vous pour accéder à la gestion
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="admin@doctor-photos.fr"
                className="mt-2"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-foreground">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="••••••••"
                className="mt-2"
                required
              />
            </div>

            {loginError && (
              <Alert className="bg-red-50 border-red-200">
                <AlertDescription className="text-red-800">
                  {loginError}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isLoadingAuth}
            >
              {isLoadingAuth ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Se connecter
            </Button>
          </form>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-lg font-semibold">Administration doctor-photos</h1>
            <p className="text-sm opacity-90">Bienvenue dans l'espace d'administration</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="bg-transparent border-white/30 text-white hover:bg-white/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-4 mb-8">
              <TabsTrigger value="doctors" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Médecins ({doctors.length})
              </TabsTrigger>
              <TabsTrigger value="appointments" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Rendez-vous ({appointments.length})
                {appointmentStats.pending > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {appointmentStats.pending}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="contacts" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Contacts ({contacts.length})
                {contactStats.unread > 0 && (
                  <span className="ml-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {contactStats.unread}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="testimonials" className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                Avis ({testimonials.length})
              </TabsTrigger>
            </TabsList>

            {message.text && (
              <Alert className={`mb-6 ${
                message.type === 'error' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
              }`}>
                <AlertDescription className={message.type === 'error' ? 'text-red-800' : 'text-green-800'}>
                  {message.text}
                </AlertDescription>
              </Alert>
            )}

            {/* Onglet Médecins */}
            <TabsContent value="doctors" className="space-y-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Gestion des Médecins
                </h2>
                <p className="text-foreground/70">
                  Ajoutez, modifiez ou supprimez des médecins de l'équipe
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Formulaire */}
                <div className="lg:col-span-1">
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-6">
                      {isEditing ? 'Modifier le médecin' : 'Ajouter un nouveau médecin'}
                    </h2>
                    
                    <div className="space-y-4">
                      {/* Photo Upload Section */}
                      <div>
                        <Label htmlFor="photo" className="text-foreground flex items-center gap-1">
                          Photo de profil <span className="text-red-500">*</span>
                        </Label>
                        <div className="mt-2 flex items-center gap-4">
                          <div className={`relative w-24 h-24 rounded-full overflow-hidden border-2 bg-gray-50 flex items-center justify-center ${photoError ? 'border-red-500' : 'border-dashed border-gray-300'}`}>
                            {previewUrl ? (
                              <img 
                                src={previewUrl} 
                                alt="Aperçu" 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="w-8 h-8 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <Input
                              id="photo"
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className={`cursor-pointer ${photoError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                            />
                            <p className="text-xs text-foreground/60 mt-1">
                              JPG, PNG ou WEBP (Max 2MB)
                            </p>
                            {photoError && (
                              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                <XCircle className="w-3 h-3" />
                                {photoError}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="name" className="text-foreground">Nom complet *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={newDoctor.name}
                          onChange={handleInputChange}
                          placeholder="Dr. Jean Dupont"
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="specialty" className="text-foreground">Spécialité *</Label>
                        <Select
                          value={newDoctor.specialty}
                          onValueChange={(value) => handleSelectChange('specialty', value)}
                        >
                          <SelectTrigger id="specialty" className="mt-2">
                            <SelectValue placeholder="Sélectionner une spécialité" />
                          </SelectTrigger>
                          <SelectContent>
                            {specialties.map(specialty => (
                              <SelectItem key={specialty} value={specialty}>
                                {specialty}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="experience" className="text-foreground">Expérience</Label>
                        <Input
                          id="experience"
                          name="experience"
                          value={newDoctor.experience}
                          onChange={handleInputChange}
                          placeholder="15 ans d'expérience"
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="hours" className="text-foreground">Horaires</Label>
                        <Input
                          id="hours"
                          name="hours"
                          value={newDoctor.hours}
                          onChange={handleInputChange}
                          placeholder="Lun - Ven: 09h - 17h"
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone" className="text-foreground">Téléphone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={newDoctor.phone}
                          onChange={handleInputChange}
                          placeholder="+33 1 23 45 67 89"
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email" className="text-foreground">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={newDoctor.email}
                          onChange={handleInputChange}
                          placeholder="j.dupont@doctor-photos.fr"
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="bio" className="text-foreground">Biographie</Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          value={newDoctor.bio}
                          onChange={handleInputChange}
                          placeholder="Description du parcours et spécialités..."
                          className="mt-2 min-h-[100px]"
                        />
                      </div>

                      <div className="flex gap-2 pt-4">
                        {isEditing ? (
                          <>
                            <Button
                              onClick={handleUpdateDoctor}
                              className="flex-1 bg-primary hover:bg-primary/90"
                              disabled={loading || uploading}
                            >
                              {(loading || uploading) ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <Save className="w-4 h-4 mr-2" />
                              )}
                              {(loading || uploading) ? 'Mise à jour...' : 'Mettre à jour'}
                            </Button>
                            <Button
                              onClick={cancelEdit}
                              variant="outline"
                              className="flex-1"
                            >
                              <X className="w-4 h-4 mr-2" />
                              Annuler
                            </Button>
                          </>
                        ) : (
                          <Button
                            onClick={handleAddDoctor}
                            className="flex-1 bg-primary hover:bg-primary/90"
                            disabled={loading || uploading}
                          >
                            {(loading || uploading) ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Plus className="w-4 h-4 mr-2" />
                            )}
                            {(loading || uploading) ? 'Ajout en cours...' : 'Ajouter le médecin'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Liste des médecins */}
                <div className="lg:col-span-2">
                  <Card className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-foreground">
                        Liste des médecins ({doctors.length})
                      </h2>
                      <Button
                        onClick={fetchDoctors}
                        variant="outline"
                        size="sm"
                        disabled={loading}
                      >
                        {loading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          'Actualiser'
                        )}
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {loading ? (
                        <div className="text-center py-8">
                          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                          <p className="text-foreground/70 mt-2">Chargement...</p>
                        </div>
                      ) : doctors.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-foreground/70">Aucun médecin enregistré</p>
                        </div>
                      ) : (
                        doctors.map(doctor => (
                          <Card key={doctor.id} className="p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0">
                                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/30 bg-primary/10">
                                  {doctor.photo_url ? (
                                    <img 
                                      src={doctor.photo_url} 
                                      alt={doctor.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <User className="w-10 h-10 text-primary/50" />
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex-1">
                                <div className="mb-2">
                                  <h3 className="font-semibold text-foreground">{doctor.name}</h3>
                                  <p className="text-primary text-sm">{doctor.specialty}</p>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-foreground/70">
                                  <div>
                                    <p className="text-xs font-semibold text-foreground/60">Expérience</p>
                                    <p>{doctor.experience || 'Non spécifiée'}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold text-foreground/60">Horaires</p>
                                    <p>{doctor.hours || 'Non spécifiés'}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold text-foreground/60">Email</p>
                                    <p className="truncate">{doctor.email}</p>
                                  </div>
                                </div>
                                {doctor.bio && (
                                  <p className="text-sm text-foreground/80 mt-3 line-clamp-2">
                                    {doctor.bio}
                                  </p>
                                )}
                              </div>
                              <div className="flex flex-col gap-2 ml-4">
                                <Button
                                  onClick={() => handleEditDoctor(doctor)}
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-2"
                                >
                                  <Edit className="w-3 h-3" />
                                  Modifier
                                </Button>
                                <Button
                                  onClick={() => handleDeleteDoctor(doctor.id)}
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:border-red-300"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  Supprimer
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Onglet Rendez-vous */}
            <TabsContent value="appointments" className="space-y-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Gestion des Rendez-vous
                </h2>
                <p className="text-foreground/70">
                  Consultez et gérez les rendez-vous des patients
                </p>
              </div>

              {/* Statistiques */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Card className="p-4 bg-primary/5">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{appointmentStats.total}</p>
                    <p className="text-sm text-foreground/70">Total</p>
                  </div>
                </Card>
                <Card className="p-4 bg-yellow-50">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{appointmentStats.pending}</p>
                    <p className="text-sm text-foreground/70">En attente</p>
                  </div>
                </Card>
                <Card className="p-4 bg-green-50">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{appointmentStats.confirmed}</p>
                    <p className="text-sm text-foreground/70">Confirmés</p>
                  </div>
                </Card>
                <Card className="p-4 bg-blue-50">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{appointmentStats.today}</p>
                    <p className="text-sm text-foreground/70">Aujourd'hui</p>
                  </div>
                </Card>
              </div>

              {/* Filtres et recherche */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Rechercher par nom, email ou service..."
                    value={appointmentSearch}
                    onChange={(e) => setAppointmentSearch(e.target.value)}
                    className="w-full pl-10"
                  />
                </div>
                <Select value={appointmentFilter} onValueChange={setAppointmentFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les rendez-vous</SelectItem>
                    <SelectItem value="today">Aujourd'hui</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="confirmed">Confirmés</SelectItem>
                    <SelectItem value="cancelled">Annulés</SelectItem>
                    <SelectItem value="completed">Terminés</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={fetchAppointments}
                  variant="outline"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Actualiser'
                  )}
                </Button>
                <Button
                  onClick={() => {
                    const csv = filteredAppointments.map(app => ({
                      ID: app.id,
                      Patient: `${app.patient_first_name} ${app.patient_last_name}`,
                      Email: app.patient_email,
                      Téléphone: app.patient_phone,
                      Service: app.service,
                      Médecin: app.doctors?.name || 'Non assigné',
                      Date: app.appointment_date,
                      Heure: app.appointment_time,
                      Statut: app.status,
                      'Créé le': new Date(app.created_at).toLocaleDateString('fr-FR')
                    }))
                    
                    if (csv.length === 0) {
                      setMessage({ type: 'error', text: 'Aucune donnée à exporter' })
                      return
                    }
                    
                    const csvContent = [
                      Object.keys(csv[0]).join(','),
                      ...csv.map(row => Object.values(row).map(v => `"${v}"`).join(','))
                    ].join('\n')
                    
                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
                    const url = window.URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `rendez-vous-${new Date().toISOString().split('T')[0]}.csv`
                    a.click()
                  }}
                  variant="outline"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exporter
                </Button>
              </div>

              {/* Tableau des rendez-vous */}
              <Card>
                <div className="p-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Médecin</TableHead>
                        <TableHead>Date & Heure</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                            <p className="text-foreground/70 mt-2">Chargement...</p>
                          </TableCell>
                        </TableRow>
                      ) : filteredAppointments.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <p className="text-foreground/70">Aucun rendez-vous trouvé</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredAppointments.map(appointment => (
                          <TableRow key={appointment.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{appointment.patient_first_name} {appointment.patient_last_name}</p>
                                <p className="text-sm text-foreground/70">{appointment.patient_email}</p>
                              </div>
                            </TableCell>
                            <TableCell>{appointment.service}</TableCell>
                            <TableCell>
                              {appointment.doctors ? (
                                <div>
                                  <p className="font-medium">{appointment.doctors.name}</p>
                                  <p className="text-sm text-foreground/70">{appointment.doctors.specialty}</p>
                                </div>
                              ) : (
                                <span className="text-foreground/60">Non assigné</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-foreground/60" />
                                <span>{new Date(appointment.appointment_date).toLocaleDateString('fr-FR')}</span>
                                <Clock className="w-4 h-4 text-foreground/60 ml-2" />
                                <span>{appointment.appointment_time}</span>
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleViewAppointmentDetails(appointment)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                {appointment.status === 'pending' && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-green-600 border-green-200 hover:bg-green-50"
                                      onClick={() => handleUpdateAppointmentStatus(appointment.id, 'confirmed')}
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-red-600 border-red-200 hover:bg-red-50"
                                      onClick={() => handleUpdateAppointmentStatus(appointment.id, 'cancelled')}
                                    >
                                      <XCircle className="w-4 h-4" />
                                    </Button>
                                  </>
                                )}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 border-red-200 hover:bg-red-50"
                                  onClick={() => handleDeleteAppointment(appointment.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Supprimer
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </TabsContent>

            {/* Onglet Contacts */}
            <TabsContent value="contacts" className="space-y-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Gestion des Contacts
                </h2>
                <p className="text-foreground/70">
                  Consultez et gérez les messages des visiteurs
                </p>
              </div>

              {/* Statistiques contacts */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                <Card className="p-4 bg-primary/5">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{contactStats.total}</p>
                    <p className="text-sm text-foreground/70">Total</p>
                  </div>
                </Card>
                <Card className="p-4 bg-blue-50">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{contactStats.unread}</p>
                    <p className="text-sm text-foreground/70">Non lus</p>
                  </div>
                </Card>
                <Card className="p-4 bg-gray-50">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{contactStats.read}</p>
                    <p className="text-sm text-foreground/70">Lus</p>
                  </div>
                </Card>
                <Card className="p-4 bg-green-50">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{contactStats.replied}</p>
                    <p className="text-sm text-foreground/70">Répondus</p>
                  </div>
                </Card>
                <Card className="p-4 bg-purple-50">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{contactStats.archived}</p>
                    <p className="text-sm text-foreground/70">Archivés</p>
                  </div>
                </Card>
              </div>

              {/* Filtres et recherche contacts */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Rechercher par nom, email ou message..."
                    value={contactSearch}
                    onChange={(e) => setContactSearch(e.target.value)}
                    className="w-full pl-10"
                  />
                </div>
                <Select value={contactFilter} onValueChange={setContactFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les contacts</SelectItem>
                    <SelectItem value="unread">Non lus</SelectItem>
                    <SelectItem value="read">Lus</SelectItem>
                    <SelectItem value="replied">Répondus</SelectItem>
                    <SelectItem value="archived">Archivés</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={fetchContacts}
                  variant="outline"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Actualiser'
                  )}
                </Button>
              </div>

              {/* Tableau des contacts */}
              <Card>
                <div className="p-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Téléphone</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                            <p className="text-foreground/70 mt-2">Chargement...</p>
                          </TableCell>
                        </TableRow>
                      ) : filteredContacts.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <p className="text-foreground/70">Aucun contact trouvé</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredContacts.map(contact => (
                          <TableRow key={contact.id} className={contact.status === 'unread' ? 'bg-blue-50' : ''}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{contact.name}</p>
                                <p className="text-sm text-foreground/70 truncate max-w-[200px]">
                                  {contact.message.substring(0, 50)}...
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <a 
                                href={`mailto:${contact.email}`}
                                className="text-primary hover:underline"
                              >
                                {contact.email}
                              </a>
                            </TableCell>
                            <TableCell>
                              {contact.phone ? (
                                <a 
                                  href={`tel:${contact.phone}`}
                                  className="text-foreground/70 hover:text-primary"
                                >
                                  {contact.phone}
                                </a>
                              ) : (
                                <span className="text-foreground/40">Non fourni</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-foreground/60" />
                                <span>{new Date(contact.created_at).toLocaleDateString('fr-FR')}</span>
                              </div>
                            </TableCell>
                            <TableCell>{getContactStatusBadge(contact.status)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleViewContactDetails(contact)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                {contact.status !== 'replied' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-green-600 border-green-200 hover:bg-green-50"
                                    onClick={() => handleUpdateContactStatus(contact.id, 'replied')}
                                  >
                                    <Reply className="w-4 h-4" />
                                  </Button>
                                )}
                                {contact.status !== 'archived' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-purple-600 border-purple-200 hover:bg-purple-50"
                                    onClick={() => handleUpdateContactStatus(contact.id, 'archived')}
                                  >
                                    <Archive className="w-4 h-4" />
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 border-red-200 hover:bg-red-50"
                                  onClick={() => handleDeleteContact(contact.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Supprimer
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </TabsContent>

            {/* Onglet Avis */}
            <TabsContent value="testimonials" className="space-y-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Gestion des Avis Patients
                </h2>
                <p className="text-foreground/70">
                  Ajoutez et gérez les avis affichés sur la page d'accueil
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Formulaire d'ajout */}
                <div className="lg:col-span-1">
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-6">
                      {editingTestimonial ? 'Modifier l\'avis' : 'Ajouter un nouvel avis'}
                    </h2>
                    
                    <div className="space-y-4">
                      {/* Photo Upload */}
                      <div>
                        <Label htmlFor="testimonial-photo" className="text-foreground">
                          Photo (optionnelle)
                        </Label>
                        <div className="mt-2 flex items-center gap-4">
                          <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
                            {previewUrlTestimonial ? (
                              <img 
                                src={previewUrlTestimonial} 
                                alt="Aperçu" 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="w-8 h-8 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <Input
                              id="testimonial-photo"
                              type="file"
                              accept="image/*"
                              onChange={handleFileChangeTestimonial}
                              className="cursor-pointer"
                            />
                            <p className="text-xs text-foreground/60 mt-1">
                              JPG, PNG ou WEBP (Max 2MB)
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="testimonial-name" className="text-foreground">Nom *</Label>
                        <Input
                          id="testimonial-name"
                          value={newTestimonial.name}
                          onChange={(e) => setNewTestimonial(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Marie Dupont"
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="testimonial-role" className="text-foreground">Rôle</Label>
                        <Input
                          id="testimonial-role"
                          value={newTestimonial.role}
                          onChange={(e) => setNewTestimonial(prev => ({ ...prev, role: e.target.value }))}
                          placeholder="Patient"
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="testimonial-rating" className="text-foreground">Note (1-5)</Label>
                        <Select
                          value={newTestimonial.rating.toString()}
                          onValueChange={(value) => setNewTestimonial(prev => ({ ...prev, rating: parseInt(value) }))}
                        >
                          <SelectTrigger id="testimonial-rating" className="mt-2">
                            <SelectValue placeholder="Sélectionner une note" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5].map(rating => (
                              <SelectItem key={rating} value={rating.toString()}>
                                {'★'.repeat(rating)} ({rating}/5)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="testimonial-content" className="text-foreground">Avis *</Label>
                        <Textarea
                          id="testimonial-content"
                          value={newTestimonial.content}
                          onChange={(e) => setNewTestimonial(prev => ({ ...prev, content: e.target.value }))}
                          placeholder="Excellent service et équipe très professionnelle..."
                          className="mt-2 min-h-[100px]"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <Label htmlFor="testimonial-active" className="text-foreground">Actif</Label>
                        <input
                          id="testimonial-active"
                          type="checkbox"
                          checked={newTestimonial.is_active}
                          onChange={(e) => setNewTestimonial(prev => ({ ...prev, is_active: e.target.checked }))}
                          className="w-4 h-4 text-primary rounded focus:ring-primary"
                        />
                      </div>

                      <div className="flex gap-2 pt-4">
                        {editingTestimonial ? (
                          <>
                            <Button
                              onClick={handleUpdateTestimonial}
                              className="flex-1 bg-primary hover:bg-primary/90"
                              disabled={loading || uploading}
                            >
                              {(loading || uploading) ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <Save className="w-4 h-4 mr-2" />
                              )}
                              {(loading || uploading) ? 'Mise à jour...' : 'Mettre à jour'}
                            </Button>
                            <Button
                              onClick={cancelEditTestimonial}
                              variant="outline"
                              className="flex-1"
                            >
                              <X className="w-4 h-4 mr-2" />
                              Annuler
                            </Button>
                          </>
                        ) : (
                          <Button
                            onClick={handleAddTestimonial}
                            className="flex-1 bg-primary hover:bg-primary/90"
                            disabled={loading || uploading}
                          >
                            {(loading || uploading) ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Plus className="w-4 h-4 mr-2" />
                            )}
                            {(loading || uploading) ? 'Ajout en cours...' : 'Ajouter l\'avis'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Liste des avis */}
                <div className="lg:col-span-2">
                  <Card className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold text-foreground">
                          Liste des avis ({testimonials.length})
                        </h2>
                        <p className="text-sm text-foreground/70 mt-1">
                          {testimonials.filter(t => t.is_active).length} avis actifs | {testimonials.filter(t => !t.is_active).length} avis désactivés
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            placeholder="Rechercher..."
                            value={testimonialSearch}
                            onChange={(e) => setTestimonialSearch(e.target.value)}
                            className="pl-10 w-40"
                          />
                        </div>
                        <Select value={testimonialFilter} onValueChange={setTestimonialFilter}>
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Filtrer" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tous</SelectItem>
                            <SelectItem value="active">Actifs</SelectItem>
                            <SelectItem value="inactive">Inactifs</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          onClick={fetchTestimonials}
                          variant="outline"
                          size="sm"
                          disabled={loading}
                        >
                          {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            'Actualiser'
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {loading ? (
                        <div className="text-center py-8">
                          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                          <p className="text-foreground/70 mt-2">Chargement...</p>
                        </div>
                      ) : filteredTestimonials.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-foreground/70">Aucun avis trouvé</p>
                        </div>
                      ) : (
                        filteredTestimonials.map(testimonial => (
                          <Card key={testimonial.id} className="p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0">
                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/30 bg-primary/10">
                                  {testimonial.photo_url ? (
                                    <img 
                                      src={testimonial.photo_url} 
                                      alt={testimonial.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <User className="w-8 h-8 text-primary/50" />
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h3 className="font-semibold text-foreground">{testimonial.name}</h3>
                                    <p className="text-primary text-sm">{testimonial.role}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge variant={testimonial.is_active ? "default" : "outline"} className={testimonial.is_active ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-gray-100 text-gray-800 hover:bg-gray-100"}>
                                      {testimonial.is_active ? 'Actif' : 'Inactif'}
                                    </Badge>
                                    <div className="flex gap-1">
                                      {[...Array(5)].map((_, i) => (
                                        <span 
                                          key={i} 
                                          className={`text-sm ${i < testimonial.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                                        >
                                          ★
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                
                                <p className="text-foreground/80 italic mb-3">
                                  "{testimonial.content}"
                                </p>
                                
                                <div className="flex items-center justify-between text-sm text-foreground/60">
                                  <span>
                                    Ajouté le {new Date(testimonial.created_at).toLocaleDateString('fr-FR')}
                                  </span>
                                </div>
                              </div>
                              <div className="flex flex-col gap-2 ml-4">
                                <Button
                                  onClick={() => handleEditTestimonial(testimonial)}
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-2"
                                >
                                  <Edit className="w-3 h-3" />
                                  Modifier
                                </Button>
                                <Button
                                  onClick={() => handleToggleTestimonialStatus(testimonial.id, testimonial.is_active)}
                                  variant="outline"
                                  size="sm"
                                  className={`flex items-center gap-2 ${testimonial.is_active ? 'text-yellow-600 hover:text-yellow-700 hover:border-yellow-300' : 'text-green-600 hover:text-green-700 hover:border-green-300'}`}
                                >
                                  {testimonial.is_active ? (
                                    <>
                                      <XIcon className="w-3 h-3" />
                                      Désactiver
                                    </>
                                  ) : (
                                    <>
                                      <Check className="w-3 h-3" />
                                      Activer
                                    </>
                                  )}
                                </Button>
                                <Button
                                  onClick={() => handleDeleteTestimonial(testimonial.id)}
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:border-red-300"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  Supprimer
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Modal de détails du rendez-vous */}
      {appointmentDetailsOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-foreground">Détails du rendez-vous</h3>
                  <p className="text-foreground/70">ID: #{selectedAppointment.id}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAppointmentDetailsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-6">
                <Card className="p-4">
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Informations patient
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-foreground/60">Nom complet</p>
                      <p className="font-medium">{selectedAppointment.patient_first_name} {selectedAppointment.patient_last_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Email</p>
                      <p className="font-medium flex items-center gap-2">
                        <MailIcon className="w-4 h-4" />
                        {selectedAppointment.patient_email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Téléphone</p>
                      <p className="font-medium flex items-center gap-2">
                        <PhoneIcon className="w-4 h-4" />
                        {selectedAppointment.patient_phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Date d'inscription</p>
                      <p className="font-medium">
                        {new Date(selectedAppointment.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Détails du rendez-vous
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-foreground/60">Service</p>
                      <p className="font-medium">{selectedAppointment.service}</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Médecin</p>
                      <p className="font-medium">
                        {selectedAppointment.doctors ? (
                          <span className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {selectedAppointment.doctors.name} - {selectedAppointment.doctors.specialty}
                          </span>
                        ) : (
                          'Non assigné'
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Date</p>
                      <p className="font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(selectedAppointment.appointment_date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Heure</p>
                      <p className="font-medium flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {selectedAppointment.appointment_time}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Statut</p>
                      <div className="mt-1">{getStatusBadge(selectedAppointment.status)}</div>
                    </div>
                  </div>
                </Card>

                {selectedAppointment.notes && (
                  <Card className="p-4">
                    <h4 className="font-semibold text-foreground mb-3">Notes</h4>
                    <p className="text-foreground/80">{selectedAppointment.notes}</p>
                  </Card>
                )}

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setAppointmentDetailsOpen(false)}
                  >
                    Fermer
                  </Button>
                  {selectedAppointment.status === 'pending' && (
                    <>
                      <Button
                        onClick={() => {
                          handleUpdateAppointmentStatus(selectedAppointment.id, 'confirmed')
                          setAppointmentDetailsOpen(false)
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Confirmer
                      </Button>
                      <Button
                        variant="outline"
                        className="text-red-600 border-red-300 hover:bg-red-50"
                        onClick={() => {
                          handleUpdateAppointmentStatus(selectedAppointment.id, 'cancelled')
                          setAppointmentDetailsOpen(false)
                        }}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Annuler
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-300 hover:bg-red-50"
                    onClick={() => {
                      if (window.confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous ?')) {
                        handleDeleteAppointment(selectedAppointment.id)
                        setAppointmentDetailsOpen(false)
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Modal de détails du contact */}
      {contactDetailsOpen && selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-foreground">Détails du message</h3>
                  <p className="text-foreground/70">
                    Reçu le {new Date(selectedContact.created_at).toLocaleDateString('fr-FR')} à {new Date(selectedContact.created_at).toLocaleTimeString('fr-FR')}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setContactDetailsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-6">
                <Card className="p-4">
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Informations contact
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-foreground/60">Nom complet</p>
                      <p className="font-medium">{selectedContact.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Email</p>
                      <p className="font-medium flex items-center gap-2">
                        <MailIcon className="w-4 h-4" />
                        <a href={`mailto:${selectedContact.email}`} className="text-primary hover:underline">
                          {selectedContact.email}
                        </a>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Téléphone</p>
                      <p className="font-medium flex items-center gap-2">
                        <PhoneIcon className="w-4 h-4" />
                        {selectedContact.phone ? (
                          <a href={`tel:${selectedContact.phone}`} className="text-foreground hover:text-primary">
                            {selectedContact.phone}
                          </a>
                        ) : (
                          <span className="text-foreground/60">Non fourni</span>
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Statut</p>
                      <div className="mt-1">{getContactStatusBadge(selectedContact.status)}</div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Message
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-foreground/80 whitespace-pre-wrap">
                      {selectedContact.message}
                    </p>
                  </div>
                </Card>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setContactDetailsOpen(false)}
                  >
                    Fermer
                  </Button>
                  {selectedContact.status !== 'replied' && (
                    <Button
                      onClick={() => {
                        handleUpdateContactStatus(selectedContact.id, 'replied')
                        setMessage({ type: 'success', text: 'Contact marqué comme répondu' })
                        setContactDetailsOpen(false)
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Reply className="w-4 h-4 mr-2" />
                      Marquer comme répondu
                    </Button>
                  )}
                  {selectedContact.status !== 'archived' && (
                    <Button
                      variant="outline"
                      className="text-purple-600 border-purple-300 hover:bg-purple-50"
                      onClick={() => {
                        handleUpdateContactStatus(selectedContact.id, 'archived')
                        setMessage({ type: 'success', text: 'Contact archivé' })
                        setContactDetailsOpen(false)
                      }}
                    >
                      <Archive className="w-4 h-4 mr-2" />
                      Archiver
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-300 hover:bg-red-50"
                    onClick={() => {
                      if (window.confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) {
                        handleDeleteContact(selectedContact.id)
                        setContactDetailsOpen(false)
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}