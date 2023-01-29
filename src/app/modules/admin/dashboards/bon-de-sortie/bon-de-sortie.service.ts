import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { baseUrl } from 'environments/environment';
import { Utilisateur, Voiture } from './bon-de-sortie.types';


@Injectable({
    providedIn: 'root'
})
export class BonDeSortieService
{
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);
    private listeVoiture: BehaviorSubject<Voiture[]> = new BehaviorSubject(null);
    private _voiture: BehaviorSubject<Voiture> = new BehaviorSubject(null);
    private _proprietaire: BehaviorSubject<any> = new BehaviorSubject(null);
    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }
    /**
    * Getter for listeVoiture
    */
    get listeVoiture$(): Observable<Voiture[]>
    {
        return this.listeVoiture.asObservable();
    }
    /**
    * Getter for Voiture
    */
    get voiture$(): Observable<Voiture>
    {
        return this._voiture.asObservable();
    }
     /**
    * Getter for Propriétaire de la voiture
    */
     get proprietaire$(): Observable<any>
     {
         return this._proprietaire.asObservable();
     }
    /**
     * Get listeVoiture
     */
    getListeVoiture(): Observable<any>
    {
        let url = baseUrl+'user/carlist';
        return this._httpClient.get<Voiture[]>(url).pipe(
            tap((response:any) => {
                if(response.message==='OK'){
                    let liste = response.value
                    const newList = liste.map(user => {
                    return user.listeVoiture.map(voiture => {
                        return {
                            utilisateurId: user._id,
                            numero: voiture.numero,
                            modele: voiture.modele,
                            dateAjout: voiture.dateAjout,
                            enCoursDepot: voiture.enCoursDepot,
                            voitureId: voiture._id,
                            identifiant : user.identifiant.charAt(0).toUpperCase()+user.identifiant.substring(1,user.identifiant.length)
                        };
                    });
                }).flat();
                    this.listeVoiture.next(newList);
                }
               
            })
        );
    }
    /**
     * Get propriétaire
     */
    getPropriétaire(idUser): Observable<Utilisateur>
    {
        console.log('APpel getProprio : '+idUser)
        let url = baseUrl+'user/proprio/'+idUser;
        return this._httpClient.get<any>(url).pipe(
            tap((response:any) => {
                if(response.message==='OK'){
                    // this._proprietaire =  new BehaviorSubject(null);
                    const utilisateur  = {
                        _id : response.value._id ,
                        identifiant : response.value.identifiant.charAt(0).toUpperCase()+response.value.identifiant.substring(1,response.value.identifiant.length),
                        mail: response.value.mail,
                        valid: response.value._id ,
                        listeVoiture: response.value.listeVoiture,
                        profil: response.value.profil
                    }
                    this._proprietaire.next(utilisateur);
                }
               
            })
        );
    }
    getAllCar(): Observable<any>{
        let url = baseUrl+'user/carlist';
        return this._httpClient.get(url);
    }
    /**
     * Get voiture
     * @param id
     */
    getVoitureById(id: String): Observable<Voiture> {
        return this.listeVoiture.pipe(
          map(voitures => {
            const voiture = voitures.find(v => v.voitureId === id);
            this.getPropriétaire(voiture.utilisateurId).subscribe()
            this._voiture.next(voiture);
            return voiture;
          }),
          switchMap(voiture => {
            if (!voiture) {
              return throwError(`La voiture avec l'id :  ${id} est introuvable!`);
            }
            return of(voiture);
          })
        );
      }
}
