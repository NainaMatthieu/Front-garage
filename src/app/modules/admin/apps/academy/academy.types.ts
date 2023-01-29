export interface Category
{
    id?: string;
    title?: string;
    slug?: string;
}

export interface Course
{
    id?: string;
    title?: string;
    slug?: string;
    description?: string;
    category?: string;
    duration?: number;
    steps?: {
        order?: number;
        title?: string;
        subtitle?: string;
        content?: string;
    }[];
    totalSteps?: number;
    updatedAt?: number;
    featured?: boolean;
    progress?: {
        currentStep?: number;
        completed?: number;
    };
}

export interface ListeReparation
{
    idPiece?: string;
    piece?: Piece,
    prix?: string;
    avancement?: string;
    estPaye?:boolean,
    datePaiement?:Date,
    dateDebut?:Date,
    dateFin?:Date
}

export interface ReparationsVoitures
{
    idVoiture?: string,
    voiture?: Voiture,
    listeReparations?: ListeReparation[],
    dateArrivee?: Date,
    dateSortie?: Date,
    etat?: String
}

export interface Voiture 
{
    id?:string,
    modele?:string,
    numero?:string
}

export interface Piece 
{
    id?:string,
    designation?:string,
    prix?:number
}


