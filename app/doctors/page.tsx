'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Phone, Mail, Clock, User, Star, MapPin, Award } from 'lucide-react'

// Interface Doctor locale pour éviter les problèmes d'import
interface Doctor {
  id: string
  name: string
  specialty: string
  experience: string
  hours: string
  phone: string
  email: string
  bio: string
  photo_url: string
  createdAt?: Date
  updatedAt?: Date
}

export default function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Charger les médecins
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Essayer de récupérer depuis Supabase
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        
        if (supabaseUrl && supabaseKey) {
          const response = await fetch(`${supabaseUrl}/rest/v1/doctors?select=*`, {
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json'
            }
          })
          
          if (response.ok) {
            const data = await response.json()
            if (data && data.length > 0) {
              // Convertir les données Supabase au format attendu
              const formattedDoctors: Doctor[] = data.map((doc: any) => ({
                id: doc.id?.toString() || Math.random().toString(),
                name: doc.name || 'Médecin',
                specialty: doc.specialty || 'Spécialité non définie',
                experience: doc.experience || 'Expérience non spécifiée',
                hours: doc.hours || 'Horaires non définis',
                phone: doc.phone || '',
                email: doc.email || '',
                bio: doc.bio || 'Aucune biographie disponible.',
                photo_url: doc.photo_url || '',
                createdAt: doc.created_at ? new Date(doc.created_at) : new Date(),
                updatedAt: doc.updated_at ? new Date(doc.updated_at) : new Date()
              }))
              setDoctors(formattedDoctors)
              return
            }
          }
        }
        
        // Si Supabase échoue ou n'est pas configuré, utiliser les données par défaut
        setDoctors(getDefaultDoctors())
        
      } catch (err) {
        console.error('Erreur lors du chargement des médecins:', err)
        setError('Impossible de charger les médecins. Affichage des données par défaut.')
        setDoctors(getDefaultDoctors())
      } finally {
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [])

  const getDefaultDoctors = (): Doctor[] => {
    return [
      {
        id: '1',
        name: 'Dr. Jean Martin',
        specialty: 'Cardiologie',
        experience: '15 ans',
        hours: 'Lun - Ven: 09h - 17h',
        phone: '+33 1 23 45 67 89',
        email: 'j.martin@doctor-photos.fr',
        bio: 'Spécialiste reconnu en cardiologie avec expertise en angioplastie et traitement des arythmies.',
        photo_url: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'Dr. Sophie Dubois',
        specialty: 'Neurologie',
        experience: '12 ans',
        hours: 'Mar - Sam: 10h - 18h',
        phone: '+33 1 23 45 67 90',
        email: 's.dubois@doctor-photos.fr',
        bio: 'Neurologue expérimentée avec spécialisation en troubles neurologiques et neurosciences cliniques.',
        photo_url: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3',
        name: 'Dr. Pierre Lambert',
        specialty: 'Médecine Générale',
        experience: '20 ans',
        hours: 'Lun - Sam: 08h - 19h',
        phone: '+33 1 23 45 67 91',
        email: 'p.lambert@doctor-photos.fr',
        bio: 'Médecin généraliste avec une approche holistique de la santé. Spécialisé en médecine préventive.',
        photo_url: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]
  }

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-foreground/70">Chargement des médecins...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Notre Équipe Médicale
            </h1>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto mb-8">
              Rencontrez nos médecins spécialistes hautement qualifiés et expérimentés.
            </p>
            <div className="inline-flex flex-wrap items-center justify-center gap-4 text-sm text-foreground/60">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span>Experts certifiés</span>
              </div>
              <div className="h-4 w-px bg-foreground/20 hidden sm:block"></div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Disponibles à distance</span>
              </div>
              <div className="h-4 w-px bg-foreground/20 hidden sm:block"></div>
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4 text-green-500" />
                <span>+10 ans d'expérience moyenne</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Message d'erreur */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  {error}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Doctors Grid */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {doctors.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-12 h-12 text-primary/50" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Aucun médecin disponible
              </h3>
              <p className="text-foreground/70 max-w-md mx-auto">
                Notre équipe médicale sera bientôt complète. Revenez plus tard pour rencontrer nos spécialistes.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-3">
                  {doctors.length} Médecin{doctors.length > 1 ? 's' : ''} Disponible{doctors.length > 1 ? 's' : ''}
                </h2>
                <p className="text-foreground/70">
                  Tous nos médecins sont certifiés et disponibles pour des consultations
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {doctors.map((doctor) => (
                  <Card
                    key={doctor.id}
                    className="overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full"
                  >
                    {/* Photo du médecin */}
                    <div className="relative h-48 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center overflow-hidden">
                      {doctor.photo_url ? (
                        <div className="absolute inset-0">
                          <img 
                            src={doctor.photo_url} 
                            alt={doctor.name}
                            className="w-full h-full object-cover opacity-90"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
                        </div>
                      ) : (
                        <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-2xl">
                          {getInitials(doctor.name)}
                        </div>
                      )}
                      
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                          <h3 className="text-lg font-semibold text-foreground mb-1 line-clamp-1">
                            {doctor.name}
                          </h3>
                          <p className="text-primary font-medium text-sm line-clamp-1">
                            {doctor.specialty}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <div className="mb-4 flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-foreground/70">Expérience</span>
                          <span className="text-sm font-semibold text-foreground">
                            {doctor.experience || 'Non spécifiée'}
                          </span>
                        </div>
                        
                        {doctor.hours && (
                          <div className="flex items-start gap-2 text-sm text-foreground/70 mb-4">
                            <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span className="truncate">{doctor.hours}</span>
                          </div>
                        )}

                        {expandedId === doctor.id ? (
                          <div className="space-y-4 mb-6">
                            <div>
                              <h4 className="font-semibold text-foreground mb-2 text-sm">À propos</h4>
                              <p className="text-foreground/80 text-sm leading-relaxed">
                                {doctor.bio || 'Aucune biographie disponible.'}
                              </p>
                            </div>
                            
                            <div className="space-y-2">
                              {doctor.phone && (
                                <a
                                  href={`tel:${doctor.phone.replace(/\s/g, '')}`}
                                  className="flex items-center gap-2 text-sm text-foreground/70 hover:text-primary transition-colors group"
                                >
                                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <Phone className="w-4 h-4" />
                                  </div>
                                  <span>{doctor.phone}</span>
                                </a>
                              )}
                              {doctor.email && (
                                <a
                                  href={`mailto:${doctor.email}`}
                                  className="flex items-center gap-2 text-sm text-foreground/70 hover:text-primary transition-colors group"
                                >
                                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <Mail className="w-4 h-4" />
                                  </div>
                                  <span className="truncate">{doctor.email}</span>
                                </a>
                              )}
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-foreground/70 mb-6 line-clamp-3 min-h-[60px]">
                            {doctor.bio || 'Aucune biographie disponible.'}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-3 mt-auto pt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setExpandedId(expandedId === doctor.id ? null : doctor.id)}
                          className="flex-1"
                        >
                          {expandedId === doctor.id ? 'Réduire' : 'Voir plus'}
                        </Button>
                        <Link href="/appointment" className="flex-1" passHref>
                          <Button 
                            size="sm" 
                            className="w-full bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-shadow"
                          >
                            Prendre RDV
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              {/* Call to Action */}
              <div className="mt-16 text-center">
                <Card className="p-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-2 border-dashed border-primary/20">
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    Vous ne trouvez pas votre spécialiste ?
                  </h3>
                  <p className="text-foreground/70 mb-6 max-w-lg mx-auto">
                    Contactez-nous pour être mis en relation avec le médecin qui correspond à vos besoins.
                  </p>
                  <Link href="/contact" passHref>
                    <Button size="lg" className="bg-primary hover:bg-primary/90">
                      Nous contacter
                    </Button>
                  </Link>
                </Card>
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}