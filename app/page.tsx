'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { Heart, Users, Award, Stethoscope, Star, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import Image from "next/image"

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

export default function Home() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      id: 1,
      name: 'Marie Dubois',
      role: 'Patiente régulière',
      content: 'Excellent service ! Le personnel est très attentionné et les médecins prennent le temps d\'écouter. Je recommande vivement cette clinique.',
      rating: 5,
      is_active: true,
      photo_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Thomas Martin',
      role: 'Patient cardiologie',
      content: 'Suivi exceptionnel pour mon problème cardiaque. Le Dr. Dubois est compétent et rassurant. Les résultats sont au rendez-vous.',
      rating: 5,
      is_active: true,
      photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      name: 'Sophie Laurent',
      role: 'Mère de famille',
      content: 'Le pédiatre est formidable avec les enfants. Mon fils adore ses visites ! Service rapide et professionnel.',
      rating: 5,
      is_active: true,
      photo_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      created_at: new Date().toISOString()
    },
    {
      id: 4,
      name: 'Pierre Bernard',
      role: 'Patient dermatologie',
      content: 'Résolution de mon problème de peau en seulement 2 séances. Le Dr. Martin est un expert dans son domaine.',
      rating: 4,
      is_active: true,
      photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      created_at: new Date().toISOString()
    },
    {
      id: 5,
      name: 'Claire Moreau',
      role: 'Patiente gynécologie',
      content: 'Accompagnement exceptionnel pendant ma grossesse. Équipe disponible et à l\'écoute à tout moment.',
      rating: 5,
      is_active: true,
      photo_url: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=100&h=100&fit=crop&crop=face',
      created_at: new Date().toISOString()
    },
    {
      id: 6,
      name: 'Jean Dupont',
      role: 'Patient orthopédie',
      content: 'Opération réussie et rééducation rapide. Merci à toute l\'équipe pour leur professionnalisme.',
      rating: 5,
      is_active: true,
      photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      created_at: new Date().toISOString()
    }
  ])
  
  const [loading, setLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (testimonials.length <= 3) return

    const interval = setInterval(() => {
      setActiveIndex((prev) => 
        prev >= testimonials.length - 3 ? 0 : prev + 1
      )
    }, 4000)

    return () => clearInterval(interval)
  }, [testimonials.length])

  const displayedTestimonials = testimonials.slice(activeIndex, activeIndex + 3)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Hero Section - Resté identique */}
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-12 sm:py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 text-balance">
                Votre Santé, Notre Priorité
              </h1>
              <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
                Bienvenue à MediCare, votre partenaire de confiance pour des soins médicaux de qualité. Nous proposons une gamme complète de services médicaux avec une équipe dévouée de professionnels de santé.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/appointment">
                  <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg">
                    Prendre un Rendez-vous
                  </Button>
                </Link>
                <Link href="/services">
                  <Button variant="outline" className="px-8 py-6 text-lg bg-transparent">
                    Voir nos Services
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
<div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl h-96 flex items-center justify-center overflow-hidden">
  <Image
    src="/clinic.jpg"
    alt="Clinique"
    width={600}
    height={400}
    className="w-full h-full object-cover rounded-3xl"
  />
</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Resté identique */}
      <section className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Pourquoi Choisir MediCare?
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Nous nous engageons à fournir des soins de qualité supérieure avec un service client exceptionnel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Heart,
                title: 'Soins Complets',
                description: 'Services médicaux complets couvrant tous les besoins en santé',
              },
              {
                icon: Users,
                title: 'Équipe Qualifiée',
                description: 'Médecins et professionnels expérimentés et certifiés',
              },
              {
                icon: Award,
                title: 'Excellence Médicale',
                description: 'Standards internationaux et équipements modernes',
              },
              {
                icon: Stethoscope,
                title: 'Disponibilité 24/7',
                description: 'Service d\'urgence disponible jour et nuit',
              },
            ].map((feature, idx) => (
              <Card key={idx} className="p-6 text-center hover:shadow-lg transition-shadow">
                <feature.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-foreground/70 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section - Resté identique */}
      <section className="bg-primary/5 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="hidden lg:block">
              <div className="bg-gradient-to-br from-primary/30 to-secondary/30 rounded-3xl h-96 relative rounded-3xl overflow-hidden">
                <Image
                  src="pngtree-diverse-medical-team-in-hospital-corridor-smiling-image_19835062.webp"
                  alt="MediCare"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                À Propos de MediCare
              </h2>
              <p className="text-lg text-foreground/80 mb-4 leading-relaxed">
                Depuis plus de 20 ans, MediCare est un établissement médical leader en proposant des services de santé de qualité. Notre mission est de fournir les meilleurs soins possibles à nos patients dans un environnement accueillant et sécurisé.
              </p>
              <p className="text-lg text-foreground/80 mb-6 leading-relaxed">
                Notre équipe multidisciplinaire de médecins spécialistes, infirmiers et techniciens médicaux travaille ensemble pour assurer que chaque patient reçoit un traitement personnalisé et de haute qualité.
              </p>
              <Link href="/doctors">
                <Button className="bg-primary hover:bg-primary/90 text-white">
                  Rencontrer nos Médecins
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Améliorée mais avec le même style */}
      <section className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Avis de nos Patients
            </h2>
            <p className="text-lg text-foreground/70">
              Ce que disent nos patients satisfaits
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-4 text-foreground/70">Chargement des avis...</p>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-foreground/70">Aucun avis disponible pour le moment.</p>
            </div>
          ) : (
            <>
              {/* Indicateurs de carousel */}
              <div className="flex justify-center gap-2 mb-8">
                {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx * 3)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      Math.floor(activeIndex / 3) === idx 
                        ? 'bg-primary' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>

              {/* Carousel des avis */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {displayedTestimonials.map((testimonial) => (
                  <Card key={testimonial.id} className="p-6 border-l-4 border-l-primary hover:shadow-lg transition-shadow group">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <span 
                          key={i} 
                          className={`text-lg ${i < testimonial.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-foreground/80 mb-4 italic leading-relaxed min-h-[80px]">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      {testimonial.photo_url ? (
                        <img 
                          src={testimonial.photo_url} 
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-6 h-6 text-primary" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-foreground">{testimonial.name}</p>
                        <p className="text-sm text-foreground/60">{testimonial.role}</p>
                        <p className="text-xs text-foreground/40 mt-1">
                          {new Date(testimonial.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Stats des avis */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
                <div className="bg-primary/5 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary mb-1">4.9/5</div>
                  <p className="text-sm text-foreground/70">Note moyenne</p>
                </div>
                <div className="bg-primary/5 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary mb-1">500+</div>
                  <p className="text-sm text-foreground/70">Avis vérifiés</p>
                </div>
                <div className="bg-primary/5 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary mb-1">96%</div>
                  <p className="text-sm text-foreground/70">Recommanderait</p>
                </div>
                <div className="bg-primary/5 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary mb-1">24h</div>
                  <p className="text-sm text-foreground/70">Réponse aux avis</p>
                </div>
              </div>

              {/* Bouton pour voir plus d'avis */}
              <div className="text-center mt-8">
                <Link href="/testimonials">

                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section - Resté identique */}
      <section className="bg-primary text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Prêt à Prendre Soin de Votre Santé?
          </h2>
          <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
            Prenez rendez-vous dès aujourd'hui et laissez notre équipe qualifiée s'occuper de vous.
          </p>
          <Link href="/appointment">
            <Button className="bg-white text-primary hover:bg-gray-100 px-8 py-6 text-lg font-semibold">
              Prendre un Rendez-vous Maintenant
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}