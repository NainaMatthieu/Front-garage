export interface ListeReparation
{
    _id?:String,
    idPiece?: string;
    piece?: Piece,
    prix?: string;
    avancement?: string;
    estPaye?:boolean,
    datePaiement?:Date,
    dateDebut?:Date,
    dateFin?:Date
}
export interface Piece 
{
    id?:string,
    designation?:string,
    prix?:number
}