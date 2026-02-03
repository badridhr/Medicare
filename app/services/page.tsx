import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card } from '@/components/ui/card'
import { Activity, Heart, Eye, Zap, Users, Pill, Brain, Bone } from 'lucide-react'

const services = [
  {
    icon: Heart,
    title: 'Cardiologie',
    description: 'Diagnostic et traitement des maladies cardiovasculaires avec les technologies les plus avancées.',
    features: ['Échocardiographie', 'ECG', 'Monitoring cardiaque'],
  },
  {
    icon: Eye,
    title: 'Ophtalmologie',
    description: 'Soins complets des yeux et correction des défauts visuels par les meilleures techniques.',
    features: ['Examen complet', 'Chirurgie de la cataracte', 'Laser LASIK'],
  },
  {
    icon: Brain,
    title: 'Neurologie',
    description: 'Spécialité en diagnostic et traitement des troubles neurologiques et du système nerveux.',
    features: ['EEG', 'Neuro-imagerie', 'Traitement spécialisé'],
  },
  {
    icon: Bone,
    title: 'Orthopédie',
    description: 'Services de diagnostic et traitement des problèmes musculo-squelettiques et fractures.',
    features: ['Radiographie', 'Chirurgie orthopédique', 'Rééducation'],
  },
  {
    icon: Activity,
    title: 'Médecine Générale',
    description: 'Consultations médicales généralistes pour le suivi et la prévention de la santé.',
    features: ['Consultations', 'Bilans de santé', 'Vaccinations'],
  },
  {
    icon: Pill,
    title: 'Pharmacie',
    description: 'Service pharmaceutique complet avec conseil professionnel et ordonnances préparées.',
    features: ['Médicaments génériques', 'Conseils pharmacologiques', 'Livraison'],
  },
  {
    icon: Zap,
    title: 'Urgences',
    description: 'Service d\'urgence 24h/24 pour les situations d\'urgence médicale avec équipe d\'urgentistes.',
    features: ['Prise en charge immédiate', 'Stabilisation', 'Orientation'],
  },
  {
    icon: Users,
    title: 'Pédiatrie',
    description: 'Soins spécialisés pour enfants avec approche douce et bienveillante.',
    features: ['Consultations enfants', 'Vaccinations', 'Suivi pédiatrique'],
  },
]

export default function Services() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Nos Services Médicaux
            </h1>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Découvrez la gamme complète de services de santé disponibles à MediCare.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, idx) => (
              <Card
                key={idx}
                className="p-6 hover:shadow-xl transition-all hover:-translate-y-2 border border-border"
              >
                <service.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {service.title}
                </h3>
                <p className="text-foreground/70 text-sm mb-4 leading-relaxed">
                  {service.description}
                </p>
                <div className="space-y-2">
                  {service.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-accent mt-1">•</span>
                      <span className="text-foreground/80">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-primary/5 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">8+</div>
              <p className="text-foreground/70">Services Spécialisés</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <p className="text-foreground/70">Médecins Expérimentés</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <p className="text-foreground/70">Service d'Urgence</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
