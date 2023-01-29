export interface Voiture
{
    utilisateurId?: String,
    numero?: String,
    modele?: String,
    dateAjout?: Date,
    enCoursDepot?: boolean,
    voitureId?: String,
    identifiant?:String
    
}
export interface Utilisateur
{
    _id?: String,
    identifiant?: String,
    mail?: String,
    valid?: boolean,
    listeVoiture?:any,
    profil?:String
}