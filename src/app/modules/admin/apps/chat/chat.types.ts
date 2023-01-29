export interface Profile
{
    id?: string;
    name?: string;
    email?: string;
    avatar?: string;
    about?: string;
}

export interface Contact
{
    id?: string;
    avatar?: string;
    name?: string;
    about?: string;
    details?: {
        emails?: {
            email?: string;
            label?: string;
        }[];
        phoneNumbers?: {
            country?: string;
            phoneNumber?: string;
            label?: string;
        }[];
        title?: string;
        company?: string;
        birthday?: string;
        address?: string;
    };
    attachments?: {
        media?: any[];
        docs?: any[];
        links?: any[];
    };
}

export interface Chat
{
    id?: string;
    contactId?: string;
    contact?: Contact;
    unreadCount?: number;
    muted?: boolean;
    lastMessage?: string;
    lastMessageAt?: string;
    messages?: {
        id?: string;
        chatId?: string;
        contactId?: string;
        isMine?: boolean;
        value?: string;
        createdAt?: string;
    }[];
}
export interface Voiture
{
    utilisateurId?: String,
    numero?: String,
    modele?: String,
    dateAjout?: Date,
    enCoursDepot?: boolean,
    voitureId?: String
    
}
export class DemandePaiement
{
    _id?: String;
    idReparation?: String;
    totalDue?: Number;
    piece?: Piece;
    date?: Date;
    idVoiture?: String;
    idUser?: String;
    isChecked:Boolean = false;
}
export interface Piece 
{
    id?:string,
    designation?:string,
    prix?:number
}
export interface toggleCheck{
    index?:Number,
    checked?:Boolean
}