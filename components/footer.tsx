import Link from 'next/link'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-foreground text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm"></span>
              </div>
              <span className="font-semibold"></span>
            </div>
            <p className="text-sm text-gray-300">
              Votre partenaire de confiance pour des soins médicaux de qualité et un bien-être optimal.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/" className="hover:text-white transition-colors">Accueil</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Services</Link></li>
              <li><Link href="/doctors" className="hover:text-white transition-colors">Médecins</Link></li>
              <li><Link href="/appointment" className="hover:text-white transition-colors">Rendez-vous</Link></li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Horaires
            </h3>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>Lun - Ven: 08h - 19h</li>
              <li>Samedi: 09h - 17h</li>
              <li>Dimanche: Fermé</li>
              <li className="pt-2">Urgences: 24h/24</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-gray-300">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Algerie<br/>Alger</span>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a href="tel:+33123456789" className="hover:text-white transition-colors">+213 1 23 45 67 89</a>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href="mailto:info@medicare.fr" className="hover:text-white transition-colors">info@medicare.fr</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <p className="text-sm text-gray-400 text-center">
            © 2026 MediCare Clinique & Hôpital. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}
