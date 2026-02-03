import { createClient } from '@supabase/supabase-js'

// Vérifiez si les variables d'environnement sont définies
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Créer le client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Interface Doctor
export interface Doctor {
  id: number  // Note: Dans votre code admin, c'est number, dans votre page c'est string
  name: string
  specialty: string
  experience: string
  hours: string
  phone: string
  email: string
  bio: string
  photo_url: string | null
  createdAt?: Date
  updatedAt?: Date
}

// Fonction pour récupérer les médecins
export async function getDoctors(): Promise<Doctor[]> {
  try {
    console.log('Tentative de récupération des médecins...')
    
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .order('name')

    if (error) {
      console.error('Erreur Supabase:', error)
      throw error
    }

    console.log('Médecins récupérés:', data)
    return data || []
  } catch (error) {
    console.error('Erreur dans getDoctors:', error)
    return []
  }
}