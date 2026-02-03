'use client'

import React from "react"
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState, useEffect } from 'react'
import { CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

// Types
type Doctor = {
  id: number
  name: string
  specialty: string
}

const services = [
  'Consultation Générale',
  'Cardiologie',
  'Neurologie',
  'Orthopédie',
  'Ophtalmologie',
  'Pédiatrie',
  'Urgence',
  'Dermatologie',
  'Gynécologie',
  'Psychiatrie',
]

export default function Appointment() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    service: '',
    doctor: '',
    date: '',
    time: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([])
  const [error, setError] = useState('')

  // Charger les médecins depuis Supabase
  useEffect(() => {
    fetchDoctors()
  }, [])

  // Filtrer les médecins selon le service sélectionné
  useEffect(() => {
    if (formData.service) {
      const filtered = doctors.filter(doctor => 
        doctor.specialty.toLowerCase().includes(formData.service.toLowerCase()) ||
        formData.service.toLowerCase().includes('générale') ||
        formData.service.toLowerCase().includes('consultation générale')
      )
      setFilteredDoctors(filtered)
    } else {
      setFilteredDoctors([])
    }
  }, [formData.service, doctors])

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('id, name, specialty')
        .order('name')

      if (error) throw error
      
      if (data) {
        setDoctors(data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des médecins:', error)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (field === 'service') {
      setFormData(prev => ({ ...prev, doctor: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.service ||
      !formData.date ||
      !formData.time
    ) {
      setError('Veuillez remplir tous les champs obligatoires')
      return
    }

    try {
      setLoading(true)

      // Trouver l'ID du médecin sélectionné
      let doctorId = null
      if (formData.doctor) {
        // Chercher par nom complet ou par nom partiel
        const selectedDoctor = doctors.find(d => 
          d.name === formData.doctor || 
          formData.doctor.includes(d.name)
        )
        if (selectedDoctor) {
          doctorId = selectedDoctor.id
        }
      }

      // Formater la date et l'heure
      const appointmentDate = new Date(formData.date).toISOString().split('T')[0]
      
      // Enregistrer le rendez-vous dans Supabase
      const { data, error } = await supabase
        .from('appointments')
        .insert([
          {
            patient_first_name: formData.firstName.trim(),
            patient_last_name: formData.lastName.trim(),
            patient_email: formData.email.trim(),
            patient_phone: formData.phone.trim(),
            service: formData.service,
            doctor_id: doctorId,
            appointment_date: appointmentDate,
            appointment_time: formData.time,
            status: 'pending',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .single()

      if (error) {
        console.error('Erreur Supabase:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw error
      }

      console.log('Rendez-vous enregistré avec succès:', data)
      
      // Simuler l'envoi d'un email
      console.log(`Email de confirmation envoyé à ${formData.email}`)
      
      setSubmitted(true)
      setTimeout(() => {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          service: '',
          doctor: '',
          date: '',
          time: '',
        })
        setSubmitted(false)
      }, 3000)

    } catch (error: any) {
      console.error('Erreur complète:', error)
      
      let errorMessage = 'Une erreur est survenue. Veuillez réessayer.'
      
      if (error.message) {
        if (error.message.includes('violates row-level security policy')) {
          errorMessage = 'Erreur de sécurité. Contactez l\'administrateur.'
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Erreur de connexion. Vérifiez votre internet.'
        } else {
          errorMessage = error.message
        }
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Calculer la date minimale (aujourd'hui) et maximale (6 mois)
  const today = new Date().toISOString().split('T')[0]
  const maxDate = new Date()
  maxDate.setMonth(maxDate.getMonth() + 6)
  const maxDateString = maxDate.toISOString().split('T')[0]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Prendre un Rendez-vous
            </h1>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Remplissez le formulaire ci-dessous pour réserver votre consultation.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 sm:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-6 sm:p-8">
            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Rendez-vous Confirmé!
                </h2>
                <p className="text-foreground/70 mb-4">
                  Merci pour votre réservation. Vous recevrez une confirmation par email.
                </p>
                <p className="text-sm text-foreground/60">
                  Un email de confirmation a été envoyé à {formData.email}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Erreur */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm font-medium">{error}</p>
                  </div>
                )}

                {/* Personal Info */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Informations Personnelles
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-foreground">
                        Prénom *
                      </Label>
                      <Input
                        id="firstName"
                        placeholder="Votre prénom"
                        value={formData.firstName}
                        onChange={(e) => handleChange('firstName', e.target.value)}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-foreground">
                        Nom *
                      </Label>
                      <Input
                        id="lastName"
                        placeholder="Votre nom"
                        value={formData.lastName}
                        onChange={(e) => handleChange('lastName', e.target.value)}
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Informations de Contact
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email" className="text-foreground">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="votre.email@example.com"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-foreground">
                        Téléphone *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+33 1 23 45 67 89"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Medical Info */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Informations Médicales
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="service" className="text-foreground">
                        Service *
                      </Label>
                      <Select 
                        value={formData.service} 
                        onValueChange={(value) => handleChange('service', value)}
                      >
                        <SelectTrigger id="service" className="mt-1">
                          <SelectValue placeholder="Sélectionnez un service" />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((service) => (
                            <SelectItem key={service} value={service}>
                              {service}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="doctor" className="text-foreground">
                        Médecin (optionnel)
                      </Label>
                      <Select 
                        value={formData.doctor} 
                        onValueChange={(value) => handleChange('doctor', value)}
                        disabled={!formData.service}
                      >
                        <SelectTrigger id="doctor" className="mt-1">
                          <SelectValue placeholder={
                            !formData.service 
                              ? "Sélectionnez d'abord un service"
                              : filteredDoctors.length === 0
                              ? "Aucun médecin disponible"
                              : "Sélectionnez un médecin"
                          } />
                        </SelectTrigger>
                        <SelectContent>
                          {/* CORRECTION : J'ai ajouté une valeur non-vide pour l'option "Aucun médecin spécifique" */}
                          <SelectItem key="none" value="none">
                            Aucun médecin spécifique
                          </SelectItem>
                          {filteredDoctors.map((doctor) => (
                            <SelectItem key={doctor.id} value={doctor.name}>
                              {doctor.name} - {doctor.specialty}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formData.service && filteredDoctors.length === 0 && (
                        <p className="text-sm text-foreground/60 mt-1">
                          Aucun médecin spécialisé dans ce service. Un médecin généraliste vous sera assigné.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Appointment Details */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Détails du Rendez-vous
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date" className="text-foreground">
                        Date *
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleChange('date', e.target.value)}
                        className="mt-1"
                        required
                        min={today}
                        max={maxDateString}
                      />
                      <p className="text-xs text-foreground/60 mt-1">
                        Prochains 6 mois seulement
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="time" className="text-foreground">
                        Heure *
                      </Label>
                      <Input
                        id="time"
                        type="time"
                        value={formData.time}
                        onChange={(e) => handleChange('time', e.target.value)}
                        className="mt-1"
                        required
                        min="08:00"
                        max="19:00"
                        step="900" // 15 minutes
                      />
                      <p className="text-xs text-foreground/60 mt-1">
                        Horaires: 08h00 - 19h00 (par tranches de 15min)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg font-semibold"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enregistrement...
                    </>
                  ) : 'Confirmer la Réservation'}
                </Button>
                
                <p className="text-xs text-foreground/60 text-center">
                  * Champs obligatoires
                </p>
              </form>
            )}
          </Card>

          {/* Info Box */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 bg-primary/5">
              <h3 className="font-semibold text-foreground mb-2">Horaires</h3>
              <ul className="space-y-1 text-sm text-foreground/70">
                <li>Lundi - Vendredi: 08h - 19h</li>
                <li>Samedi: 09h - 17h</li>
                <li>Dimanche: Fermé</li>
                <li className="pt-2 font-semibold text-foreground">Urgences: 24h/24</li>
              </ul>
            </Card>
            <Card className="p-6 bg-primary/5">
              <h3 className="font-semibold text-foreground mb-2">Besoin d'aide?</h3>
              <p className="text-sm text-foreground/70 mb-3">
                Contactez-nous directement par téléphone.
              </p>
              <a
                href="tel:+33123456789"
                className="text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                +33 1 23 45 67 89
              </a>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}