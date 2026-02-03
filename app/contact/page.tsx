'use client'

import React from "react"
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | '', text: string }>({ type: '', text: '' })

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name || !formData.email || !formData.message) {
      setMessage({ type: 'error', text: 'Veuillez remplir tous les champs obligatoires' })
      return
    }

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setMessage({ type: 'error', text: 'Veuillez entrer un email valide' })
      return
    }

    try {
      setLoading(true)
      setMessage({ type: '', text: '' })

      // Envoyer les données à Supabase
      const { data, error } = await supabase
        .from('contacts')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          message: formData.message,
          status: 'unread', // Statut initial
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) {
        console.error('Erreur Supabase:', error)
        throw error
      }

      // Succès
      setMessage({ 
        type: 'success', 
        text: 'Message envoyé avec succès! Nous vous répondrons dans les plus brefs délais.' 
      })
      
      // Réinitialiser le formulaire
      setFormData({ 
        name: '', 
        email: '', 
        phone: '', 
        message: '' 
      })

      // Optionnel : Réinitialiser le message après quelques secondes
      setTimeout(() => {
        setMessage({ type: '', text: '' })
      }, 5000)

    } catch (error: any) {
      console.error('Erreur complète:', error)
      setMessage({ 
        type: 'error', 
        text: error.message || 'Une erreur est survenue. Veuillez réessayer.' 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Nous Contacter
            </h1>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Nous sommes ici pour répondre à vos questions et préoccupations.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Message d'alerte */}
          {message.text && (
            <Alert className={`mb-6 max-w-2xl mx-auto ${
              message.type === 'error' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
            }`}>
              <AlertDescription className={message.type === 'error' ? 'text-red-800' : 'text-green-800'}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Address */}
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Adresse</h3>
                    <p className="text-foreground/70 text-sm">
                      123 Avenue de la Santé<br />
                      75000 Paris<br />
                      France
                    </p>
                  </div>
                </div>
              </Card>

              {/* Phone */}
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Téléphone</h3>
                    <a
                      href="tel:+33123456789"
                      className="text-primary hover:text-primary/80 font-medium block mb-2"
                    >
                      +33 1 23 45 67 89
                    </a>
                    <p className="text-sm text-foreground/70">
                      Disponible du lun - ven: 08h - 19h<br />
                      Samedi: 09h - 17h
                    </p>
                  </div>
                </div>
              </Card>

              {/* Email */}
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Email</h3>
                    <a
                      href="mailto:info@medicare.fr"
                      className="text-primary hover:text-primary/80 font-medium block"
                    >
                      info@medicare.fr
                    </a>
                  </div>
                </div>
              </Card>

              {/* Hours */}
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <Clock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Horaires</h3>
                    <ul className="text-sm text-foreground/70 space-y-1">
                      <li>Lun - Ven: 08h - 19h</li>
                      <li>Samedi: 09h - 17h</li>
                      <li>Dimanche: Fermé</li>
                      <li className="pt-2 font-semibold text-foreground">
                        Urgences: 24h/24
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-foreground">
                        Nom *
                      </Label>
                      <Input
                        id="name"
                        placeholder="Votre nom complet"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="mt-1"
                        required
                        disabled={loading}
                      />
                    </div>
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
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-foreground">
                      Téléphone (optionnel)
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+33 1 23 45 67 89"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="mt-1"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-foreground">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Votre message..."
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      className="mt-1 min-h-32"
                      required
                      disabled={loading}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Envoyer le Message
                      </>
                    )}
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-primary/5 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 text-center">
            Notre Localisation
          </h2>
          <div className="relative h-96 bg-muted rounded-lg overflow-hidden">
            <iframe
              title="MediCare Location"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9916256465157!2d2.3522219!3d48.8566140!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e2964e34e2d%3A0x8ddca9ee380ef7e0!2sParis!5e0!3m2!1sfr!2sfr!4v1640000000000"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}